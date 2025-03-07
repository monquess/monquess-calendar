import {
	BadRequestException,
	ConflictException,
	Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@modules/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { User } from '@prisma/client';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RedisService } from '@modules/redis/redis.service';
import { EnvironmentVariables } from '@config/env/environment-variables.config';
import { UserService } from '@modules/user/user.service';
import { UserEntity } from '@modules/user/entities/user.entity';
import { TokenType } from './enum/token-type.enum';
import { MailService } from '@modules/mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly redis: RedisService,
		private readonly configService: ConfigService<EnvironmentVariables, true>,
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly mailService: MailService
	) {}

	async register(dto: RegisterDto): Promise<void> {
		const { email } = await this.userService.create(dto);
		await this.sendVerificationEmail(email);
	}

	async login(user: User, res: Response): Promise<AuthResponseDto> {
		const [accessToken, refreshToken] = await this.generateTokens({
			sub: user.id,
			email: user.email,
		});

		await this.updateRefreshToken(user, refreshToken, res);

		return {
			user: new UserEntity(user),
			accessToken,
		};
	}

	async logout(userId: number, res: Response): Promise<void> {
		await this.redis.del(TokenType.REFRESH, userId);
		res.clearCookie('refresh_token');
	}

	async refreshTokens(user: User, res: Response): Promise<AuthResponseDto> {
		const [accessToken, refreshToken] = await this.generateTokens({
			sub: user.id,
			email: user.email,
		});

		await this.updateRefreshToken(user, refreshToken, res);

		return {
			user: new UserEntity(user),
			accessToken,
		};
	}

	async verifyEmail(email: string, verifyToken: string): Promise<void> {
		const token = await this.redis.get<string>(TokenType.VERIFICATION, email);

		if (!token) {
			throw new BadRequestException('Invalid email');
		}

		if (token !== verifyToken) {
			throw new BadRequestException('Invalid token');
		}

		await this.prisma.user.update({
			where: {
				email,
			},
			data: {
				verified: true,
			},
		});
	}

	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.prisma.user.findUniqueOrThrow({
			where: {
				email,
			},
		});

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			throw new BadRequestException('Invalid password');
		}

		return user;
	}

	async sendVerificationEmail(email: string): Promise<void> {
		const user = await this.prisma.user.findUniqueOrThrow({
			where: {
				email,
			},
		});

		if (user.verified) {
			throw new ConflictException('User email is already verified');
		}

		const token = crypto.randomBytes(3).toString('hex').toUpperCase();
		const context = {
			username: user.username,
			token,
		};

		await this.redis.set(TokenType.VERIFICATION, user.email, token, 15 * 60);

		await this.mailService.sendMail(
			user.email,
			'Account verification',
			'verification',
			context
		);
	}

	async sendPasswordResetEmail(email: string): Promise<void> {
		const { username } = await this.prisma.user.findUniqueOrThrow({
			where: {
				email,
			},
		});
		const token = crypto.randomBytes(3).toString('hex').toUpperCase();
		const context = {
			username,
			token,
		};

		await this.redis.set(TokenType.RESET_PASSWORD, email, token, 15 * 60);

		await this.mailService.sendMail(
			email,
			'Password reset',
			'password-reset',
			context
		);
	}

	private async updateRefreshToken(
		user: User,
		token: string,
		res: Response
	): Promise<void> {
		const exp = this.configService.get<number>('JWT_REFRESH_EXPIRATION');

		await this.redis.set(
			TokenType.REFRESH,
			user.id,
			await bcrypt.hash(token, 10),
			exp
		);

		res.cookie('refresh_token', token, {
			httpOnly: true,
			sameSite: 'strict',
			secure: this.configService.get('NODE_ENV') === 'production',
			maxAge: exp * 1000,
		});
	}

	private async generateTokens(payload: JwtPayload): Promise<[string, string]> {
		return Promise.all([
			this.jwtService.signAsync(payload, {
				secret: this.configService.get('JWT_ACCESS_SECRET'),
				expiresIn: this.configService.get<number>('JWT_ACCESS_EXPIRATION'),
			}),
			this.jwtService.signAsync(payload, {
				secret: this.configService.get('JWT_ACCESS_SECRET'),
				expiresIn: this.configService.get<number>('JWT_ACCESS_EXPIRATION'),
			}),
		]);
	}
}
