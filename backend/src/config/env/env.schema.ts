import * as joi from 'joi';

export const envSchema = joi.object({
	NODE_ENV: joi
		.string()
		.valid('development', 'production', 'test')
		.default('development'),
	PORT: joi.number().port().default(3000),
	APP_URL: joi.string().required(),
});
