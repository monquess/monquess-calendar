import { PrismaService } from '@modules/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InvitationStatus, Role, User } from '@prisma/client';
import { CalendarEntity } from './entities/calendar.entity';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';

@Injectable()
export class CalendarService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll(user: User): Promise<CalendarEntity[]> {
		return this.prisma.calendar.findMany({
			where: {
				users: {
					some: {
						userId: user.id,
					},
				},
			},
			include: {
				users: true,
			},
		});
	}

	async findById(id: number, user: User): Promise<CalendarEntity> {
		return this.prisma.calendar.findFirstOrThrow({
			where: {
				AND: [
					{
						id,
					},
					{
						users: {
							some: {
								userId: user.id,
							},
						},
					},
				],
			},
			include: {
				users: true,
			},
		});
	}

	async create(
		user: User,
		createCalendarDto: CreateCalendarDto
	): Promise<CalendarEntity> {
		return await this.prisma.$transaction(async (tx) => {
			const calendar = await tx.calendar.create({
				data: createCalendarDto,
			});

			await tx.calendarMember.create({
				data: {
					userId: user.id,
					calendarId: calendar.id,
					role: Role.OWNER,
					status: InvitationStatus.ACCEPTED,
				},
			});

			return calendar;
		});
	}

	async update(
		id: number,
		user: User,
		updateCalendarDto: UpdateCalendarDto
	): Promise<CalendarEntity> {
		const calendar = await this.findById(id, user);

		const membership = calendar.users?.find((u) => u.userId === user.id);

		if (membership?.role === Role.VIEWER) {
			throw new ForbiddenException('Access denied');
		}

		return this.prisma.calendar.update({
			where: { id },
			data: updateCalendarDto,
		});
	}

	async remove(id: number, user: User): Promise<void> {
		const calendar = await this.findById(id, user);

		if (calendar.isPersonal) {
			throw new ForbiddenException('Access denied');
		}

		const membership = calendar.users?.find((u) => u.userId === user.id);

		if (membership?.role !== Role.OWNER) {
			throw new ForbiddenException('Access denied');
		}

		await this.prisma.calendar.delete({ where: { id } });
	}
}
