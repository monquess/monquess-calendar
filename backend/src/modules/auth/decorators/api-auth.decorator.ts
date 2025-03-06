import { applyDecorators } from '@nestjs/common';
import {
	ApiOperation,
	ApiCreatedResponse,
	ApiConflictResponse,
	ApiOkResponse,
	ApiUnauthorizedResponse,
	ApiNoContentResponse,
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiBadRequestResponse,
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

export const ApiAuthLogout = () =>
	applyDecorators(
		ApiBearerAuth(),
		ApiOperation({ summary: 'Logout user' }),
		ApiNoContentResponse({
			description: 'User has been successfully logged out',
		})
	);

export const ApiAuthRefresh = () =>
	applyDecorators(
		ApiBearerAuth(),
		ApiOperation({ summary: 'Refresh JWT tokens' }),
		ApiOkResponse({ type: AuthResponseDto }),
		ApiUnauthorizedResponse({ description: 'Invalid refresh token' }),
		ApiNotFoundResponse({ description: "User doesn't exist" })
	);

export const ApiAuthVerifyEmail = () =>
	applyDecorators(
		ApiOperation({ summary: 'Verify user email' }),
		ApiNoContentResponse({
			description: 'User email has been successfully verified',
		}),
		ApiBadRequestResponse({ description: 'Invalid token' })
	);
