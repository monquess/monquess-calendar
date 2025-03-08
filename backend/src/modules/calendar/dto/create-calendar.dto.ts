import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCalendarDto {
	@ApiProperty({
		example: 'My Calendar',
		type: String,
	})
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({
		example: 'This calendar is for...',
		type: String,
	})
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({
		example: '#f542ec',
		type: String,
	})
	@IsNotEmpty()
	@IsString()
	color: string;
}
