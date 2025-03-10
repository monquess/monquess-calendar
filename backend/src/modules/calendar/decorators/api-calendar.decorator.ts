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
import { CreateCalendarMemberDto } from '../dto/create-calendar-member.dto';
import { UpdateCalendarMemberRoleDto } from '../dto/update-calendar-member-role.dto';
import { CalendarMemberEntity } from '../entities/calendar-member.entity';
import { UpdateCalendarMemberStatusDto } from '../dto/update-calendar-member-status.dto';

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

export const ApiCalendarMemberCreate = () =>
	applyDecorators(
		ApiBearerAuth(),
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
			description: 'Calendar not found | User not found',
		}),
		ApiForbiddenResponse({
			description: 'Access denied',
		})
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

export const ApiCalendarMemberUpdateRole = () =>
	applyDecorators(
		ApiBearerAuth(),
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
			description: 'Calendar not found | User not found',
		}),
		ApiForbiddenResponse({
			description: 'Access denied',
		})
	);

export const ApiCalendarMemberUpdateStatus = () =>
	applyDecorators(
		ApiBearerAuth(),
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
			description: 'Calendar not found | User not found',
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

export const ApiCalendarMemberRemove = () =>
	applyDecorators(
		ApiBearerAuth(),
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
			description: 'Calendar not found | User not found',
		}),
		ApiForbiddenResponse({
			description: 'Access denied',
		})
	);
