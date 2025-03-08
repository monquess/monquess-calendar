import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class EmailVerifyDto {
	@ApiProperty({
		type: String,
		format: 'email',
		example: 'johndoe@example.com',
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		type: String,
		minLength: 6,
		maxLength: 6,
		example: 'c1aa5as',
	})
	@Length(6, 6, {
		message: 'Invalid token',
	})
	token: string;
}
