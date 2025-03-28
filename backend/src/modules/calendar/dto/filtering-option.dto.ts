import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class FilteringOptionsDto {
	@ApiProperty({
		type: String,
		enum: InvitationStatus,
		example: InvitationStatus.INVITED,
	})
	@IsEnum(InvitationStatus)
	@IsOptional()
	status?: InvitationStatus;
}
