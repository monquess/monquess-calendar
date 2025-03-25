import { EventType } from '../enum/event-type.enum'
import { MemberRole } from '../enum/member-role.enum'

export interface IEventMember {
	userId: number
	role: MemberRole
	status: string
	createdAt: Date
}

export interface IEvent {
	id: string
	name: string
	description: string | null
	calendarId: number
	color: string
	type: EventType
	startDate: string
	endDate: string | null

	members: IEventMember[]
}
