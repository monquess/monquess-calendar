import {
	IsEnum,
	IsString,
	IsNumber,
	Max,
	Min,
	validateSync,
	IsBoolean,
} from 'class-validator';
import { plainToInstance, Transform } from 'class-transformer';

export enum Environment {
	DEVELOPMENT = 'development',
	PRODUCTION = 'production',
}

export class EnvironmentVariables {
	@IsEnum(Environment)
	readonly NODE_ENV: Environment = Environment.DEVELOPMENT;

	@IsNumber()
	@Min(0)
	@Max(65535)
	@Transform(({ value }) => Number(value))
	readonly PORT: number = 3000;

	@IsString()
	readonly APP_URL: string;

	@IsString()
	readonly CLIENT_URL: string;

	@IsString()
	readonly DATABASE_USER: string;

	@IsString()
	readonly DATABASE_PASSWORD: string;

	@IsString()
	readonly DATABASE_HOST: string;

	@IsNumber()
	@Min(0)
	@Max(65535)
	@Transform(({ value }) => Number(value))
	readonly DATABASE_PORT: number;

	@IsString()
	readonly DATABASE_NAME: string;

	@IsString()
	readonly DATABASE_URL: string;

	@IsString()
	readonly REDIS_HOST: string;

	@IsNumber()
	@Min(0)
	@Max(65535)
	@Transform(({ value }) => Number(value))
	readonly REDIS_PORT: number;

	@IsString()
	readonly REDIS_PASSWORD: string;

	@IsString()
	readonly JWT_ACCESS_SECRET: string;

	@IsNumber()
	@Transform(({ value }) => Number(value))
	readonly JWT_ACCESS_EXPIRATION: number;

	@IsString()
	readonly JWT_REFRESH_SECRET: string;

	@IsNumber()
	@Transform(({ value }) => Number(value))
	readonly JWT_REFRESH_EXPIRATION: number;

	@IsString()
	MAIL_HOST: string;

	@IsNumber()
	@Transform(({ value }) => Number(value))
	MAIL_PORT: number;

	@IsString()
	MAIL_USERNAME: string;

	@IsString()
	MAIL_PASSWORD: string;

	@IsBoolean()
	MAIL_ENCRYPTION: boolean;

	@IsString()
	MAIL_FROM_ADDRESS: string;

	@IsString()
	MAIL_FROM_NAME: string;

	@IsString()
	readonly S3_ACCESS_KEY_ID: string;

	@IsString()
	readonly S3_SECRET_ACCESS_KEY: string;

	@IsString()
	readonly S3_REGION: string;

	@IsString()
	readonly S3_BUCKET_NAME: string;

	@IsString()
	readonly S3_ENDPOINT: string;

	@IsString()
	readonly DEFAULT_AVATAR_PATH: string;
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	});
	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}

	return validatedConfig;
}
