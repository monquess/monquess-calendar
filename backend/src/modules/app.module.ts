import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { S3Module } from './s3/s3.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { validate } from '@config/env/environment-variables.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
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
	],
})
export class AppModule {}
