import { AllowedRoles } from '@modules/calendar/constants/calendar.constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class CreateEventMemberDto {
	@ApiProperty({
		type: String,
		enum: AllowedRoles,
		example: 'VIEWER',
	})
	@IsOptional()
	@IsEnum(AllowedRoles)
	role?: AllowedRoles;
}
