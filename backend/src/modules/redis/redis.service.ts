import { Injectable } from '@nestjs/common';
import { RedisPrefix } from './constants/redis.constants';
import { RedisRepository } from './redis.repository';

@Injectable()
export class RedisService {
	constructor(private readonly redis: RedisRepository) {}

	async getUserIdByToken(
		token: string,
		type: RedisPrefix
	): Promise<number | null> {
		const userId = await this.redis.get<number>(type, token);
		if (userId !== null) {
			await this.redis.del(type, token);
		}
		return userId;
	}

	async saveToken(
		userId: number,
		token: string,
		type: RedisPrefix,
		ttl: number
	): Promise<void> {
		await this.redis.set<number>(type, token, userId, ttl);
	}
}
