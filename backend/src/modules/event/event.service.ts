import { ForbiddenException, Injectable } from '@nestjs/common';
import { InvitationStatus, Role } from '@prisma/client';
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

@Injectable()
export class EventService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly calendarService: CalendarService
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
		const events = await this.prisma.event.findMany({
			where: {
				calendarId,
				type: type,
				startDate: {
					gte: fromZonedTime(startDate, currentUser.timezone),
				},
				endDate: {
					lte: fromZonedTime(endDate, currentUser.timezone),
				},
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
		const membership = calendar.users?.find(
			(user) => user.userId === currentUser.id
		);

		if (
			membership?.role === Role.VIEWER ||
			membership?.status !== InvitationStatus.ACCEPTED
		) {
			throw new ForbiddenException('Access denied');
		}

		dto.startDate = fromZonedTime(
			dto.startDate,
			currentUser.timezone
		).toISOString();

		if (dto.endDate) {
			dto.endDate = fromZonedTime(
				dto.startDate,
				currentUser.timezone
			).toISOString();
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
		const membership = event.members.find(
			(member) => member.userId === currentUser.id
		);

		if (
			membership?.role === Role.VIEWER ||
			membership?.status !== InvitationStatus.ACCEPTED
		) {
			throw new ForbiddenException('Access denied');
		}

		if (dto.startDate) {
			dto.startDate = fromZonedTime(
				dto.startDate,
				currentUser.timezone
			).toISOString();
		}
		if (dto.endDate) {
			dto.endDate = fromZonedTime(
				dto.endDate,
				currentUser.timezone
			).toISOString();
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
		const membership = event.members.find(
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
}
