import { HttpService } from '@nestjs/axios';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
	CallHandler,
	ExecutionContext,
	Inject,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Request } from 'express';
import { firstValueFrom, map, Observable } from 'rxjs';

interface IpResponse {
	ip: string;
}

interface LocationResponse {
	status: 'success' | 'fail';
	countryCode: string;
	timezone: string;
}

interface LocationCache {
	country: string;
	timezone: string;
}

@Injectable()
export class UserLocationInterceptor implements NestInterceptor {
	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
		@Inject(CACHE_MANAGER) private readonly cache: Cache
	) {}

	async intercept(
		context: ExecutionContext,
		next: CallHandler
	): Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest<Request>();
		const user = request.user as User;

		const cacheKey = user ? `location:${user.id}` : '';
		const location = await this.cache.get<LocationCache>(cacheKey);

		if (location) {
			request.user = {
				...request.user,
				country: location.country,
				timezone: location.timezone,
			};
		} else {
			const ip = await this.getClientIP(request);
			const response = await firstValueFrom(
				this.httpService
					.get<LocationResponse>(`http://ip-api.com/json/${ip}`, {
						params: {
							fields: 'status,countryCode,timezone',
						},
					})
					.pipe(map((response) => response.data))
			);

			if (response.status === 'success') {
				const payload = {
					country: response.countryCode,
					timezone: response.timezone,
				};

				if (user) {
					await this.cache.set(cacheKey, payload, 900000);
				}

				request.user = {
					...request.user,
					...payload,
				};
			}
		}

		return next.handle();
	}

	async getClientIP(request: Request) {
		if (this.configService.get<string>('NODE_ENV') === 'development') {
			const url = `https://api.ipify.org?format=json`;
			return firstValueFrom(
				this.httpService.get<IpResponse>(url).pipe(map((res) => res.data.ip))
			);
		}
		const forwarded = request.headers['x-forwarded-for'] as string;

		return forwarded ? forwarded.split(',')[0].trim() : request.ip;
	}
}
