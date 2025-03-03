import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({
		example: 'johndoe123',
		type: String,
	})
	@IsNotEmpty()
	username: string;

	@ApiProperty({
		example: 'johndoe123@gmail.com',
		type: String,
	})
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({
		example: 'hardpassword',
		type: String,
	})
	@IsNotEmpty()
	password: string;
}
