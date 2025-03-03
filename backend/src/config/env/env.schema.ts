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
	AWS_ACCESS_KEY_ID: joi.string(),
	AWS_SECRET_ACCESS_KEY: joi.string(),
	AWS_REGION: joi.string(),
	AWS_S3_BUCKET: joi.string(),
	AWS_S3_ENDPOINT: joi.string(),
	DEFAULT_AVATAR_PATH: joi.string(),
});
