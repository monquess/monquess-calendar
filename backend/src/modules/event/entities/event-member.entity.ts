import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus, Role } from '@prisma/client';

export class EventMemberEntity {
	@ApiProperty({
		type: Number,
		example: 1,
	})
	userId: number;

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
		example: '2025-03-09T16:17:53.019Z',
	})
	createdAt: Date;

	constructor(partial: Partial<EventMemberEntity>) {
		Object.assign(this, partial);
	}
}
