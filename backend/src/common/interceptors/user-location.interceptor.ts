import { HttpService } from '@nestjs/axios';
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { firstValueFrom, map, Observable } from 'rxjs';

@Injectable()
export class UserLocationInterceptor implements NestInterceptor {
	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService
	) {}

	async intercept(
		context: ExecutionContext,
		next: CallHandler
	): Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest<Request>();

		const ip = await this.getClientIP(request);
		const location = await firstValueFrom(
			this.httpService
				.get<{
					status: 'success' | 'fail';
					countryCode: string;
					timezone: string;
				}>(`http://ip-api.com/json/${ip}`, {
					params: {
						fields: ['status', 'countryCode', 'timezone'],
					},
				})
				.pipe(map((response) => response.data))
		);

		if (location.status === 'success') {
			request.user = {
				...request.user,
				country: location.countryCode,
				timezone: location.timezone,
			};
		}

		return next.handle();
	}

	async getClientIP(request: Request) {
		if (this.configService.get<string>('NODE_ENV') === 'development') {
			return firstValueFrom(
				this.httpService
					.get<{ ip: string }>(`https://api.ipify.org?format=json`)
					.pipe(map((response) => response.data.ip))
			);
		}
		const forwarded = request.headers['x-forwarded-for'] as string;

		return forwarded ? forwarded.split(',')[0].trim() : request.ip;
	}
}
