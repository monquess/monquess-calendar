import { applyDecorators } from '@nestjs/common';
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
} from '@nestjs/swagger';
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
