import { CalendarType, MemberRole, InvitationStatus } from '../enum'

export interface IUserMember {
	userId: number
	calendarId: number
	role: MemberRole
	status: InvitationStatus
	user: {
		username: string
		email: string
		avatar: string
	}
	createdAt: string
}

export interface ICalendar {
	id: number
	name: string
	description?: string
	type: CalendarType
	color: string
	createdAt: string

	users: IUserMember[]
}
