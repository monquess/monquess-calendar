import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
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
			this.prismaMiddleware.createCalendarOnNewUser.bind(this.prismaMiddleware)
		);
	}
}
