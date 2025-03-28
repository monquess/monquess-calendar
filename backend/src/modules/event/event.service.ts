import { CurrentUser } from '@common/decorators/current-user.decorator';
import { EnvironmentVariables } from '@config/env/environment-variables.config';
import { CalendarService } from '@modules/calendar/calendar.service';
import { CalendarEntity } from '@modules/calendar/entities/calendar.entity';
import { NotificationService } from '@modules/notification/notification.service';
import { EventInvitationNotification } from '@modules/notification/notifications/event-invitation.notification';
import { ReminderNotification } from '@modules/notification/notifications/reminder.notification';
import { PrismaService } from '@modules/prisma/prisma.service';
import { UserService } from '@modules/user/user.service';
import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	CalendarType,
	EventType,
	InvitationStatus,
	Role,
} from '@prisma/client';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { firstValueFrom, map } from 'rxjs';
import {
	COUNTRIES,
	CountryCode,
} from '../../common/constants/country-codes.constant';
import {
	CreateEventDto,
	CreateEventMemberDto,
	FilteringOptionsDto,
	UpdateEventDto,
	UpdateEventMemberRoleDto,
	UpdateEventMemberStatusDto,
} from './dto/';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { EventMemberEntity } from './entities/event-member.entity';
import { EventEntity } from './entities/event.entity';
import { ReminderEntity } from './entities/reminder.entity';
import { GoogleHolidayResponse } from './interfaces/google-holiday-response.interface';

