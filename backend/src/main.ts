import { NestFactory } from '@nestjs/core';
import {
	INestApplication,
	ValidationPipe,
	VersioningType,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<INestApplication>(AppModule);

	app.setGlobalPrefix('api');
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1',
	});
	app.enableCors({
		origin: process.env.CORS_ORIGIN,
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});

	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
