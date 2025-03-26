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

		const cacheKey = `location:${user.id}`;
		const location = await this.cache.get<{
			countryCode: string;
			timezone: string;
		}>(cacheKey);

		if (location) {
			request.user = {
				...request.user,
				country: location.countryCode,
				timezone: location.timezone,
			};
		} else {
			const ip = await this.getClientIP(request);
			const response = await firstValueFrom(
				this.httpService
					.get<{
						status: 'success' | 'fail';
						countryCode: string;
						timezone: string;
					}>(`http://ip-api.com/json/${ip}`, {
						params: {
							fields: 'status,countryCode,timezone',
						},
					})
					.pipe(map((response) => response.data))
			);

			if (response.status === 'success') {
				const payload = {
					countryCode: response.countryCode,
					timezone: response.timezone,
				};
				await this.cache.set(cacheKey, payload, 900000);
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
