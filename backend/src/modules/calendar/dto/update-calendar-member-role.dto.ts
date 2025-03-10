import { IsEnum } from 'class-validator';
import { AllowedRoles } from '../constants/calendar.constants';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCalendarMemberRoleDto {
	@ApiProperty({
		type: String,
		enum: AllowedRoles,
		example: AllowedRoles.VIEWER,
	})
	@IsEnum(AllowedRoles)
	role: AllowedRoles;
}
