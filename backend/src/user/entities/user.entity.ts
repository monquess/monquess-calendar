import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity {
	@ApiProperty({
		example: 1,
		type: Number,
	})
	id: number;

	@ApiProperty({
		example: 'johndoe123',
		type: String,
	})
	username: string;

	@ApiProperty({
		example: 'johndoe123@gmail.com',
		type: String,
	})
	email: string;

	@Exclude()
	password: string;

	@ApiProperty({
		example: true,
		type: Boolean,
	})
	verified: boolean;

	@ApiProperty({
		example: '2024-11-21 16:49:11.733',
		type: String,
	})
	createdAt: Date;

	@ApiProperty({
		example: '2024-11-21 16:49:11.733',
		type: String,
	})
	updatedAt: Date;

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial);
	}
}
