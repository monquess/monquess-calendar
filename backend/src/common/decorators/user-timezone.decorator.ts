import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UserTimezone = createParamDecorator(
	(_data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<Request>();
		const timezone = request.headers['accept-timezone'] as string;

		return timezone || 'UTC';
	}
);
