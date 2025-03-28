import { ApiProperty } from '@nestjs/swagger';
import { Provider } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({
		type: String,
		example: 'johndoe123',
	})
	@IsNotEmpty()
	@Expose()
	username: string;

	@ApiProperty({
		type: String,
		format: 'email',
		example: 'johndoe123@gmail.com',
	})
	@IsNotEmpty()
	@IsEmail()
	@Expose()
	email: string;

	@ApiProperty({
		type: String,
		format: 'password',
		example: 'hardpassword',
	})
	@IsNotEmpty()
	@Expose()
	password: string | null;

	@ApiProperty({
		type: String,
		enum: Provider,
		example: Provider.LOCAL,
		default: Provider.LOCAL,
	})
	@IsEnum(Provider)
	@Expose()
	provider?: Provider = Provider.LOCAL;

	@ApiProperty({
		type: Boolean,
		example: true,
		required: false,
		default: false,
	})
	@Expose()
	verified?: boolean = false;
}
