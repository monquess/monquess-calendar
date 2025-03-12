import { ApiAuth } from '@common/decorators/swagger/api-auth.decorator';
import { applyDecorators } from '@nestjs/common';
import {
	ApiForbiddenResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
} from '@nestjs/swagger';

export const ApiEventFindById = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Get event by id' }),
		ApiParam({
			name: 'id',
			description: 'event id',
		}),
		ApiOkResponse({ type: Event }),
		ApiNotFoundResponse({
			description: 'Event not found',
		})
	);

export const ApiEventUpdate = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Get event by id' }),
		ApiParam({
			name: 'id',
			description: 'event id',
		}),
		ApiOkResponse({ type: Event }),
		ApiForbiddenResponse({
			description: 'Access denied',
		}),
		ApiNotFoundResponse({
			description: 'Event not found',
		})
	);

export const ApiEventRemove = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Remove event by id' }),
		ApiParam({
			name: 'id',
			description: 'event id',
		}),
		ApiNoContentResponse(),
		ApiForbiddenResponse({
			description: 'Access denied',
		}),
		ApiNotFoundResponse({
			description: 'Event not found',
		})
	);
