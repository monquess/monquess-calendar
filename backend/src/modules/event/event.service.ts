import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { InvitationStatus, Role } from '@prisma/client';
import { CalendarService } from '@modules/calendar/calendar.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { FilteringOptionsDto } from './dto/filtering-option.dto';
import { EventEntity } from './entities/event.entity';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Injectable()
export class EventService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly calendarService: CalendarService
	) {}

	async findById(id: number, currentUser: CurrentUser): Promise<EventEntity> {
		const event = await this.prisma.event.findUnique({
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

		if (!event) {
			throw new NotFoundException('Event not found');
		}

		event.startDate = toZonedTime(event.startDate, currentUser.timezone);
		if (event.endDate) {
			event.endDate = toZonedTime(event.startDate, currentUser.timezone);
		}

		return event;
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
					gte: toZonedTime(
						fromZonedTime(startDate, currentUser.timezone),
						'UTC'
					),
				},
				endDate: {
					lte: toZonedTime(fromZonedTime(endDate, currentUser.timezone), 'UTC'),
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
			event.startDate = toZonedTime(event.startDate, currentUser.timezone);
			if (event.endDate) {
				event.endDate = toZonedTime(event.startDate, currentUser.timezone);
			}
			return event;
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

		dto.startDate = toZonedTime(
			fromZonedTime(dto.startDate, currentUser.timezone),
			'UTC'
		).toISOString();

		if (dto.endDate) {
			dto.endDate = toZonedTime(
				fromZonedTime(dto.startDate, currentUser.timezone),
				'UTC'
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

		result.startDate = toZonedTime(result.startDate, currentUser.timezone);
		if (result.endDate) {
			result.endDate = toZonedTime(result.startDate, currentUser.timezone);
		}

		return result;
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
			dto.startDate = toZonedTime(
				fromZonedTime(dto.startDate, currentUser.timezone),
				'UTC'
			).toISOString();
		}
		if (dto.endDate) {
			dto.endDate = toZonedTime(
				fromZonedTime(dto.endDate, currentUser.timezone),
				'UTC'
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

		result.startDate = toZonedTime(result.startDate, currentUser.timezone);
		if (result.endDate) {
			result.endDate = toZonedTime(result.startDate, currentUser.timezone);
		}

		return result;
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
}
