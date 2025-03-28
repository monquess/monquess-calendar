import { InvitationStatus, MemberRole } from '../enum'

export interface ICalendarMember {
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
