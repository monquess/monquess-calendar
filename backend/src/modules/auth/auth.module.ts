import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { RedisModule } from '@modules/redis/redis.module';
import { UserModule } from '@modules/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
	imports: [PrismaModule, RedisModule, UserModule],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
