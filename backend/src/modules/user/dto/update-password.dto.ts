import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
	@ApiProperty({
		type: String,
		format: 'password',
		example: 'hardpassword',
	})
	@IsString()
	@IsNotEmpty()
	currentPassword: string;

	@ApiProperty({
		type: String,
		example: 'newhardpassword',
	})
	@IsString()
	@IsNotEmpty()
	newPassword: string;
}
