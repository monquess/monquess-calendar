import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus, Role } from '@prisma/client';

export class CalendarMemberEntity {
	@ApiProperty({
		type: Number,
		example: 1,
	})
	userId: number;

	@ApiProperty({
		type: Number,
		example: 1,
	})
	calendarId: number;

	@ApiProperty({
		type: String,
		enum: Role,
		example: Role.VIEWER,
	})
	role: Role;

	@ApiProperty({
		type: String,
		enum: InvitationStatus,
		example: InvitationStatus.ACCEPTED,
	})
	status: InvitationStatus;

	@ApiProperty({
		type: String,
		example: new Date().toISOString(),
	})
	createdAt: Date;

	constructor(partial: Partial<CalendarMemberEntity>) {
		Object.assign(this, partial);
	}
}
