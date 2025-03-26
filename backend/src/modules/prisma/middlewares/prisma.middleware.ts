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
import { generateColor } from '@common/helpers/generate-color';

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
					color: generateColor(user.username),
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

	async includeUserInCalendar(
		params: Prisma.MiddlewareParams,
		next: (params: Prisma.MiddlewareParams) => Promise<Calendar>
	): Promise<Calendar> {
		const actions = ['create', 'update', 'findMany', 'findFirstOrThrow'];

		if (
			params.model === Prisma.ModelName.Calendar &&
			actions.includes(params.action)
		) {
			const include: Prisma.CalendarInclude = {
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
			};

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
		const actions = ['create', 'update'];

		if (
			params.model === Prisma.ModelName.CalendarMember &&
			actions.includes(params.action)
		) {
			params.args = {
				...params.args,
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
			} as Prisma.CalendarMemberDefaultArgs;
		}

		return next(params);
	}

	async includeUserInEvent(
		params: Prisma.MiddlewareParams,
		next: (params: Prisma.MiddlewareParams) => Promise<Calendar>
	): Promise<Calendar> {
		const actions = ['create', 'update', 'findMany', 'findFirstOrThrow'];

		if (
			params.model === Prisma.ModelName.Event &&
			actions.includes(params.action)
		) {
			params.args = {
				...params.args,
				include: {
					members: {
						select: {
							username: true,
							email: true,
							avatar: true,
						},
						omit: {
							eventId: true,
						},
					},
				},
			} as Prisma.EventDefaultArgs;
		}

		return next(params);
	}

	async includeUserInEventMember(
		params: Prisma.MiddlewareParams,
		next: (params: Prisma.MiddlewareParams) => Promise<Calendar>
	): Promise<Calendar> {
		const actions = ['create', 'update'];

		if (
			params.model === Prisma.ModelName.EventMember &&
			actions.includes(params.action)
		) {
			params.args = {
				...params.args,
				include: {
					members: {
						select: {
							username: true,
							email: true,
							avatar: true,
						},
					},
				},
				omit: {
					eventId: true,
				},
			} as Prisma.EventMemberDefaultArgs;
		}

		return next(params);
	}
}
