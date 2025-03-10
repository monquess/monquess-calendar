import { PrismaClient } from '@prisma/client';
import Seeder from './abstract.seeder';
import CalendarFactory from '../factories/calendar.factory';

class CalendarSeeder extends Seeder {
	constructor(prisma: PrismaClient) {
		super(prisma);
	}

	async run(): Promise<void> {
		await this.prisma.calendar.deleteMany();

		const users = await this.prisma.user.findMany();

		const calendarFactory = new CalendarFactory(users);

		await this.prisma.calendar.createMany({
			data: calendarFactory.data,
		});
	}
}

export default CalendarSeeder;
