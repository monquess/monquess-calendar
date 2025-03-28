import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	SerializeOptions,
	UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import {
	ApiEventFindById,
	ApiEventMemberCreate,
	ApiEventMemberRemove,
	ApiEventMemberUpdateRole,
	ApiEventMemberUpdateStatus,
	ApiEventRemove,
	ApiEventUpdate,
	ApiReminderCreate,
	ApiReminderRemove,
} from './decorators/api-event.decorator';
import { EventEntity } from './entities/event.entity';
import { EventMemberEntity } from './entities/event-member.entity';
import {
	UpdateEventMemberRoleDto,
	UpdateEventMemberStatusDto,
	UpdateEventDto,
	CreateEventMemberDto,
} from './dto/';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UserLocationInterceptor } from '@common/interceptors/user-location.interceptor';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { ReminderEntity } from './entities/reminder.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('events')
export class EventController {
	constructor(private readonly eventService: EventService) {}

	@ApiEventFindById()
	@UseInterceptors(UserLocationInterceptor)
	@HttpCode(HttpStatus.OK)
	@Get('invites')
	findInvites(@CurrentUser() user: CurrentUser): Promise<EventEntity[]> {
		return this.eventService.findInvites(user);
	}

	@SerializeOptions({ type: EventEntity })
	@ApiEventFindById()
	@UseInterceptors(UserLocationInterceptor)
	@HttpCode(HttpStatus.OK)
	@Get(':id')
	findById(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: CurrentUser
	): Promise<EventEntity> {
		return this.eventService.findById(id, user);
	}

	@SerializeOptions({ type: EventEntity })
	@ApiEventUpdate()
	@UseInterceptors(UserLocationInterceptor)
	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateEventDto: UpdateEventDto,
		@CurrentUser() user: CurrentUser
	): Promise<EventEntity> {
		return this.eventService.update(id, updateEventDto, user);
	}

	@SerializeOptions({ type: EventEntity })
	@ApiEventRemove()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	delete(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: CurrentUser
	): Promise<void> {
		return this.eventService.remove(id, user);
	}

	@ApiEventMemberCreate()
	@HttpCode(HttpStatus.OK)
	@Post(':id/members/:userId')
	createMemberStatus(
		@Param('id', ParseIntPipe) id: number,
		@Param('userId', ParseIntPipe) userId: number,
		@Body() dto: CreateEventMemberDto,
		@CurrentUser() user: CurrentUser
	): Promise<EventMemberEntity> {
		return this.eventService.createMember(id, userId, dto, user);
	}

	@SerializeOptions({ type: ReminderEntity })
	@ApiReminderCreate()
	@Post(':id/reminder')
	async createReminder(
		@Param('id', ParseIntPipe) id: number,
		@Body() createReminderDto: CreateReminderDto,
		@CurrentUser() user: CurrentUser
	): Promise<ReminderEntity> {
		return this.eventService.createReminder(id, createReminderDto, user);
	}

	@SerializeOptions({ type: ReminderEntity })
	@ApiReminderRemove()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id/reminder/:reminderId')
	async removeReminder(
		@Param('id', ParseIntPipe) id: number,
		@Param('reminderId', ParseIntPipe) reminderId: number,
		@CurrentUser() user: CurrentUser
	): Promise<void> {
		return this.eventService.removeReminder(id, reminderId, user);
	}

	@SerializeOptions({ type: EventEntity })
	@ApiEventMemberUpdateStatus()
	@HttpCode(HttpStatus.OK)
	@Patch(':id/members/:userId/status')
	updateMemberStatus(
		@Param('id', ParseIntPipe) id: number,
		@Param('userId', ParseIntPipe) userId: number,
		@Body() dto: UpdateEventMemberStatusDto,
		@CurrentUser() user: CurrentUser
	): Promise<EventMemberEntity> {
		return this.eventService.updateMemberStatus(id, userId, dto, user);
	}

	@SerializeOptions({ type: EventEntity })
	@ApiEventMemberUpdateRole()
	@HttpCode(HttpStatus.OK)
	@Patch(':id/members/:userId/role')
	updateMemberRole(
		@Param('id', ParseIntPipe) id: number,
		@Param('userId', ParseIntPipe) userId: number,
		@Body() dto: UpdateEventMemberRoleDto,
		@CurrentUser() user: CurrentUser
	): Promise<EventMemberEntity> {
		return this.eventService.updateMemberRole(id, userId, dto, user);
	}

	@SerializeOptions({ type: EventEntity })
	@ApiEventMemberRemove()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id/members/:userId')
	removeMember(
		@Param('id', ParseIntPipe) id: number,
		@Param('userId', ParseIntPipe) userId: number,
		@CurrentUser() user: CurrentUser
	): Promise<void> {
		return this.eventService.removeMember(id, userId, user);
	}
}
