export const REDIS_OPTIONS = 'REDIS_OPTIONS';

export const RedisPrefix = {
	VERIFICATION_TOKEN: 'verification',
	RESET_TOKEN: 'reset',
	REFRESH_TOKEN: 'refresh',
} as const;

export type RedisPrefix = (typeof RedisPrefix)[keyof typeof RedisPrefix];

export const RedisTTL = {
	VERIFICATION: 15 * 60,
	RESET: 15 * 60,
	REFRESH: 7 * 24 * 60 * 60,
} as const;

export type RedisTTL = (typeof RedisTTL)[keyof typeof RedisTTL];
