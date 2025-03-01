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
	Query,
	SerializeOptions,
	UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FilteringOptionsDto } from './dto/filtering-options.dto';
import { UserEntity } from './entities/user.entity';
import {
	ApiUserFindAll,
	ApiUserFindById,
	ApiUserRemove,
	ApiUserUpdate,
	ApiUserUpdatePassword,
} from './decorators/api-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserEntity })
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiUserFindAll()
	@Get()
	findAll(
		@Query() filteringOptions: FilteringOptionsDto
	): Promise<UserEntity[]> {
		return this.userService.findAll(filteringOptions);
	}

	@ApiUserFindById()
	@Get(':id')
	findById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
		return this.userService.findById(id);
	}

	@ApiUserUpdate()
	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto
	): Promise<UserEntity> {
		return this.userService.update(id, updateUserDto);
	}

	@ApiUserUpdatePassword()
	@Patch(':id/updatePassword')
	updatePassword(
		@Param('id', ParseIntPipe) id: number,
		@Body() updatePasswordDto: UpdatePasswordDto
	): Promise<UserEntity> {
		return this.userService.updatePassword(id, updatePasswordDto);
	}

	@ApiUserRemove()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		return this.userService.remove(id);
	}
}
