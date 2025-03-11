import { PrismaClient } from '@prisma/client';
import Seeder from './abstract.seeder';
import { EventFactory } from '../factories/event.factory';

export class EventSeeder extends Seeder {
	constructor(prisma: PrismaClient) {
		super(prisma);
	}

	async run(): Promise<void> {
		await this.prisma.event.deleteMany();
		const calendars = await this.prisma.calendar.findMany();

		const eventFactory = new EventFactory(calendars);

		await this.prisma.event.createMany({
			data: eventFactory.data,
		});
	}
}
