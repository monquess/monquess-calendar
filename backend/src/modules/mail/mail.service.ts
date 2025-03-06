import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter, TransportOptions } from 'nodemailer';
import * as handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'node:fs';

@Injectable()
export class MailService {
	private transporter: Transporter;

	constructor(private readonly configService: ConfigService) {
		this.transporter = createTransport(
			{
				host: this.configService.get<string>('MAIL_HOST'),
				port: this.configService.get<number>('MAIL_PORT'),
				auth: {
					user: this.configService.get<string>('MAIL_USERNAME'),
					pass: this.configService.get<string>('MAIL_PASSWORD'),
				},
			} as TransportOptions,
			{
				from: {
					name: this.configService.get<string>('MAIL_FROM_NAME'),
					address: this.configService.get<string>('MAIL_FROM_ADDRESS'),
				},
			} as TransportOptions
		);
	}

	private renderTemplate(
		templateName: string,
		context?: Record<string, unknown>
	): string {
		const templatePath = path.join(
			__dirname,
			'templates',
			`${templateName}.hbs`
		);

		if (!fs.existsSync(templatePath)) {
			throw new InternalServerErrorException();
		}

		const template = fs.readFileSync(templatePath, 'utf-8');

		return handlebars.compile(template)(context);
	}

	async sendMail(
		to: string,
		subject: string,
		templateName: string,
		context?: Record<string, unknown>
	) {
		const html = this.renderTemplate(templateName, context);

		await this.transporter.sendMail({
			to,
			subject,
			html,
		});
	}
}
