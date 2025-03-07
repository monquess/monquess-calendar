import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendEmailDto {
	@ApiProperty({
		type: String,
		format: 'email',
		example: 'johndoe@example.com',
	})
	@IsEmail()
	email: string;
}
