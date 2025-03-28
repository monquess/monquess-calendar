import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';

export class EmailVerifyDto {
	@ApiProperty({
		type: String,
		format: 'email',
		example: 'johndoe@example.com',
	})
	@IsEmail()
	@Transform(({ value }: { value: string }) => value.toLowerCase())
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
