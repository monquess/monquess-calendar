export const RedisPrefix = {
	VERIFICATION: 'verification',
	RESET: 'reset',
} as const;

export type RedisPrefix = (typeof RedisPrefix)[keyof typeof RedisPrefix];

export const RedisTTL = {
	VERIFICATION: 60 * 15,
	RESET: 60 * 15,
} as const;

export type RedisTTL = (typeof RedisTTL)[keyof typeof RedisTTL];
