import {
	Controller,
	Body,
	ClassSerializerInterceptor,
	Get,
	Patch,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	SerializeOptions,
	UseInterceptors,
	Post,
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

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: EventEntity })
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
