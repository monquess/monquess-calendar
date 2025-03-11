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
		example: '/avatars/default.png',
		type: String,
	})
	avatar: string;

	@ApiProperty({
		example: '2025-03-09T16:17:53.019Z',
		type: String,
	})
	createdAt: Date;

	@ApiProperty({
		example: '2025-03-09T16:18:14.889Z',
		type: String,
	})
	updatedAt: Date;

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial);
	}
}
