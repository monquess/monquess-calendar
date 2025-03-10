import { ApiProperty } from '@nestjs/swagger';
import { CalendarMemberEntity } from './calendar-member.entity';

export class CalendarEntity {
	@ApiProperty({
		type: Number,
		example: 1,
	})
	id: number;

	@ApiProperty({
		type: Boolean,
		example: true,
	})
	isPersonal: boolean;

	@ApiProperty({
		type: String,
		example: 'My Calendar',
	})
	name: string;

	@ApiProperty({
		type: String,
		example: 'This calendar is for...',
	})
	description: string | null;

	@ApiProperty({
		type: String,
		example: '#f542ec',
	})
	color: string;

	@ApiProperty({
		type: String,
		example: new Date().toISOString(),
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
