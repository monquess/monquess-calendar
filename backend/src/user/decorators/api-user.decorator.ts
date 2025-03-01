import { applyDecorators } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
} from '@nestjs/swagger';
import { UpdatePasswordDto } from '@user/dto/update-password.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { UserEntity } from '@user/entities/user.entity';

export const ApiUserFindAll = () =>
	applyDecorators(
		ApiOperation({ summary: 'Get all users' }),
		ApiOkResponse({
			type: [UserEntity],
		})
	);

export const ApiUserFindById = () =>
	applyDecorators(
		ApiOperation({ summary: 'Get user by id' }),
		ApiOkResponse({
			type: UserEntity,
		}),
		ApiNotFoundResponse({
			description: 'Record not found',
		})
	);

export const ApiUserUpdate = () =>
	applyDecorators(
		ApiOperation({ summary: 'Update user' }),
		ApiParam({
			name: 'id',
			description: 'user id',
		}),
		ApiBody({
			type: UpdateUserDto,
		}),
		ApiOkResponse({ type: UserEntity }),
		ApiNotFoundResponse({ description: 'User not found' }),
		ApiConflictResponse({ description: 'User already exists' })
	);

export const ApiUserUpdatePassword = () =>
	applyDecorators(
		ApiOperation({ summary: 'Update password' }),
		ApiParam({
			name: 'id',
			description: 'user id',
		}),
		ApiBody({
			type: UpdatePasswordDto,
		}),
		ApiOkResponse({ type: UserEntity }),
		ApiNotFoundResponse({ description: 'User not found' }),
		ApiBadRequestResponse({ description: 'Current password is incorrect' })
	);

export const ApiUserRemove = () =>
	applyDecorators(
		ApiOperation({ summary: 'Delete user' }),
		ApiParam({
			name: 'id',
			description: 'user id',
		}),
		ApiNotFoundResponse({ description: 'User not found' })
	);
