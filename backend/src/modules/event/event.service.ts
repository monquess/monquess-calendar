import { Injectable, ForbiddenException } from '@nestjs/common';
import {
	CalendarType,
	EventType,
	InvitationStatus,
	Role,
} from '@prisma/client';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CalendarService } from '@modules/calendar/calendar.service';
import { EventEntity } from './entities/event.entity';
import { EventMemberEntity } from './entities/event-member.entity';
import {
	CreateEventDto,
	UpdateEventDto,
	FilteringOptionsDto,
	CreateEventMemberDto,
	UpdateEventMemberStatusDto,
	UpdateEventMemberRoleDto,
} from './dto/';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CalendarEntity } from '@modules/calendar/entities/calendar.entity';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@config/env/environment-variables.config';
import {
	CountryCode,
	COUNTRIES,
} from '../../common/constants/country-codes.constant';
import { GoogleHolidayResponse } from './interfaces/google-holiday-response.interface';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { NotificationService } from '@modules/notification/notification.service';
import { ReminderNotification } from '@modules/notification/notifications/reminder.notification';
import { ReminderEntity } from './entities/reminder.entity';

@Injectable()
export class EventService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly calendarService: CalendarService,
		private readonly notificationService: NotificationService,
		private readonly configService: ConfigService<EnvironmentVariables, true>,
		private readonly httpService: HttpService
	) {}

	async findById(id: number, currentUser: CurrentUser): Promise<EventEntity> {
		const event = await this.prisma.event.findUniqueOrThrow({
			where: {
				id,
				members: {
					some: {
						userId: currentUser.id,
					},
				},
			},
			include: {
				members: {
					omit: {
						eventId: true,
					},
				},
			},
		});

		return this.convertEventDatesToTimezone(event, currentUser.timezone);
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

		const events = await this.prisma.event.findMany({
			where: {
				calendarId,
				type: type,
				startDate: {
					gte: this.convertToUTC(startDate, currentUser.timezone),
				},
				OR: [
					{
						endDate: {
							lte: this.convertToUTC(endDate, currentUser.timezone),
						},
					},
					{
						endDate: null,
					},
				],
				members: {
					some: {
						userId: currentUser.id,
					},
				},
			},
			include: {
				members: {
					omit: {
						eventId: true,
					},
				},
			},
		});

		return events.map((event) => {
			return this.convertEventDatesToTimezone(event, currentUser.timezone);
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

		dto.startDate = this.convertToUTC(dto.startDate, currentUser.timezone);

		if (dto.endDate) {
			dto.endDate = this.convertToUTC(dto.endDate, currentUser.timezone);
		}

		const result = await this.prisma.event.create({
			data: {
				...dto,
				calendarId,
				members: {
					create: {
						userId: currentUser.id,
						role: Role.OWNER,
						status: InvitationStatus.ACCEPTED,
					},
				},
			},
			include: {
				members: {
					omit: {
						eventId: true,
					},
				},
			},
		});

		return this.convertEventDatesToTimezone(result, currentUser.timezone);
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

		const membership = event.members?.find(
			(member) => member.userId === currentUser.id
		);

		if (
			membership?.role === Role.VIEWER ||
			membership?.status !== InvitationStatus.ACCEPTED
		) {
			throw new ForbiddenException('Access denied');
		}

		if (dto.startDate) {
			dto.startDate = this.convertToUTC(dto.startDate, currentUser.timezone);
		}
		if (dto.endDate) {
			dto.endDate = this.convertToUTC(dto.endDate, currentUser.timezone);
		}

		const result = await this.prisma.event.update({
			where: {
				id,
			},
			data: dto,
			include: {
				members: {
					omit: {
						eventId: true,
					},
				},
			},
		});

		return this.convertEventDatesToTimezone(result, currentUser.timezone);
	}

	async remove(id: number, currentUser: CurrentUser): Promise<void> {
		const event = await this.findById(id, currentUser);
		const membership = event.members?.find(
			(member) => member.userId === currentUser.id
		);

		if (membership?.role !== Role.OWNER) {
			throw new ForbiddenException('Access denied');
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

		const membership = event.members?.find(
			(user) => user.userId === currentUser.id
		);

		if (
			membership?.role === Role.VIEWER ||
			membership?.status !== InvitationStatus.ACCEPTED
		) {
			throw new ForbiddenException('Access denied');
		}

		return this.prisma.eventMember.create({
			data: {
				eventId: event.id,
				userId: userId,
				role,
				status: InvitationStatus.INVITED,
			},
		});
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

		return firstValueFrom(
			this.httpService
				.get<GoogleHolidayResponse>(url, {
					params: {
						key: this.configService.get<string>('GOOGLE_CALENDAR_API_KEY'),
						timeMin,
						timeMax,
					},
				})
				.pipe(
					map(({ data }) => {
						return data.items.map((item) => ({
							id: 1,
							name: item.summary,
							description: null,
							color: calendar.color,
							type: EventType.HOLIDAY,
							startDate: new Date(item.start.date),
							endDate: new Date(item.end.date),
						}));
					})
				)
		);
	}
}
