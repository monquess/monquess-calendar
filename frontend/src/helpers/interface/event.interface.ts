import { EventType, InvitationStatus, MemberRole } from '../enum'

export interface IEventMember {
	userId: number
	role: MemberRole
	status: InvitationStatus
	createdAt: Date
	user: {
		username: string
		email: string
		avatar: string
	}
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
	allDay: boolean

	members: IEventMember[]
}
