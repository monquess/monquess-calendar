import { faker } from '@faker-js/faker';
import { Calendar, CalendarType, User } from '@prisma/client';
import Factory from './abstract.factory';

class CalendarFactory extends Factory<Calendar> {
	private users: User[];

	constructor(users: User[]) {
		super(users.length);
		this.users = users;
		this.create();
	}

	create() {
		for (let i = 0; i < this._count; i++) {
			const user = this.users[i];

			this._data.push({
				name: user.username,
				type: CalendarType.PERSONAL,
				color: faker.color.rgb(),
			} as Calendar);
		}
	}
}

export default CalendarFactory;
