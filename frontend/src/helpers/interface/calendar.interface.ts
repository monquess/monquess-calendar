import { CalendarType } from '../enum/calendar-type.enum'
import { MemberRole } from '../enum/member-role.enum'

export interface IUserMember {
	userId: number
	calendarId: number
	role: MemberRole
	status: string
	createdAt: string
	user: {
		username: string
		email: string
		avatar: string
	}
}

export interface ICalendar {
	id: number
	name: string
	description?: string
	isPersonal: boolean
	type: CalendarType
	color: string
	createdAt: string

	users: IUserMember[]
}
