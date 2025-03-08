import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { InvitationStatus, Prisma, Role, User } from '@prisma/client';
import { DEFAULT_CALENDAR_COLOR } from '@modules/calendar/constants/calendar.constants';

@Injectable()
export class PrismaMiddleware {
	constructor(
		@Inject(forwardRef(() => PrismaService))
		private readonly prisma: PrismaService
	) {}

	async createCalendarOnNewUser(
		params: Prisma.MiddlewareParams,
		next: (params: Prisma.MiddlewareParams) => Promise<any>
	): Promise<PrismaMiddleware> {
		const result = await next(params);

		if (params.model === 'User' && params.action === 'create') {
			const user = result as User;

			await this.prisma.$transaction(async (tx) => {
				const calendar = await tx.calendar.create({
					data: {
						isPersonal: true,
						name: user.username,
						color: DEFAULT_CALENDAR_COLOR,
					},
				});

				await tx.calendarMember.create({
					data: {
						userId: user.id,
						calendarId: calendar.id,
						role: Role.OWNER,
						status: InvitationStatus.ACCEPTED,
					},
				});
			});
		}

		return result;
	}
}
