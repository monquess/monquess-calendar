import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { FilteringOptionsDto } from './dto/filtering-options.dto';

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll({ username, email }: FilteringOptionsDto): Promise<User[]> {
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

	async findById(id: number) {
		return this.prisma.user.findUniqueOrThrow({ where: { id } });
	}
}
