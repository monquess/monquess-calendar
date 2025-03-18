import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@prisma/client';
import {
	IsEnum,
	IsHexColor,
	IsISO8601,
	IsNotEmpty,
	IsOptional,
	IsString,
	Validate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class EndDateValidator implements ValidatorConstraintInterface {
	validate(date: string | undefined, args: ValidationArguments) {
		const object = args.object as CreateEventDto;

		if (object.type === EventType.REMINDER) {
			return date === undefined;
		}

		return date !== undefined && new Date(object.startDate) < new Date(date);
	}

	defaultMessage(args: ValidationArguments) {
		const object = args.object as CreateEventDto;
		if (object.type === EventType.REMINDER) {
			return `End date should not be provided for reminder event`;
		}
		return `End date must be greater than start date`;
	}
}

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
	@Validate(EndDateValidator)
	@IsOptional()
	endDate?: string;
}
