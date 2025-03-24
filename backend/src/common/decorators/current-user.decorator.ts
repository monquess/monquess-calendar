import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CountryCode } from '@common/constants/country-codes.constant';
import { User } from '@prisma/client';
import { Request } from 'express';

export interface CurrentUser extends User {
	country: CountryCode;
	timezone: string;
}

export const CurrentUser = createParamDecorator(
	(_data: unknown, context: ExecutionContext): CurrentUser => {
		const request = context.switchToHttp().getRequest<Request>();
		return request.user as CurrentUser;
	}
);
