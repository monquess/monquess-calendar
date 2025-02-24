import { NestFactory } from '@nestjs/core';
import {
	INestApplication,
	ValidationPipe,
	VersioningType,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger.config';
import { corsOptions } from './config/cors/cors.options';

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
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

	const document = () => SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup(`${prefix}/docs`, app, document);

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
