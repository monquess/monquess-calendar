import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const ApiAuth = () => {
	return applyDecorators(ApiBearerAuth(), ApiUnauthorizedResponse());
};
