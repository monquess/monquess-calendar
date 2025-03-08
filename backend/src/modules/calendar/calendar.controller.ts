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
	ApiCalendarRemove,
	ApiCalendarUpdate,
} from './decorators/api-calendar.decorator';

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

	@ApiCalendarUpdate()
	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: User,
		@Body() updateCalendarDto: UpdateCalendarDto
	): Promise<CalendarEntity> {
		return this.calendarService.update(id, user, updateCalendarDto);
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
}
