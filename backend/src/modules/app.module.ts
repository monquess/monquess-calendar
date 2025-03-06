import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema } from '@config/env/env.schema';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { S3Module } from './s3/s3.module';
import { MailModule } from './mail/mail.module';
import { MailOptions } from './mail/interfaces/mail-options.interface';
import * as path from 'path';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
			validationSchema: envSchema,
		}),
		PrismaModule,
		UserModule,
		S3Module,
		MailModule.forRootAsync({
			isGlobal: false,
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
					dir: path.join(__dirname, '..', 'templates'),
				},
			}),
			inject: [ConfigService],
		}),
	],
})
export class AppModule {}
