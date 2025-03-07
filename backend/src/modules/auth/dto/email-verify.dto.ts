import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class EmailVerifyDto {
	@ApiProperty({
		type: String,
		example: 'johndoe@example.com',
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		type: String,
		example: 'c1aa5as',
	})
	@IsString({
		message: 'Invalid token',
	})
	@Length(6, 6, {
		message: 'Invalid token',
	})
	token: string;
}
