import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	SerializeOptions,
	UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import {
	ApiEventFindById,
	ApiEventRemove,
	ApiEventUpdate,
} from './decorators/api-event.decorator';
import { User } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UpdateCalendarDto } from '@modules/calendar/dto';
import { EventEntity } from './entities/event.entity';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: EventEntity })
@Controller('events')
export class EventController {
	constructor(private readonly eventService: EventService) {}

	@ApiEventFindById()
	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async findById(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: User
	): Promise<EventEntity> {
		return this.eventService.findById(id, user);
	}

	@ApiEventUpdate()
	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateEventDto: UpdateCalendarDto,
		@CurrentUser() user: User
	): Promise<EventEntity> {
		return this.eventService.update(id, updateEventDto, user);
	}

	@ApiEventRemove()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Patch(':id')
	async delete(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: User
	): Promise<void> {
		return this.eventService.remove(id, user);
	}
}
