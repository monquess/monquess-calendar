import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { FilteringOptionsDto } from './dto/filtering-options.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { S3Service } from '@s3/s3.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly s3Service: S3Service,
		private readonly configService: ConfigService
	) {}

	async findAll({
		username,
		email,
	}: FilteringOptionsDto): Promise<UserEntity[]> {
		return this.prisma.user.findMany({
			where: {
				AND: [
					{
						username: {
							contains: username,
							mode: 'insensitive',
						},
						email: {
							contains: email,
							mode: 'insensitive',
						},
					},
				],
			},
		});
	}

	async findById(id: number): Promise<UserEntity> {
		return this.prisma.user.findUniqueOrThrow({ where: { id } });
	}

	async create(createUserDto: CreateUserDto) {
		return this.prisma.user.create({
			data: {
				...createUserDto,
				avatar: this.configService.get<string>('DEFAULT_AVATAR_PATH')!,
				password: await bcrypt.hash(createUserDto.password, 12),
			},
		});
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
		return this.prisma.user.update({
			where: { id },
			data: updateUserDto,
		});
	}

	async updatePassword(
		id: number,
		updatePasswordDto: UpdatePasswordDto
	): Promise<UserEntity> {
		const user = await this.findById(id);

		const passwordMatch = await bcrypt.compare(
			updatePasswordDto.currentPassword,
			user.password
		);

		if (!passwordMatch) {
			throw new BadRequestException('Current password is incorrect');
		}

		return this.prisma.user.update({
			where: { id },
			data: {
				password: await bcrypt.hash(updatePasswordDto.newPassword, 12),
			},
		});
	}

	async updateAvatar(
		id: number,
		avatar: Express.Multer.File
	): Promise<UserEntity> {
		const defaultAvatar = this.configService.get<string>('DEFAULT_AVATAR_PATH');
		const user = await this.findById(id);

		if (user.avatar !== defaultAvatar) {
			await this.s3Service.deleteFile(user.avatar);
		}

		const avatarData = await this.s3Service.uploadFile('avatars', avatar);

		return this.prisma.user.update({
			where: { id },
			data: { avatar: avatarData.url },
		});
	}

	async remove(id: number): Promise<void> {
		await this.prisma.user.delete({
			where: { id },
		});
	}
}
