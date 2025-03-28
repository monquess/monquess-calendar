import { PickType } from '@nestjs/swagger';
import { CreateEventMemberDto } from './create-event-member.dto';

export class UpdateEventMemberRoleDto extends PickType(CreateEventMemberDto, [
	'role',
] as const) {}
