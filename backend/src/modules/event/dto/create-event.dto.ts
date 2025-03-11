import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
	IsDate,
	IsEnum,
	IsHexColor,
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
		type: Date,
		format: 'date-time',
		example: '2025-03-09T16:30:00.000Z',
	})
	@Type(() => Date)
	@IsDate()
	startDate: Date;

	@ApiProperty({
		type: Date,
		format: 'date-time',
		example: '2025-03-09T17:45:00.000Z',
	})
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	endDate?: Date;
}
