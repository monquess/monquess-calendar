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
import {
	ApiAuthLogin,
	ApiAuthLogout,
	ApiAuthRefresh,
	ApiAuthRegister,
	ApiAuthSendVerification,
	ApiAuthVerifyEmail,
} from './decorators/api-auth.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';
import { UserEntity } from '@modules/user/entities/user.entity';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from '@common/decorators/public.decorator';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { EmailVerifyDto } from './dto/email-verify.dto';
import { SendEmailDto } from './dto/send-email.dto';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserEntity })
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiAuthRegister()
	@Public()
	@Post('register')
	register(@Body() dto: RegisterDto): Promise<void> {
		return this.authService.register(dto);
	}

	@ApiAuthLogin()
	@UseGuards(LocalAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Public()
	@Post('login')
	login(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) res: Response
	): Promise<AuthResponseDto> {
		return this.authService.login(user, res);
	}

	@ApiAuthLogout()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('logout')
	async logout(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) res: Response
	): Promise<void> {
		return this.authService.logout(user.id, res);
	}

	@ApiAuthRefresh()
	@UseGuards(JwtRefreshAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	async refresh(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) res: Response
	): Promise<AuthResponseDto> {
		return this.authService.refreshTokens(user, res);
	}

	@ApiAuthVerifyEmail()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Public()
	@Post('verify-email')
	async verifyEmail(@Body() { email, token }: EmailVerifyDto): Promise<void> {
		return this.authService.verifyEmail(email, token);
	}

	@ApiAuthSendVerification()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Public()
	@Post('send-verification')
	async sendVerification(@Body() { email }: SendEmailDto): Promise<void> {
		return this.authService.sendVerificationEmail(email);
	}
}