@Injectable()
export class EventService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly calendarService: CalendarService,
		private readonly notificationService: NotificationService,
		private readonly configService: ConfigService<EnvironmentVariables, true>,
		private readonly httpService: HttpService,
		private readonly userService: UserService
	) {}

	async findById(id: number, currentUser: CurrentUser): Promise<EventEntity> {
		const event = await this.prisma.event.findUniqueOrThrow({
			where: {
				id,
				OR: [
					{
						calendar: {
							users: {
								some: {
									userId: currentUser.id,
								},
							},
						},
					},
					{
						members: {
							some: {
								userId: currentUser.id,
							},
						},
					},
				],
			},
			include: {
				calendar: {
					select: {
						users: true,
					},
				},
			},
		});

		return event;
	}

	async findByCalendarId(
		calendarId: number,
		{ startDate, endDate, type }: FilteringOptionsDto,
		currentUser: CurrentUser
	): Promise<EventEntity[]> {
		const calendar = await this.calendarService.findById(
			calendarId,
			currentUser
		);

		if (calendar.type === CalendarType.HOLIDAYS) {
			return this.getGoogleEvents(calendar, startDate, endDate);
		}

		return await this.prisma.event.findMany({
			where: {
				calendarId,
				type,
				startDate: {
					gte: startDate,
				},
				AND: [
					{
						OR: [
							{
								endDate: {
									lte: endDate,
								},
							},
							{
								endDate: null,
							},
						],
					},
					{
						OR: [
							{
								calendar: {
									users: {
										some: {
											userId: currentUser.id,
										},
									},
								},
							},
							{
								members: {
									some: {
										userId: currentUser.id,
									},
								},
							},
						],
					},
				],
			},
		});
	}

	async findInvites(user: CurrentUser): Promise<EventEntity[]> {
		return this.prisma.event.findMany({
			where: {
				members: {
					some: {
						userId: user.id,
						status: InvitationStatus.INVITED,
					},
				},
			},
		});
	}

	async create(
		calendarId: number,
		dto: CreateEventDto,
		currentUser: CurrentUser
	): Promise<EventEntity> {
		const calendar = await this.calendarService.findById(
			calendarId,
			currentUser
		);

		if (calendar.type === CalendarType.HOLIDAYS) {
			throw new ForbiddenException('Holidays calendar is not editable');
		}

		const membership = calendar.users?.find(
			(user) => user.userId === currentUser.id
		);

		if (
			membership?.role === Role.VIEWER ||
			membership?.status !== InvitationStatus.ACCEPTED
		) {
			throw new ForbiddenException('Access denied');
		}

		return await this.prisma.event.create({
			data: {
				...dto,
				startDate: dto.startDate,
				calendarId,
				members: {
					create: {
						userId: currentUser.id,
						role: Role.OWNER,
						status: InvitationStatus.ACCEPTED,
					},
				},
			},
		});
	}

	async update(
		id: number,
		dto: UpdateEventDto,
		currentUser: CurrentUser
	): Promise<EventEntity> {
		const event = await this.findById(id, currentUser);

		if (event.type === EventType.HOLIDAY) {
			throw new ForbiddenException('Holidays calendar is not editable');
		}

		const eventMembership = event.members?.find(
			(member) => member.userId === currentUser.id
		);

		if (
			eventMembership?.role === Role.VIEWER ||
			eventMembership?.status !== InvitationStatus.ACCEPTED
		) {
			const calendarMembership = event.calendar?.users?.find(
				(user) => user.userId === currentUser.id
			);

			if (
				calendarMembership?.role === Role.VIEWER ||
				calendarMembership?.status !== InvitationStatus.ACCEPTED
			) {
				throw new ForbiddenException('Access denied');
			}
		}

		return await this.prisma.event.update({
			where: {
				id,
			},
			data: dto,
		});
	}

	async remove(id: number, currentUser: CurrentUser): Promise<void> {
		const event = await this.findById(id, currentUser);
		const eventMembership = event.members?.find(
			(member) => member.userId === currentUser.id
		);

		if (eventMembership?.role !== Role.OWNER) {
			const calendarMembership = event.calendar?.users?.find(
				(user) => user.userId === currentUser.id
			);

			if (calendarMembership?.role !== Role.OWNER) {
				throw new ForbiddenException('Access denied');
			}
		}

		await this.prisma.event.delete({
			where: {
				id,
			},
		});
	}

	async createReminder(
		id: number,
		{ time }: CreateReminderDto,
		user: CurrentUser
	): Promise<ReminderEntity> {
		const event = await this.findById(id, user);

		const reminder = await this.prisma.reminder.create({
			data: {
				eventId: id,
				userId: user.id,
				time: new Date(time),
			},
		});

		await this.notificationService.send(
			user,
			new ReminderNotification({
				reminderId: reminder.id,
				username: user.username,
				time: new Date(event.startDate).toLocaleString(),
			}),
			{
				delay: new Date(time).getTime() - Date.now(),
			}
		);

		return reminder;
	}

	async removeReminder(
		id: number,
		reminderId: number,
		user: CurrentUser
	): Promise<void> {
		await this.prisma.reminder.delete({
			where: {
				id: reminderId,
				eventId: id,
				userId: user.id,
			},
		});

		await this.notificationService.removeReminder(reminderId);
	}

	async createMember(
		eventId: number,
		userId: number,
		{ role }: CreateEventMemberDto,
		currentUser: CurrentUser
	): Promise<EventMemberEntity> {
		const event = await this.findById(eventId, currentUser);
		const targetUser = await this.userService.findById(userId);

		const eventMembership = event.members?.find(
			(member) => member.userId === currentUser.id
		);

		if (
			eventMembership?.role === Role.VIEWER ||
			eventMembership?.status !== InvitationStatus.ACCEPTED
		) {
			const calendarMembership = event.calendar?.users?.find(
				(member) => member.userId === currentUser.id
			);

			if (
				calendarMembership?.role === Role.VIEWER ||
				calendarMembership?.status !== InvitationStatus.ACCEPTED
			) {
				throw new ForbiddenException('Access denied');
			}
		}

		const newEventMember = await this.prisma.eventMember.create({
			data: {
				eventId: event.id,
				userId: userId,
				role,
				status: InvitationStatus.INVITED,
			},
		});

		await this.notificationService.send(
			targetUser,
			new EventInvitationNotification({
				username: targetUser.username,
				eventName: event.name,
			})
		);

		return newEventMember;
	}

	async updateMemberStatus(
		eventId: number,
		userId: number,
		{ status }: UpdateEventMemberStatusDto,
		currentUser: CurrentUser
	): Promise<EventMemberEntity> {
		if (currentUser.id !== userId) {
			throw new ForbiddenException('Access denied');
		}

		return this.prisma.eventMember.update({
			where: {
				eventId_userId: {
					eventId,
					userId: userId,
				},
			},
			data: {
				status,
			},
		});
	}

	async updateMemberRole(
		eventId: number,
		userId: number,
		{ role }: UpdateEventMemberRoleDto,
		currentUser: CurrentUser
	): Promise<EventMemberEntity> {
		const event = await this.findById(eventId, currentUser);

		const membership = event.members?.find(
			(user) => user.userId === currentUser.id
		);

		if (membership?.role !== Role.OWNER) {
			throw new ForbiddenException('Access denied');
		}

		return this.prisma.eventMember.update({
			where: {
				eventId_userId: {
					eventId: event.id,
					userId: userId,
				},
			},
			data: {
				role,
			},
		});
	}

	async removeMember(
		eventId: number,
		userId: number,
		currentUser: CurrentUser
	): Promise<void> {
		const event = await this.findById(eventId, currentUser);

		const membership = event.members?.find(
			(user) => user.userId === currentUser.id
		);

		if (membership?.role !== Role.OWNER && currentUser.id !== userId) {
			throw new ForbiddenException('Access denied');
		}

		await this.prisma.eventMember.delete({
			where: {
				eventId_userId: {
					eventId: event.id,
					userId: userId,
				},
			},
		});
	}

	private convertToUTC(date: Date | string, timezone: string): string {
		return fromZonedTime(toZonedTime(date, 'UTC'), timezone).toISOString();
	}

	private convertEventDatesToTimezone(
		event: EventEntity,
		timezone: string
	): EventEntity {
		return {
			...event,
			startDate: toZonedTime(event.startDate, timezone),
			endDate: event.endDate ? toZonedTime(event.endDate, timezone) : null,
		};
	}

	private async getGoogleEvents(
		calendar: CalendarEntity,
		timeMin: Date | string,
		timeMax: Date | string
	): Promise<EventEntity[]> {
		const region = encodeURIComponent(
			COUNTRIES[calendar.region as CountryCode].region
		);
		const url = `https://www.googleapis.com/calendar/v3/calendars/${region}/events`;
		const key = this.configService.get<string>('GOOGLE_CALENDAR_API_KEY');

		return firstValueFrom(
			this.httpService
				.get<GoogleHolidayResponse>(url, {
					params: {
						key,
						timeMin,
						timeMax,
					},
				})
				.pipe(
					map(({ data }) => {
						return data.items.map((item) => ({
							id: 1,
							calendarId: calendar.id,
							name: item.summary,
							description: null,
							color: calendar.color,
							type: EventType.HOLIDAY,
							allDay: true,
							startDate: new Date(item.start.date),
							endDate: new Date(item.end.date),
						}));
					})
				)
		);
	}
}
