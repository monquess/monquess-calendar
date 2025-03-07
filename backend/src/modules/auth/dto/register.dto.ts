import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterDto {
	@ApiProperty({
		type: String,
		example: 'johndoe',
	})
	@IsString()
	@IsNotEmpty()
	username: string;

	@ApiProperty({
		type: String,
		format: 'email',
		example: 'johndoe@example.com',
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		type: String,
		format: 'password',
		example: 'securepassword',
	})
	@IsString()
	@IsNotEmpty()
	password: string;
}
