import { applyDecorators } from '@nestjs/common';
import {
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
import { CreateCalendarMemberDto } from '../dto/create-calendar-member.dto';
import { UpdateCalendarMemberRoleDto } from '../dto/update-calendar-member-role.dto';
import { CalendarMemberEntity } from '../entities/calendar-member.entity';
import { UpdateCalendarMemberStatusDto } from '../dto/update-calendar-member-status.dto';
import { CreateEventDto } from '@modules/event/dto/create-event.dto';
import { EventEntity } from '@modules/event/entities/event.entity';
import { ApiAuth } from '@common/decorators/swagger/api-auth.decorator';

export const ApiCalendarFindAll = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Get all calendars' }),
		ApiOkResponse({ type: [CalendarEntity] })
	);

export const ApiCalendarFindById = () =>
	applyDecorators(
		ApiAuth(),
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
		ApiAuth(),
		ApiOperation({ summary: 'Create calendar' }),
		ApiBody({
			type: CreateCalendarDto,
		}),
		ApiCreatedResponse({ type: CalendarEntity })
	);

export const ApiCalendarEventCreate = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Create event in calendar' }),
		ApiParam({
			name: 'id',
			description: 'calendar id',
		}),
		ApiBody({
			type: CreateEventDto,
		}),
		ApiCreatedResponse({ type: EventEntity }),
		ApiNotFoundResponse({
			description: 'Calendar not found',
		}),
		ApiForbiddenResponse({
			description: 'Access denied',
		})
	);

export const ApiCalendarFindEvents = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Get all event in calendar' }),
		ApiParam({
			name: 'id',
			description: 'calendar id',
		}),
		ApiOkResponse({ type: [EventEntity] })
	);

export const ApiCalendarMemberCreate = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Create calendar member' }),
		ApiParam({
			name: 'calendarId',
			description: 'calendar id',
		}),
		ApiParam({
			name: 'userId',
			description: 'user id',
		}),
		ApiBody({
			type: CreateCalendarMemberDto,
		}),
		ApiCreatedResponse({ type: CalendarMemberEntity }),
		ApiNotFoundResponse({
			description: 'Calendar not found',
		}),
		ApiNotFoundResponse({
			description: 'User not found',
		}),
		ApiForbiddenResponse({
			description: 'Access denied',
		})
	);

export const ApiCalendarUpdate = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Update calendar by id' }),
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

export const ApiCalendarMemberUpdateRole = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Update calendar member role' }),
		ApiParam({
			name: 'calendarId',
			description: 'calendar id',
		}),
		ApiParam({
			name: 'userId',
			description: 'user id',
		}),
		ApiBody({
			type: UpdateCalendarMemberRoleDto,
		}),
		ApiOkResponse({ type: CalendarMemberEntity }),
		ApiNotFoundResponse({
			description: 'Calendar not found',
		}),
		ApiNotFoundResponse({
			description: 'User not found',
		}),
		ApiForbiddenResponse({
			description: 'Access denied',
		})
	);

export const ApiCalendarMemberUpdateStatus = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Update calendar member status' }),
		ApiParam({
			name: 'calendarId',
			description: 'calendar id',
		}),
		ApiParam({
			name: 'userId',
			description: 'user id',
		}),
		ApiBody({
			type: UpdateCalendarMemberStatusDto,
		}),
		ApiOkResponse({ type: CalendarMemberEntity }),
		ApiNotFoundResponse({
			description: 'Calendar not found',
		}),
		ApiNotFoundResponse({
			description: 'User not found',
		}),
		ApiForbiddenResponse({
			description: 'Access denied',
		})
	);

export const ApiCalendarRemove = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Delete calendar by id' }),
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

export const ApiCalendarMemberRemove = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Delete calendar member' }),
		ApiParam({
			name: 'calendarId',
			description: 'calendar id',
		}),
		ApiParam({
			name: 'userId',
			description: 'user id',
		}),
		ApiNoContentResponse(),
		ApiNotFoundResponse({
			description: 'Calendar not found',
		}),
		ApiNotFoundResponse({
			description: 'User not found',
		}),
		ApiForbiddenResponse({
			description: 'Access denied',
		})
	);
