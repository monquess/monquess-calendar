import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { RedisModule } from '@modules/redis/redis.module';
import { UserModule } from '@modules/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
	imports: [
		PrismaModule,
		RedisModule.registerAsync({
			useFactory: (configService: ConfigService) => ({
				host: configService.get('REDIS_HOST'),
				port: configService.get<number>('REDIS_PORT'),
				password: configService.get('REDIS_PASSWORD'),
			}),
			inject: [ConfigService],
		}),
		UserModule,
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtAccessStrategy],
})
export class AuthModule {}
