import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@prisma/client';
import { IsEnum, IsISO8601, IsOptional } from 'class-validator';

export class FilteringOptionsDto {
	@ApiProperty({
		type: String,
		enum: EventType,
		example: EventType.TASK,
	})
	@IsEnum(EventType)
	@IsOptional()
	type?: EventType;

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
	endDate: string;
}
