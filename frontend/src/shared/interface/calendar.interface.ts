import { CalendarType } from '../enum'
import { ICalendarMember } from './calendar-member.interface'

export interface ICalendar {
	id: number
	name: string
	description?: string
	type: CalendarType
	color: string
	createdAt: string

	users: ICalendarMember[]
}
