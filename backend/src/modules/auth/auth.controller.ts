import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Res,
	SerializeOptions,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiAuthLogin, ApiAuthRegister } from './decorators/api-auth.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';
import { UserEntity } from '@modules/user/entities/user.entity';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterDto } from './dto/register.dto';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserEntity })
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiAuthRegister()
	@Post('register')
	register(@Body() dto: RegisterDto): Promise<void> {
		return this.authService.register(dto);
	}

	@ApiAuthLogin()
	@UseGuards(LocalAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Post('login')
	login(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) res: Response
	): Promise<AuthResponseDto> {
		return this.authService.login(user, res);
	}
}
