import { NestFactory } from '@nestjs/core';
import {
	INestApplication,
	ValidationPipe,
	VersioningType,
} from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<INestApplication>(AppModule);

	app.setGlobalPrefix('api');
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1',
	});
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
