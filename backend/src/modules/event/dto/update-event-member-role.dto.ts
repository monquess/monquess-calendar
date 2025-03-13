import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateEventMemberStatusDto {
	@ApiProperty({
		type: String,
		enum: InvitationStatus,
		example: InvitationStatus.INVITED,
	})
	@IsEnum(InvitationStatus)
	status: InvitationStatus;
}
