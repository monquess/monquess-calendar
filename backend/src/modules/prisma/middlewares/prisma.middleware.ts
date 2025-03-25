import { forwardRef, Inject, Injectable } from '@nestjs/common';

import {
	Calendar,
	CalendarType,
	InvitationStatus,
	Prisma,
	Role,
	User,
} from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { DEFAULT_CALENDAR_COLOR } from '@modules/calendar/constants/calendar.constants';

@Injectable()
export class PrismaMiddleware {
	constructor(
		@Inject(forwardRef(() => PrismaService))
		private readonly prisma: PrismaService
	) {}

	async createCalendarOnNewUser(
		params: Prisma.MiddlewareParams,
		next: (params: Prisma.MiddlewareParams) => Promise<User>
	): Promise<User> {
		const result = await next(params);

		if (params.model === Prisma.ModelName.User && params.action === 'create') {
			const user = result;

			await this.prisma.calendar.create({
				data: {
					name: user.username,
					color: DEFAULT_CALENDAR_COLOR,
					type: CalendarType.PERSONAL,
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

		return result;
	}

	async includeMembersInCalendar(
		params: Prisma.MiddlewareParams,
		next: (params: Prisma.MiddlewareParams) => Promise<Calendar>
	): Promise<Calendar> {
		const actions = ['create', 'update', 'findMany', 'findFirstOrThrow'];

		if (
			params.model === Prisma.ModelName.Calendar &&
			actions.includes(params.action)
		) {
			const include = {
				users: {
					include: {
						user: {
							select: {
								username: true,
								email: true,
								avatar: true,
							},
						},
					},
					omit: {
						calendarId: true,
					},
				},
			} as Prisma.CalendarInclude;

			params.args = {
				...params.args,
				include,
			} as Prisma.CalendarDefaultArgs;
		}

		return next(params);
	}

	async includeUserInCalendarMember(
		params: Prisma.MiddlewareParams,
		next: (params: Prisma.MiddlewareParams) => Promise<Calendar>
	): Promise<Calendar> {
		const actions = ['create', 'update', 'findMany', 'findFirstOrThrow'];

		if (
			params.model === Prisma.ModelName.CalendarMember &&
			actions.includes(params.action)
		) {
			const include = {
				include: {
					user: {
						select: {
							username: true,
							email: true,
							avatar: true,
						},
					},
				},
				omit: {
					calendarId: true,
				},
			} as Prisma.CalendarMemberInclude;

			params.args = {
				...params.args,
				include,
			} as Prisma.CalendarMemberDefaultArgs;
		}

		return next(params);
	}
}
