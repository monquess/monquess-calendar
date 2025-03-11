import Factory from './abstract.factory';
import { faker } from '@faker-js/faker';
import { Event, User, Calendar, EventType } from '@prisma/client';

export class EventFactory extends Factory<Event> {
	private users: User[];
	private calendars: Calendar[];

	constructor(calendars: Calendar[]) {
		super(calendars.length);
		this.calendars = calendars;
		this.create();
	}

	create(): void {
		for (let i = 0; i < this._count; i++) {
			const calendar = this.calendars[i];

			const date = faker.date.anytime();
			const type = faker.helpers.enumValue(EventType);
			this._data.push({
				name: faker.word.noun(),
				description: faker.helpers.maybe(() => faker.word.words(5), {
					probability: 0.9,
				}),
				color: faker.color.rgb(),
				type,
				calendarId: calendar.id,
				startDate: date,
				endDate: faker.helpers.maybe(() => faker.date.soon({ refDate: date }), {
					probability: Number(type === EventType.MEETING),
				}),
			} as Event);
		}
	}
}
