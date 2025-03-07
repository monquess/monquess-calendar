import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({
		type: String,
		example: 'johndoe123',
	})
	@IsNotEmpty()
	username: string;

	@ApiProperty({
		type: String,
		format: 'email',
		example: 'johndoe123@gmail.com',
	})
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({
		type: String,
		format: 'password',
		example: 'hardpassword',
	})
	@IsNotEmpty()
	password: string;
}
