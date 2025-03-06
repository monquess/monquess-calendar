import { applyDecorators } from '@nestjs/common';
import {
	ApiOperation,
	ApiCreatedResponse,
	ApiConflictResponse,
	ApiOkResponse,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponseDto } from '../dto/auth-response.dto';

export const ApiAuthRegister = () =>
	applyDecorators(
		ApiOperation({ summary: 'Register a new user' }),
		ApiCreatedResponse({
			description: 'User has been successfully registered',
		}),
		ApiConflictResponse({ description: 'User already exists' })
	);

export const ApiAuthLogin = () =>
	applyDecorators(
		ApiOperation({ summary: 'Login user' }),
		ApiOkResponse({ type: AuthResponseDto }),
		ApiUnauthorizedResponse({ description: 'Invalid email or password' })
	);
