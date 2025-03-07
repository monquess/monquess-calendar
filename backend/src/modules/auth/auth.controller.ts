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
	ApiAuthForgotPassword,
	ApiAuthLogin,
	ApiAuthLogout,
	ApiAuthRefresh,
	ApiAuthRegister,
	ApiAuthResetPassword,
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
import { ResetPasswordDto } from './dto/reset-password.dto';

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
		@CurrentUser() { id }: User,
		@Res({ passthrough: true }) res: Response
	): Promise<void> {
		return this.authService.logout(id, res);
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

	@ApiAuthSendVerification()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Public()
	@Post('send-verification')
	async sendVerificationEmail(@Body() { email }: SendEmailDto): Promise<void> {
		return this.authService.sendVerificationEmail(email);
	}

	@ApiAuthVerifyEmail()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Public()
	@Post('verify-email')
	async verifyEmail(@Body() { email, token }: EmailVerifyDto): Promise<void> {
		return this.authService.verifyEmail(email, token);
	}

	@ApiAuthForgotPassword()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Public()
	@Post('forgot-password')
	async sendPasswordResetEmail(@Body() { email }: SendEmailDto): Promise<void> {
		return this.authService.sendPasswordResetEmail(email);
	}

	@ApiAuthResetPassword()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Public()
	@Post('reset-password')
	async resetPassword(
		@Body() { email, token, password }: ResetPasswordDto
	): Promise<void> {
		return this.authService.resetPassword(email, token, password);
	}
}
