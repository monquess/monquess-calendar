import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Query,
	SerializeOptions,
	UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { FilteringOptionsDto } from './dto/filtering-options.dto';
import { UserEntity } from './entities/user.entity';
import { ApiUserFindAll } from './decorators/api-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserEntity })
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiUserFindAll()
	@Get()
	findAll(@Query() filteringOptions: FilteringOptionsDto): Promise<User[]> {
		return this.userService.findAll(filteringOptions);
	}

	@Get(':id')
	findById(@Param('id', ParseIntPipe) id: number) {
		return this.userService.findById(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto
	) {}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {}
}
