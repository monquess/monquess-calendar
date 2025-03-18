export interface IUserMember {
	userId: number
	calendarId: number
	role: string
	status: string
	createAt: string
}

export interface ICalendar {
	id: number
	isPersonal: boolean
	name: string
	description?: string
	color: string
	createdAt: string
	users: IUserMember[]
}
