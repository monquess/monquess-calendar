import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
	.setTitle('monquess-calendar API')
	.setDescription('monquess-calendar API documentation')
	.setVersion('1.0')
	.setLicense('MIT', 'https://opensource.org/licenses/MIT')
	.addServer(
		process.env.APP_URL || 'http://localhost:3000',
		'Local development server'
	)
	.addBearerAuth({
		type: 'http',
		scheme: 'bearer',
		bearerFormat: 'JWT',
	})
	.build();
