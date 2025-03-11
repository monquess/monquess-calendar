import { PrismaService } from '@modules/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InvitationStatus, Role, User } from '@prisma/client';
import {
	CreateCalendarDto,
	UpdateCalendarDto,
	CreateCalendarMemberDto,
	UpdateCalendarMemberRoleDto,
	UpdateCalendarMemberStatusDto,
} from './dto';
import { CalendarEntity } from './entities/calendar.entity';
import { CalendarMemberEntity } from './entities/calendar-member.entity';

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
				users: {
					omit: {
						calendarId: true,
					},
				},
			},
		});
	}

	async findById(id: number, user: User): Promise<CalendarEntity> {
		return this.prisma.calendar.findFirstOrThrow({
			where: {
				id,
				users: {
					some: {
						userId: user.id,
					},
				},
			},
			include: {
				users: {
					omit: {
						calendarId: true,
					},
				},
			},
		});
	}

	async create(
		user: User,
		createCalendarDto: CreateCalendarDto
	): Promise<CalendarEntity> {
		return this.prisma.calendar.create({
			data: {
				...createCalendarDto,
				users: {
					create: {
						userId: user.id,
						role: Role.OWNER,
						status: InvitationStatus.ACCEPTED,
					},
				},
			},
		});
	}

	// async createEvent(
	// 	id: number,
	// 	createCalendarDto: CreateEventDto,
	// 	user: User
	// ): Promise<EventEntity> {
	// 	return this.prisma.calendar.create({
	// 		data: {
	// 			...createCalendarDto,
	// 			users: {
	// 				create: {
	// 					userId: user.id,
	// 					role: Role.OWNER,
	// 					status: InvitationStatus.ACCEPTED,
	// 				},
	// 			},
	// 		},
	// 	});
	// }

	async createCalendarMember(
		calendarId: number,
		targetUserId: number,
		currentUser: User,
		{ role }: CreateCalendarMemberDto
	): Promise<CalendarMemberEntity> {
		const calendar = await this.findById(calendarId, currentUser);

		const currentUserMembership = calendar.users?.find(
			(u) => u.userId === currentUser.id
		);

		if (
			currentUserMembership?.role === Role.VIEWER ||
			currentUserMembership?.status !== InvitationStatus.ACCEPTED
		) {
			throw new ForbiddenException('Access denied');
		}

		return this.prisma.calendarMember.create({
			data: {
				calendarId: calendar.id,
				userId: targetUserId,
				role,
				status: InvitationStatus.INVITED,
			},
		});
	}

	async update(
		id: number,
		user: User,
		updateCalendarDto: UpdateCalendarDto
	): Promise<CalendarEntity> {
		const calendar = await this.findById(id, user);

		const membership = calendar.users?.find((u) => u.userId === user.id);

		if (
			membership?.role === Role.VIEWER ||
			membership?.status !== InvitationStatus.ACCEPTED
		) {
			throw new ForbiddenException('Access denied');
		}

		return this.prisma.calendar.update({
			where: { id },
			data: updateCalendarDto,
		});
	}

	async updateCalendarMemberRole(
		calendarId: number,
		targetUserId: number,
		currentUser: User,
		{ role }: UpdateCalendarMemberRoleDto
	): Promise<CalendarMemberEntity> {
		const calendar = await this.findById(calendarId, currentUser);

		const currentUserMembership = calendar.users?.find(
			(u) => u.userId === currentUser.id
		);

		if (currentUserMembership?.role !== Role.OWNER) {
			throw new ForbiddenException('Access denied');
		}

		return this.prisma.calendarMember.update({
			where: {
				userId_calendarId: {
					userId: targetUserId,
					calendarId,
				},
			},
			data: {
				role,
			},
		});
	}

	async updateCalendarMemberStatus(
		calendarId: number,
		targetUserId: number,
		currentUser: User,
		{ status }: UpdateCalendarMemberStatusDto
	): Promise<CalendarMemberEntity> {
		if (targetUserId !== currentUser.id) {
			throw new ForbiddenException('Access denied');
		}

		return this.prisma.calendarMember.update({
			where: {
				userId_calendarId: {
					userId: targetUserId,
					calendarId,
				},
			},
			data: {
				status,
			},
		});
	}

	async remove(id: number, user: User): Promise<void> {
		const calendar = await this.findById(id, user);
		const membership = calendar.users?.find((u) => u.userId === user.id);

		if (calendar.isPersonal || membership?.role !== Role.OWNER) {
			throw new ForbiddenException('Access denied');
		}

		await this.prisma.calendar.delete({ where: { id } });
	}

	async removeCalendarMember(
		calendarId: number,
		targetUserId: number,
		currentUser: User
	): Promise<void> {
		const calendar = await this.findById(calendarId, currentUser);

		const currentUserMembership = calendar.users?.find(
			(u) => u.userId === currentUser.id
		);
		const targetUserMembership = calendar.users?.find(
			(u) => u.userId === targetUserId
		);

		if (calendar.isPersonal && targetUserMembership?.role === Role.OWNER) {
			// can't delete your personal calenar
			throw new ForbiddenException('Access denied');
		}

		if (
			currentUserMembership?.role !== Role.OWNER &&
			currentUser.id !== targetUserId
		) {
			// can't delete members except yourself if you are not owner
			throw new ForbiddenException('Access denied');
		}

		await this.prisma.calendarMember.delete({
			where: {
				userId_calendarId: {
					userId: targetUserId,
					calendarId,
				},
			},
		});
	}
}
