import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@prisma/client';
import {
	IsEnum,
	IsHexColor,
	IsISO8601,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreateEventDto {
	@ApiProperty({
		type: String,
		example: 'Onboarding meeting',
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		type: String,
		required: false,
		example: 'Meeting to introduce new employees to company policies.',
	})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	description?: string;

	@ApiProperty({
		type: String,
		pattern: '^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$',
		example: '#FFDE59',
	})
	@IsHexColor()
	color: string;

	@ApiProperty({
		type: String,
		enum: EventType,
		example: EventType.MEETING,
	})
	@IsEnum(EventType)
	type: EventType;

	@ApiProperty({
		type: String,
		format: 'date-time',
		example: '2025-03-09T16:30:00.000Z',
	})
	@IsISO8601({
		strict: true,
	})
	startDate: string;

	@ApiProperty({
		type: String,
		format: 'date-time',
		example: '2025-03-09T17:45:00.000Z',
	})
	@IsISO8601({
		strict: true,
	})
	@IsOptional()
	endDate?: string;
}
