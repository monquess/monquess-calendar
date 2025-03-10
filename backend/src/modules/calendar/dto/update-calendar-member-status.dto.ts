import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateCalendarMemberStatusDto {
	@ApiProperty({
		example: 'VIEWER',
		type: String,
		enum: InvitationStatus,
	})
	@IsEnum(InvitationStatus)
	status: InvitationStatus;
}
