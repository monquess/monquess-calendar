import { PrismaService } from '@modules/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CalendarType, InvitationStatus, Role, User } from '@prisma/client';
import {
	CreateCalendarDto,
	UpdateCalendarDto,
	CreateCalendarMemberDto,
	UpdateCalendarMemberRoleDto,
	UpdateCalendarMemberStatusDto,
} from './dto';
import { CalendarEntity } from './entities/calendar.entity';
import { CalendarMemberEntity } from './entities/calendar-member.entity';
import {
	CountryCode,
	COUNTRIES,
} from '@common/constants/country-codes.constant';

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
			orderBy: { createdAt: 'asc' },
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
		currentUser: User,
		createCalendarDto: CreateCalendarDto
	): Promise<CalendarEntity> {
		if (createCalendarDto.type === CalendarType.HOLIDAYS) {
			createCalendarDto.name =
				COUNTRIES[createCalendarDto.region as CountryCode].name;
			createCalendarDto.description = undefined;
		}

		return this.prisma.calendar.create({
			data: {
				...createCalendarDto,
				users: {
					create: {
						userId: currentUser.id,
						role: Role.OWNER,
						status: InvitationStatus.ACCEPTED,
					},
				},
			},
		});
	}

	async createCalendarMember(
		calendarId: number,
		targetUserId: number,
		currentUser: User,
		{ role }: CreateCalendarMemberDto
	): Promise<CalendarMemberEntity> {
		const calendar = await this.findById(calendarId, currentUser);

		const currentUserMembership = calendar.users?.find(
			(user) => user.userId === currentUser.id
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
		currentUser: User,
		updateCalendarDto: UpdateCalendarDto
	): Promise<CalendarEntity> {
		const calendar = await this.findById(id, currentUser);

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
			(user) => user.userId === currentUser.id
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

	async remove(id: number, currentUser: User): Promise<void> {
		const calendar = await this.findById(id, currentUser);
		const membership = calendar.users?.find(
			(user) => user.userId === currentUser.id
		);

		if (
			calendar.type === CalendarType.PERSONAL ||
			membership?.role !== Role.OWNER
		) {
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
			(user) => user.userId === currentUser.id
		);
		const targetUserMembership = calendar.users?.find(
			(user) => user.userId === targetUserId
		);

		if (
			calendar.type === CalendarType.PERSONAL &&
			targetUserMembership?.role === Role.OWNER
		) {
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
