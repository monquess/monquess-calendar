import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
		format: 'hex',
		example: '#f542ec',
	})
	@IsHexColor()
	color: string;
}
