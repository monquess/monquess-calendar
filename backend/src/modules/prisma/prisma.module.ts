import { Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { PrismaMiddleware } from './middlewares/prisma.middleware';

@Module({
	providers: [PrismaService, PrismaMiddleware],
	exports: [PrismaService, PrismaMiddleware],
})
export class PrismaModule {}
