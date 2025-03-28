import { ApiProperty } from '@nestjs/swagger';
import {
	IsEnum,
	IsHexColor,
	IsNotEmpty,
	IsOptional,
	IsString,
	Validate,
	ValidateIf,
} from 'class-validator';
import { AllowedTypes } from '../constants/calendar.constants';
import { RegionValidator } from '../validators/region.validator';
import { CalendarType } from '@prisma/client';

export class CreateCalendarDto {
	@ApiProperty({
		type: String,
		example: 'My Calendar',
	})
	@IsNotEmpty()
	@IsString()
	@ValidateIf((obj: CreateCalendarDto) => obj.type !== CalendarType.HOLIDAYS)
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
		pattern: '^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$',
		example: '#f542ec',
	})
	@IsHexColor()
	color: string;

	@ApiProperty({
		type: String,
		enum: AllowedTypes,
		required: false,
		default: AllowedTypes.SHARED,
		example: AllowedTypes.HOLIDAYS,
	})
	@IsEnum(AllowedTypes)
	type?: AllowedTypes;

	@ApiProperty({
		type: String,
		required: false,
		example: 'US',
	})
	@Validate(RegionValidator)
	region?: string;
}
