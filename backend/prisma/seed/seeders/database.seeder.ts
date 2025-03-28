import { PrismaClient } from '@prisma/client';
import Seeder from './abstract.seeder';
import UserSeeder from './user.seeder';
import CalendarSeeder from './calendar.seeder';
import { EventSeeder } from './event.seeder';

class DatabaseSeeder extends Seeder {
	private seeders: Seeder[];

	constructor(prisma: PrismaClient) {
		super(prisma);
		this.seeders = [
			new UserSeeder(this.prisma),
			new CalendarSeeder(this.prisma),
			new EventSeeder(this.prisma),
		];
	}

	async run(): Promise<void> {
		for (const seeder of this.seeders) {
			await seeder.run();
		}
	}
}

export default DatabaseSeeder;
