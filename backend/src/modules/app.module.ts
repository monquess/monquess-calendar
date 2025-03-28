import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { S3Module } from './s3/s3.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import {
	EnvironmentVariables,
	validate,
} from '@config/env/environment-variables.config';
import { MailModule } from './mail/mail.module';
import { MailOptions } from './mail/interfaces/mail-options.interface';
import * as path from 'path';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CalendarModule } from './calendar/calendar.module';
import { EventModule } from './event/event.module';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv, RedisClientOptions } from '@keyv/redis';
import { CacheInterceptor } from '@common/interceptors/cache.interceptor.ts.interceptor';
import { NotificationModule } from './notification/notification.module';
import { BullModule } from '@nestjs/bullmq';
import { PushModule } from './push/push.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			cache: true,
			isGlobal: true,
			validate,
			validationOptions: {
				abortEarly: true,
			},
		}),
		JwtModule.register({
			global: true,
		}),
		CacheModule.registerAsync({
			isGlobal: true,
			useFactory: (
				configService: ConfigService<EnvironmentVariables, true>
			): CacheModuleOptions => {
				const redisOptions: RedisClientOptions = {
					password: configService.get<string>('REDIS_PASSWORD'),
					socket: {
						host: configService.get<string>('REDIS_HOST'),
						port: configService.get<number>('REDIS_PORT'),
					},
				};
				return {
					stores: [
						new Keyv(new KeyvRedis(redisOptions, { namespace: 'cache' }), {
							ttl: configService.get<number>('CACHE_TTL'),
						}),
					],
				};
			},
			inject: [ConfigService],
		}),
		PrismaModule,
		UserModule,
		AuthModule,
		S3Module,
		MailModule.forRootAsync({
			isGlobal: true,
			useFactory: (
				configService: ConfigService<EnvironmentVariables, true>
			): MailOptions => ({
				transport: {
					host: configService.get<string>('MAIL_HOST'),
					port: configService.get<number>('MAIL_PORT'),
					auth: {
						user: configService.get<string>('MAIL_USERNAME'),
						pass: configService.get<string>('MAIL_PASSWORD'),
					},
				},
				defaults: {
					from: {
						name: configService.get<string>('MAIL_FROM_NAME'),
						address: configService.get<string>('MAIL_FROM_ADDRESS'),
					},
				},
				template: {
					dir: path.join(__dirname, 'mail', 'templates'),
				},
			}),
			inject: [ConfigService],
		}),
		CalendarModule,
		EventModule,
		NotificationModule,
		BullModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				connection: {
					host: configService.get<string>('REDIS_HOST'),
					port: configService.get<number>('REDIS_PORT'),
					password: configService.get<string>('REDIS_PASSWORD'),
				},
			}),
			inject: [ConfigService],
		}),
		PushModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		},
	],
})
export class AppModule {}
