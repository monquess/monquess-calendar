import { NestFactory } from '@nestjs/core';
import {
	INestApplication,
	UnprocessableEntityException,
	ValidationPipe,
	VersioningType,
} from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger.config';
import { corsOptions } from './config/cors/cors.options';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationError } from 'class-validator';

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
			exceptionFactory: (errors: ValidationError[]) => {
				const [error] = errors;
				const extractError = (
					error: ValidationError
				): { property: string; message: string } => {
					if (error.constraints) {
						const [message] = Object.values(error.constraints);
						return {
							property: error.property,
							message,
						};
					}
					return {
						property: error.property,
						message: 'Validation error',
					};
				};
				return new UnprocessableEntityException(extractError(error));
			},
			stopAtFirstError: true,
		})
	);
	app.useGlobalFilters(new HttpExceptionFilter());

	const document = () => SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup(`${prefix}/docs`, app, document);

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
