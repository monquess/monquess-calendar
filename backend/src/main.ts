/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import {
	INestApplication,
	ValidationPipe,
	VersioningType,
} from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '@modules/app.module';
import { swaggerConfig } from '@config/swagger.config';
import { corsOptions } from '@config/cors/cors.options';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { PrismaExceptionFilter } from '@common/filters/prisma-exception.filter';
import { validationExceptionFactory } from '@common/pipes/validation/validation-exception.factory';

async function bootstrap() {
	const app = await NestFactory.create<INestApplication>(AppModule);
	const prefix = 'api';

	app.setGlobalPrefix(prefix);
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1',
	});

	app.enableCors(corsOptions);

	app.use(cookieParser());
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			exceptionFactory: validationExceptionFactory,
		})
	);
	app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup(`${prefix}/docs`, app, document);

	const date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
	console.log(date);

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
