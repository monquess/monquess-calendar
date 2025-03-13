import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class FilteringOptionsDto {
	@ApiProperty({
		type: String,
		enum: EventType,
		example: EventType.TASK,
	})
	@IsEnum(EventType)
	@IsOptional()
	type?: EventType;
}
