import { IsEnum } from 'class-validator';
import { AllowedRoles } from '../constants/calendar.constants';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCalendarMemberRoleDto {
	@ApiProperty({
		example: 'VIEWER',
		type: String,
		enum: AllowedRoles,
	})
	@IsEnum(AllowedRoles)
	role: AllowedRoles;
}
