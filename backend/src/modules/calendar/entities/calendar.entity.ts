import { ApiProperty } from '@nestjs/swagger';
import { CalendarMemberEntity } from './calendar-member.entity';
import { CalendarType } from '@prisma/client';

export class CalendarEntity {
	@ApiProperty({
		type: Number,
		example: 1,
	})
	id: number;

	@ApiProperty({
		type: String,
		enum: CalendarType,
		example: CalendarType.SHARED,
	})
	type: CalendarType;

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
		example: 'US',
	})
	region: string | null;

	@ApiProperty({
		type: String,
		example: '2025-03-09T16:17:53.019Z',
	})
	createdAt: Date;

	users?: CalendarMemberEntity[];

	constructor(partial: Partial<CalendarEntity>) {
		Object.assign(this, partial);

		if (partial?.users?.length) {
			this.users = partial.users.map((user) => new CalendarMemberEntity(user));
		}
	}
}
