import { IsEnum, IsOptional } from 'class-validator';
import { AllowedRoles } from '../constants/calendar.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCalendarMemberDto {
	@ApiProperty({
		example: 'VIEWER',
		type: String,
		enum: AllowedRoles,
	})
	@IsOptional()
	@IsEnum(AllowedRoles)
	role?: AllowedRoles;
}
