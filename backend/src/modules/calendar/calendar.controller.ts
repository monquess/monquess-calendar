import { CurrentUser } from '@common/decorators/current-user.decorator';
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
	SerializeOptions,
	UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { CalendarEntity } from './entities/calendar.entity';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import {
	ApiCalendarCreate,
	ApiCalendarFindAll,
	ApiCalendarFindById,
	ApiCalendarMemberCreate,
	ApiCalendarMemberRemove,
	ApiCalendarMemberUpdateRole,
	ApiCalendarMemberUpdateStatus,
	ApiCalendarRemove,
	ApiCalendarUpdate,
} from './decorators/api-calendar.decorator';
import { CalendarMemberEntity } from './entities/calendar-member.entity';
import { UpdateCalendarMemberRoleDto } from './dto/update-calendar-member-role.dto';
import { CreateCalendarMemberDto } from './dto/create-calendar-member.dto';
import { UpdateCalendarMemberStatusDto } from './dto/update-calendar-member-status.dto';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: CalendarEntity })
@Controller('calendars')
export class CalendarController {
	constructor(private readonly calendarService: CalendarService) {}

	@ApiCalendarFindAll()
	@Get()
	findAll(@CurrentUser() user: User): Promise<CalendarEntity[]> {
		return this.calendarService.findAll(user);
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

	@ApiCalendarMemberCreate()
	@Post(':calendarId/users/:userId')
	createCalendarMember(
		@Param('calendarId', ParseIntPipe) calendarId: number,
		@Param('userId', ParseIntPipe) targetUserId: number,
		@CurrentUser() currentUser: User,
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
		@CurrentUser() user: User,
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
