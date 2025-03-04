import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisRepository implements OnModuleInit, OnModuleDestroy {
	private client: Redis;

	constructor(private readonly configService: ConfigService) {}

	onModuleInit() {
		this.client = new Redis({
			host: this.configService.get<string>('REDIS_HOST'),
			port: this.configService.get<number>('REDIS_PORT'),
			password: this.configService.get<string>('REDIS_PASSWORD'),
		});
	}

	onModuleDestroy() {
		if (this.client) {
			this.client.disconnect();
		}
	}

	async get<T = string>(
		prefix: string,
		key: string | number
	): Promise<T | null> {
		const value = await this.client.get(`${prefix}:${key}`);

		if (!value) {
			return null;
		}

		try {
			return JSON.parse(value) as T;
		} catch {
			return null;
		}
	}

	async set<T = string>(
		prefix: string,
		key: string | number,
		value: T,
		ttl?: number
	): Promise<void> {
		const setValue = JSON.stringify(value);

		if (ttl) {
			await this.client.set(`${prefix}:${key}`, setValue, 'EX', ttl);
		} else {
			await this.client.set(`${prefix}:${key}`, setValue);
		}
	}

	async del(prefix: string, key: string | number): Promise<void> {
		await this.client.del(`${prefix}:${key}`);
	}
}
