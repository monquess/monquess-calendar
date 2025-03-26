import { EventType, MemberRole, InvitationStatus } from '../enum'

export interface IEventMember {
	userId: number
	role: MemberRole
	status: InvitationStatus
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
