import { applyDecorators } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
} from '@nestjs/swagger';
import { CalendarEntity } from '../entities/calendar.entity';
import { CreateCalendarDto } from '../dto/create-calendar.dto';
import { UpdateCalendarDto } from '../dto/update-calendar.dto';

export const ApiCalendarFindAll = () =>
	applyDecorators(
		ApiBearerAuth(),
		ApiOperation({ summary: 'Get all calendars' }),
		ApiOkResponse({ type: [CalendarEntity] })
	);

export const ApiCalendarFindById = () =>
	applyDecorators(
		ApiBearerAuth(),
		ApiOperation({ summary: 'Get calendar by id' }),
		ApiParam({
			name: 'id',
			description: 'calendar id',
		}),
		ApiOkResponse({ type: CalendarEntity }),
		ApiNotFoundResponse({
			description: 'Calendar not found',
		})
	);

export const ApiCalendarCreate = () =>
	applyDecorators(
		ApiBearerAuth(),
		ApiOperation({ summary: 'Create calendar' }),
		ApiBody({
			type: CreateCalendarDto,
		}),
		ApiCreatedResponse({ type: CalendarEntity })
	);

export const ApiCalendarUpdate = () =>
	applyDecorators(
		ApiBearerAuth(),
		ApiOperation({ summary: 'Update calendar' }),
		ApiParam({
			name: 'id',
			description: 'calendar id',
		}),
		ApiBody({
			type: UpdateCalendarDto,
		}),
		ApiOkResponse({ type: CalendarEntity }),
		ApiNotFoundResponse({
			description: 'Calendar not found',
		}),
		ApiForbiddenResponse({
			description: 'Access denied',
		})
	);

export const ApiCalendarRemove = () =>
	applyDecorators(
		ApiBearerAuth(),
		ApiOperation({ summary: 'Delete calendar' }),
		ApiParam({
			name: 'id',
			description: 'calendar id',
		}),
		ApiNoContentResponse(),
		ApiNotFoundResponse({
			description: 'Calendar not found',
		}),
		ApiForbiddenResponse({
			description: 'Access denied',
		})
	);
