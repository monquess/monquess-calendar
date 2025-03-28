import { UserEntity } from '@modules/user/entities/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { InvitationStatus, Role } from '@prisma/client';

class CalendarMemberUserEntity extends PickType(UserEntity, [
	'username',
	'email',
	'avatar',
] as const) {}

export class CalendarMemberEntity {
	@ApiProperty({
		type: Number,
		example: 1,
	})
	userId: number;

	@ApiProperty({ type: () => CalendarMemberUserEntity })
	user?: CalendarMemberUserEntity;

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

	constructor(partial: Partial<CalendarMemberEntity>) {
		Object.assign(this, partial);
	}
}
