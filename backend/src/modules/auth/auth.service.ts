import {
	ConflictException,
	Injectable,
	UnauthorizedException,
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
import { RedisPrefix } from '@modules/redis/redis.constants';
import { EnvironmentVariables } from '@config/env/environment-variables.config';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly redis: RedisService,
		private readonly configService: ConfigService<EnvironmentVariables, true>,
		private readonly jwtService: JwtService
	) {}

	async register(dto: RegisterDto): Promise<void> {
		const candidate = await this.prisma.user.findFirst({
			where: {
				OR: [{ email: dto.email }, { username: dto.username }],
			},
		});

		if (candidate) {
			throw new ConflictException('User already exists');
		}

		await this.prisma.user.create({
			data: {
				...dto,
				password: await bcrypt.hash(dto.password, 10),
				avatar: this.configService.get<string>('DEFAULT_AVATAR_PATH'),
			},
		});
	}

	async login(user: User, res: Response): Promise<AuthResponseDto> {
		const [accessToken, refreshToken] = await this.generateTokens({
			sub: user.id,
			email: user.email,
		});
		const cookieExpiration = this.configService.get<number>(
			'JWT_REFRESH_EXPIRATION'
		);

		await this.redis.saveToken(
			user.id,
			await bcrypt.hash(refreshToken, 10),
			RedisPrefix.REFRESH_TOKEN
		);

		res.cookie('refresh-token', refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
			secure: this.configService.get('NODE_ENV') === 'production',
			maxAge: cookieExpiration * 1000,
		});

		return {
			user,
			accessToken,
		};
	}

	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			throw new UnauthorizedException(
				`User with email '${email}' does not exists`
			);
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			throw new UnauthorizedException('Invalid password');
		}

		return user;
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
