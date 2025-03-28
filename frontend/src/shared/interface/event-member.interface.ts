import { InvitationStatus, MemberRole } from '../enum'

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
