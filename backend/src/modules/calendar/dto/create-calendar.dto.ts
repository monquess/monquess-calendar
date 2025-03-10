import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCalendarDto {
	@ApiProperty({
		type: String,
		example: 'My Calendar',
	})
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({
		type: String,
		required: false,
		example: 'This calendar is for...',
	})
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({
		type: String,
		example: '#f542ec',
	})
	@IsNotEmpty()
	@IsString()
	color: string;
}
