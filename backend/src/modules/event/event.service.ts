import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { InvitationStatus, Role, User } from '@prisma/client';
import { CalendarService } from '@modules/calendar/calendar.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { FilteringOptionsDto } from './dto/filtering-option.dto';

@Injectable()
export class EventService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly calendarService: CalendarService
	) {}

	async findById(id: number, currentUser: User): Promise<EventEntity> {
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

		return event;
	}

	async findByCalendarId(
		calendarId: number,
		{ type }: FilteringOptionsDto,
		currentUser: User
	): Promise<EventEntity[]> {
		return this.prisma.event.findMany({
			where: {
				calendarId,
				type: type,
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
	}

	async create(
		calendarId: number,
		dto: CreateEventDto,
		currentUser: User
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

		return this.prisma.event.create({
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
	}

	async update(
		id: number,
		dto: UpdateEventDto,
		currentUser: User
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

		return this.prisma.event.update({
			where: {
				id,
			},
			data: {
				...dto,
			},
			include: {
				members: {
					omit: {
						eventId: true,
					},
				},
			},
		});
	}

	async remove(id: number, currentUser: User): Promise<void> {
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
