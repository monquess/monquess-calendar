import { ApiProperty } from '@nestjs/swagger';
import {
	IsEnum,
	IsHexColor,
	IsNotEmpty,
	IsOptional,
	IsString,
	Validate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { AllowedTypes } from '../constants/calendar.constants';
import { CalendarType } from '@prisma/client';
import { GOOGLE_CALENDARS } from '@modules/event/country-codes.constant';

@ValidatorConstraint({ async: false })
class RegionValidator implements ValidatorConstraintInterface {
	validate(region: string | undefined, args: ValidationArguments) {
		const object = args.object as CreateCalendarDto;

		if (object.type === CalendarType.HOLIDAYS) {
			return !!region && Object.keys(GOOGLE_CALENDARS).includes(region);
		}

		return region !== undefined;
	}

	defaultMessage(args: ValidationArguments) {
		const object = args.object as CreateCalendarDto;
		if (object.type === CalendarType.HOLIDAYS) {
			return `Region is must be valid ISO 3166-1 code`;
		}
		return `Region is not allowed for calendars of type ${object.type}`;
	}
}

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
