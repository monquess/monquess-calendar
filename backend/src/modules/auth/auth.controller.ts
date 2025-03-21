import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
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
import { Provider, User } from '@prisma/client';
import { Response } from 'express';
import { UserEntity } from '@modules/user/entities/user.entity';
import {
	AuthResponseDto,
	RegisterDto,
	EmailVerifyDto,
	SendEmailDto,
	ResetPasswordDto,
} from './dto';
import {
	LocalAuthGuard,
	JwtRefreshAuthGuard,
	RecaptchaGuard,
	GoogleAuthGuard,
} from './guards';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@config/env/environment-variables.config';
import { Public } from '@common/decorators/public.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UserLocationInterceptor } from '@common/interceptors/user-location.interceptor';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserEntity })
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService<EnvironmentVariables, true>
	) {}

	@ApiAuthRegister()
	@UseGuards(RecaptchaGuard)
	@UseInterceptors(UserLocationInterceptor)
	@Public()
	@Post('register')
	async register(
		@Body() dto: RegisterDto,
		@CurrentUser() { country }: CurrentUser
	): Promise<void> {
		console.log(country);
		return this.authService.register(dto, country);
	}

	@ApiAuthLogin()
	@Public()
	@UseGuards(LocalAuthGuard, RecaptchaGuard)
	@HttpCode(HttpStatus.OK)
	@Post('login')
	login(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) res: Response
	): Promise<AuthResponseDto> {
		return this.authService.login(user, res);
	}

	@ApiExcludeEndpoint()
	@Public()
	@UseGuards(GoogleAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Get('google')
	async googleAuth(): Promise<void> {}

	@ApiExcludeEndpoint()
	@Public()
	@UseGuards(GoogleAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Get('google/callback')
	async googleAuthCallback(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) res: Response
	): Promise<void> {
		await this.authService.socialLogin(user, Provider.GOOGLE, res);
		return res.redirect(this.configService.get('CLIENT_URL'));
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
	@Public()
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
	@Public()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('verify-email')
	async verifyEmail(@Body() { email, token }: EmailVerifyDto): Promise<void> {
		return this.authService.verifyEmail(email, token);
	}

	@ApiAuthForgotPassword()
	@Public()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('forgot-password')
	async sendPasswordResetEmail(@Body() { email }: SendEmailDto): Promise<void> {
		return this.authService.sendPasswordResetEmail(email);
	}

	@ApiAuthResetPassword()
	@Public()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('reset-password')
	async resetPassword(
		@Body() { email, token, password }: ResetPasswordDto
	): Promise<void> {
		return this.authService.resetPassword(email, token, password);
	}
}
