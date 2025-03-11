import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { S3Module } from './s3/s3.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { validate } from '@config/env/environment-variables.config';
import { MailModule } from './mail/mail.module';
import { MailOptions } from './mail/interfaces/mail-options.interface';
import * as path from 'path';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CalendarModule } from './calendar/calendar.module';
import { EventModule } from './event/event.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate,
			validationOptions: {
				abortEarly: true,
			},
		}),
		JwtModule.register({
			global: true,
		}),
		PrismaModule,
		UserModule,
		AuthModule,
		S3Module,
		MailModule.forRootAsync({
			isGlobal: true,
			useFactory: (configService: ConfigService): MailOptions => ({
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
						name: configService.get<string>('MAIL_FROM_NAME')!,
						address: configService.get<string>('MAIL_FROM_ADDRESS')!,
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
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
