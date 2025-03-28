import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	SerializeOptions,
	UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { CalendarService } from './calendar.service';
import {
	ApiCalendarCreate,
	ApiCalendarEventCreate,
	ApiCalendarFindAll,
	ApiCalendarFindById,
	ApiCalendarFindEvents,
	ApiCalendarMemberCreate,
	ApiCalendarMemberRemove,
	ApiCalendarMemberUpdateRole,
	ApiCalendarMemberUpdateStatus,
	ApiCalendarRemove,
	ApiCalendarUpdate,
} from './decorators/api-calendar.decorator';
import {
	CreateCalendarDto,
	UpdateCalendarDto,
	UpdateCalendarMemberRoleDto,
	CreateCalendarMemberDto,
	UpdateCalendarMemberStatusDto,
} from './dto/';
import { CalendarEntity } from './entities/calendar.entity';
import { CalendarMemberEntity } from './entities/calendar-member.entity';

import { EventService } from '@modules/event/event.service';
import { CreateEventDto } from '@modules/event/dto/create-event.dto';
import { EventEntity } from '@modules/event/entities/event.entity';
import { FilteringOptionsDto as EventFilteringOptionsDto } from '@modules/event/dto/filtering-option.dto';
import { UserLocationInterceptor } from '@common/interceptors/user-location.interceptor';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { FilteringOptionsDto as CalendarFilteringOptionsDto } from './dto/filtering-option.dto';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: CalendarEntity })
@Controller('calendars')
export class CalendarController {
	constructor(
		private readonly calendarService: CalendarService,
		private readonly eventService: EventService
	) {}

	@ApiCalendarFindAll()
	@Get()
	findAll(
		@Query() filteringOptions: CalendarFilteringOptionsDto,
		@CurrentUser() user: User
	): Promise<CalendarEntity[]> {
		return this.calendarService.findAll(filteringOptions, user);
	}

	@ApiCalendarFindById()
	@Get(':id')
	findById(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: User
	): Promise<CalendarEntity> {
		return this.calendarService.findById(id, user);
	}

	@ApiCalendarCreate()
	@Post()
	create(
		@CurrentUser() user: User,
		@Body() createCalendarDto: CreateCalendarDto
	): Promise<CalendarEntity> {
		return this.calendarService.create(user, createCalendarDto);
	}

	@ApiCalendarFindEvents()
	@UseInterceptors(UserLocationInterceptor)
	@Get(':id/events')
	findEvents(
		@Param('id', ParseIntPipe) id: number,
		@Query() filteringOptions: EventFilteringOptionsDto,
		@CurrentUser() currentUser: CurrentUser
	): Promise<EventEntity[]> {
		return this.eventService.findByCalendarId(
			id,
			filteringOptions,
			currentUser
		);
	}

	@ApiCalendarEventCreate()
	@UseInterceptors(UserLocationInterceptor)
	@Post(':id/events')
	createEvent(
		@Param('id', ParseIntPipe) id: number,
		@Body() createCalendarMemberDto: CreateEventDto,
		@CurrentUser() currentUser: CurrentUser
	): Promise<EventEntity> {
		return this.eventService.create(id, createCalendarMemberDto, currentUser);
	}

	@ApiCalendarMemberCreate()
	@Post(':calendarId/users/:userId')
	createCalendarMember(
		@Param('calendarId', ParseIntPipe) calendarId: number,
		@Param('userId', ParseIntPipe) targetUserId: number,
		@CurrentUser() currentUser: CurrentUser,
		@Body() createCalendarMemberDto: CreateCalendarMemberDto
	): Promise<CalendarMemberEntity> {
		return this.calendarService.createCalendarMember(
			calendarId,
			targetUserId,
			currentUser,
			createCalendarMemberDto
		);
	}

	@ApiCalendarUpdate()
	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: CurrentUser,
		@Body() updateCalendarDto: UpdateCalendarDto
	): Promise<CalendarEntity> {
		return this.calendarService.update(id, user, updateCalendarDto);
	}

	@ApiCalendarMemberUpdateRole()
	@Patch(':calendarId/users/:userId/role')
	updateCalendarMemberRole(
		@Param('calendarId', ParseIntPipe) calendarId: number,
		@Param('userId', ParseIntPipe) targetUserId: number,
		@CurrentUser() currentUser: User,
		@Body() updateCalendarMemberRoleDto: UpdateCalendarMemberRoleDto
	): Promise<CalendarMemberEntity> {
		return this.calendarService.updateCalendarMemberRole(
			calendarId,
			targetUserId,
			currentUser,
			updateCalendarMemberRoleDto
		);
	}

	@ApiCalendarMemberUpdateStatus()
	@Patch(':calendarId/users/:userId/status')
	updateCalendarMemberStatus(
		@Param('calendarId', ParseIntPipe) calendarId: number,
		@Param('userId', ParseIntPipe) targetUserId: number,
		@CurrentUser() currentUser: User,
		@Body() updateCalendarMemberStatusDto: UpdateCalendarMemberStatusDto
	): Promise<CalendarMemberEntity> {
		return this.calendarService.updateCalendarMemberStatus(
			calendarId,
			targetUserId,
			currentUser,
			updateCalendarMemberStatusDto
		);
	}

	@ApiCalendarRemove()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	remove(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: User
	): Promise<void> {
		return this.calendarService.remove(id, user);
	}

	@ApiCalendarMemberRemove()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':calendarId/users/:userId')
	removeCalendarMember(
		@Param('calendarId', ParseIntPipe) calendarId: number,
		@Param('userId', ParseIntPipe) targetUserId: number,
		@CurrentUser() currentUser: User
	): Promise<void> {
		return this.calendarService.removeCalendarMember(
			calendarId,
			targetUserId,
			currentUser
		);
	}
}
