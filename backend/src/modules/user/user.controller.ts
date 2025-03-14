import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	HttpCode,
	HttpStatus,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	ParseIntPipe,
	Patch,
	Query,
	SerializeOptions,
	UploadedFile,
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
	ApiUserUpdateAvatar,
	ApiUserUpdatePassword,
} from './decorators/api-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageTransformPipe } from '@modules/s3/pipes/image-transform.pipe';

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

	@ApiUserUpdateAvatar()
	@Patch(':id/avatar')
	@UseInterceptors(FileInterceptor('avatar'))
	updateAvatar(
		@Param('id', ParseIntPipe) id: number,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp|tiff)' }),
					new MaxFileSizeValidator({
						maxSize: 10e6,
						message: 'File is too large. Max file size is 10MB',
					}),
				],
			}),
			new ImageTransformPipe()
		)
		avatar: Express.Multer.File
	): Promise<UserEntity> {
		return this.userService.updateAvatar(id, avatar);
	}

	@ApiUserRemove()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		return this.userService.remove(id);
	}
}
