import { ApiAuth } from '@common/decorators/swagger/api-auth.decorator';
import { applyDecorators } from '@nestjs/common';
import {
	ApiBody,
	ApiForbiddenResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
} from '@nestjs/swagger';

import {
	CreateEventMemberDto,
	UpdateEventDto,
	UpdateEventMemberRoleDto,
	UpdateEventMemberStatusDto,
} from '../dto';
import { EventMemberEntity } from '../entities/event-member.entity';
import { EventEntity } from '../entities/event.entity';
import { ReminderEntity } from '../entities/reminder.entity';

export const ApiEventFindById = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Get event by id' }),
		ApiParam({
			name: 'id',
			description: 'event id',
		}),
		ApiOkResponse({ type: EventEntity }),
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
		ApiBody({
			type: UpdateEventDto,
		}),
		ApiOkResponse({ type: EventEntity }),
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

export const ApiReminderCreate = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Create reminder for event' }),
		ApiParam({
			name: 'id',
			description: 'event id',
		}),
		ApiOkResponse({ type: ReminderEntity }),
		ApiNotFoundResponse({
			description: 'Event not found',
		})
	);

export const ApiReminderRemove = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Remove reminder for event' }),
		ApiParam({
			name: 'id',
			description: 'event id',
		}),
		ApiParam({
			name: 'reminderId',
			description: 'reminder id',
		}),
		ApiNoContentResponse(),
		ApiNotFoundResponse({
			description: 'Event not found',
		})
	);

export const ApiEventMemberCreate = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Create event member' }),
		ApiParam({
			name: 'id',
			description: 'event id',
		}),
		ApiParam({
			name: 'userId',
			description: 'user id',
		}),
		ApiBody({
			type: CreateEventMemberDto,
		}),
		ApiOkResponse({ type: EventMemberEntity }),
		ApiForbiddenResponse({
			description: 'Access denied',
		}),
		ApiNotFoundResponse({
			description: 'Event not found',
		}),
		ApiNotFoundResponse({
			description: 'User not found',
		})
	);

export const ApiEventMemberUpdateStatus = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Update event member invitation status' }),
		ApiParam({
			name: 'id',
			description: 'event id',
		}),
		ApiParam({
			name: 'userId',
			description: 'user id',
		}),
		ApiBody({
			type: UpdateEventMemberStatusDto,
		}),
		ApiOkResponse({ type: EventMemberEntity }),
		ApiForbiddenResponse({
			description: 'Access denied',
		}),
		ApiNotFoundResponse({
			description: 'Event not found',
		}),
		ApiNotFoundResponse({
			description: 'User not found',
		})
	);

export const ApiEventMemberUpdateRole = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Update event member role' }),
		ApiParam({
			name: 'id',
			description: 'event id',
		}),
		ApiParam({
			name: 'userId',
			description: 'user id',
		}),
		ApiBody({
			type: UpdateEventMemberRoleDto,
		}),
		ApiOkResponse({ type: EventMemberEntity }),
		ApiForbiddenResponse({
			description: 'Access denied',
		}),
		ApiNotFoundResponse({
			description: 'Event not found',
		}),
		ApiNotFoundResponse({
			description: 'User not found',
		})
	);

export const ApiEventMemberRemove = () =>
	applyDecorators(
		ApiAuth(),
		ApiOperation({ summary: 'Remove event member' }),
		ApiParam({
			name: 'id',
			description: 'event id',
		}),
		ApiParam({
			name: 'userId',
			description: 'user id',
		}),
		ApiNoContentResponse(),
		ApiForbiddenResponse({
			description: 'Access denied',
		}),
		ApiNotFoundResponse({
			description: 'Event not found',
		}),
		ApiNotFoundResponse({
			description: 'User not found',
		})
	);
