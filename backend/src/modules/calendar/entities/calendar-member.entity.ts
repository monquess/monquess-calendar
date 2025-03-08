import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus, Role } from '@prisma/client';

export class CalendarMemberEntity {
	@ApiProperty({
		example: 1,
		type: Number,
	})
	userId: number;

	@ApiProperty({
		example: 1,
		type: Number,
	})
	calendarId: number;

	@ApiProperty({
		example: 'VIEWER',
		type: String,
		enum: Role,
	})
	role: Role;

	@ApiProperty({
		example: 'ACCEPTED',
		type: String,
		enum: InvitationStatus,
	})
	status: InvitationStatus;

	@ApiProperty({
		example: '2024-11-21 16:49:11.733',
		type: String,
	})
	createdAt: Date;

	constructor(partial: Partial<CalendarMemberEntity>) {
		Object.assign(this, partial);
	}
}
