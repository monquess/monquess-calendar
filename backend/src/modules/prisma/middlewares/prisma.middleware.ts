import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
	CalendarType,
	InvitationStatus,
	Prisma,
	Role,
	User,
} from '@prisma/client';
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
}
