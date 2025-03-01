import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
	@ApiProperty({
		example: 'hardpassword',
		type: String,
	})
	@IsString()
	@IsNotEmpty()
	currentPassword: string;

	@ApiProperty({
		example: 'newhardpassword',
		type: String,
	})
	@IsString()
	@IsNotEmpty()
	newPassword: string;
}
