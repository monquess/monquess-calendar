import { CalendarType } from '@prisma/client';
import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { CreateCalendarDto } from '../dto/create-calendar.dto';
import { COUNTRIES } from '@common/constants/country-codes.constant';

@ValidatorConstraint({ async: false })
export class RegionValidator implements ValidatorConstraintInterface {
	validate(region: string | undefined, args: ValidationArguments) {
		const object = args.object as CreateCalendarDto;

		if (object.type === CalendarType.HOLIDAYS) {
			return !!region && Object.keys(COUNTRIES).includes(region);
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
