import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventType } from '@prisma/client';

@ValidatorConstraint({ async: false })
export class EndDateValidator implements ValidatorConstraintInterface {
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
