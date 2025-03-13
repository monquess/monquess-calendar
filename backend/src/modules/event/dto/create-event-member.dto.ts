import { AllowedRoles } from '@modules/calendar/constants/calendar.constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class CreateEventMemberDto {
	@ApiProperty({
		example: 'VIEWER',
		type: String,
		enum: AllowedRoles,
	})
	@IsOptional()
	@IsEnum(AllowedRoles)
	role?: AllowedRoles;
}
