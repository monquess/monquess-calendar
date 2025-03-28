import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { PrismaMiddleware } from './middlewares/prisma.middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	constructor(
		@Inject(forwardRef(() => PrismaMiddleware))
		private readonly prismaMiddleware: PrismaMiddleware
	) {
		super();
	}

	onModuleInit() {
		this.$use(
			this.prismaMiddleware.createCalendarOnNewUser.bind(
				this.prismaMiddleware
			) as Prisma.Middleware
		);
		this.$use(
			this.prismaMiddleware.includeUserInCalendar.bind(
				this.prismaMiddleware
			) as Prisma.Middleware
		);
		this.$use(
			this.prismaMiddleware.includeUserInCalendarMember.bind(
				this.prismaMiddleware
			) as Prisma.Middleware
		);
		this.$use(
			this.prismaMiddleware.includeUserInEvent.bind(
				this.prismaMiddleware
			) as Prisma.Middleware
		);
		this.$use(
			this.prismaMiddleware.includeUserInEventMember.bind(
				this.prismaMiddleware
			) as Prisma.Middleware
		);
	}
}
