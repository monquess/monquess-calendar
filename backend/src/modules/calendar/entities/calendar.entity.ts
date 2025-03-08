import { ApiProperty } from '@nestjs/swagger';
import { CalendarMemberEntity } from './calendar-member.entity';

export class CalendarEntity {
	@ApiProperty({
		example: 1,
		type: Number,
	})
	id: number;

	@ApiProperty({
		example: 1,
		type: Boolean,
	})
	isPersonal: boolean;

	@ApiProperty({
		example: 'My Calendar',
		type: String,
	})
	name: string;

	@ApiProperty({
		example: 'This calendar is for...',
		type: String,
	})
	description: string | null;

	@ApiProperty({
		example: '#f542ec',
		type: String,
	})
	color: string;

	@ApiProperty({
		example: '2024-11-21 16:49:11.733',
		type: String,
	})
	createdAt: Date;

	users?: CalendarMemberEntity[];

	constructor(partial: Partial<CalendarEntity>) {
		Object.assign(this, partial);

		if (partial?.users?.length) {
			this.users = partial.users.map((u) => new CalendarMemberEntity(u));
		}
	}
}
