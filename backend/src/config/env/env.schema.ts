import * as joi from 'joi';

export const envSchema = joi.object({
	NODE_ENV: joi
		.string()
		.valid('development', 'production', 'test')
		.default('development'),
	PORT: joi.number().port().default(3000),
	APP_URL: joi.string().required(),
	DATABASE_USER: joi.string(),
	DATABASE_PASSWORD: joi.string(),
	DATABASE_HOST: joi.string(),
	DATABASE_PORT: joi.number().port(),
	DATABASE_NAME: joi.string(),
	DATABASE_URL: joi.string(),
	REDIS_HOST: joi.string(),
	REDIS_PORT: joi.number().port(),
	REDIS_PASSWORD: joi.string(),
	S3_ACCESS_KEY_ID: joi.string(),
	S3_SECRET_ACCESS_KEY: joi.string(),
	S3_REGION: joi.string(),
	S3_BUCKET_NAME: joi.string(),
	S3_ENDPOINT: joi.string(),
	DEFAULT_AVATAR_PATH: joi.string(),
});
