import { EventInput } from '@fullcalendar/core'
import { IEvent } from './interface/event.interface'
import { EventType } from './enum'

export const mapEvent = (event: IEvent): EventInput => {
	return {
		id: event.id.toString(),
		title: event.name,
		start: new Date(event.startDate),
		end: event.endDate ? new Date(event.endDate) : undefined,
		backgroundColor: event.color,
		borderColor: event.color,
		allDay: event.type === EventType.HOLIDAY,
		extendedProps: {
			calendarId: event.calendarId,
			description: event.description,
			type: event.type,
			members: event.members,
		},
	}
}
