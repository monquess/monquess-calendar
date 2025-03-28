import { EventInput } from '@fullcalendar/core'
import { IEvent } from '../interface/event.interface'

export const mapEventToInput = (event: IEvent): EventInput => {
	return {
		id: event.id.toString(),
		title: event.name,
		start: new Date(event.startDate),
		end: event.endDate ? new Date(event.endDate) : undefined,
		backgroundColor: event.color,
		borderColor: event.color,
		allDay: event.allDay,
		extendedProps: {
			calendarId: event.calendarId,
			description: event.description,
			type: event.type,
			members: event.members,
		},
	}
}
