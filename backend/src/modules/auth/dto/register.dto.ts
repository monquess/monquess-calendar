import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
	@Transform(({ value }: { value: string }) => value.toLowerCase())
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
