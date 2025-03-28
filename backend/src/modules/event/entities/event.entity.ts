import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@prisma/client';
import { EventMemberEntity } from './event-member.entity';
import { CalendarMemberEntity } from '@modules/calendar/entities/calendar-member.entity';

export class EventEntity {
	@ApiProperty({
		type: Number,
		example: 1,
	})
	id: number;

	@ApiProperty({
		type: Number,
		example: 1,
	})
	calendarId: number;

	@ApiProperty({
		type: String,
		example: 'Onboarding meeting',
	})
	name: string;

	@ApiProperty({
		type: String,
		example: 'Meeting to introduce new employees to company policies.',
	})
	description: string | null;

	@ApiProperty({
		type: Number,
		example: 'Identifier of calendar',
	})
	calendarId: number;

	@ApiProperty({
		type: String,
		example: '#FFDE59',
	})
	color: string;

	@ApiProperty({
		type: Boolean,
		example: true,
	})
	allDay?: boolean | null;

	@ApiProperty({
		type: String,
		enum: EventType,
		example: EventType.MEETING,
	})
	type: EventType;

	@ApiProperty({
		type: Date,
		format: 'date-time',
		example: '2025-03-09T16:30:00.000Z',
	})
	startDate: Date;

	@ApiProperty({
		type: Date,
		format: 'date-time',
		example: '2025-03-09T17:45:00.000Z',
	})
	endDate: Date | null;

	members?: EventMemberEntity[];
	members?: EventMemberEntity[];

	calendar?: {
		users: CalendarMemberEntity[];
	};

	constructor(partial: Partial<EventEntity>) {
		Object.assign(this, partial);

		if (partial?.members?.length) {
			this.members = partial.members.map((user) => new EventMemberEntity(user));
		}
	}
}
