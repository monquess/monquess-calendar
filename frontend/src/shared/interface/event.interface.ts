import { EventType } from '../enum'
import { IEventMember } from './event-member.interface'

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
