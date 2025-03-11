import { applyDecorators } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
} from '@nestjs/swagger';
import { Event } from '@prisma/client';

export const ApiEventFindById = () =>
	applyDecorators(
		applyDecorators(
			ApiBearerAuth(),
			ApiOperation({ summary: 'Get event by id' }),
			ApiParam({
				name: 'id',
				description: 'event id',
			}),
			ApiOkResponse({ type: Event }),
			ApiNotFoundResponse({
				description: 'Event not found',
			})
		)
	);

export const ApiEventUpdate = () =>
	applyDecorators(
		applyDecorators(
			ApiBearerAuth(),
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
		)
	);

export const ApiEventRemove = () =>
	applyDecorators(
		applyDecorators(
			ApiBearerAuth(),
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
		)
	);
