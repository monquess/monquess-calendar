import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

export interface CurrentUser extends User {
	timezone: string;
}

export const CurrentUser = createParamDecorator(
	(_data: unknown, context: ExecutionContext): CurrentUser => {
		const request = context.switchToHttp().getRequest<Request>();
		const user = request.user as User;
		const timezone = (request.headers['accept-timezone'] as string) || 'UTC';

		return {
			...user,
			timezone,
		};
	}
);
