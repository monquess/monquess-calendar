import { create } from 'zustand'
import { ICalendar } from '../interface/calendar.interface'

type CalendarVisibilityState = {
	calendars: Record<number, ICalendar & { visible: boolean }>
	toggleCalendar: (calendarId: number) => void
	setCalendars: (calendars: ICalendar[]) => void
	addCalendar: (calendar: ICalendar) => void
	updateCalendar: (calendar: ICalendar) => void
	deleteCalendar: (calendarId: number) => void
}

const useCalendarStore = create<CalendarVisibilityState>()((set) => ({
	calendars: {},

	toggleCalendar: (calendarId) =>
		set((state) => ({
			calendars: {
				...state.calendars,
				[calendarId]: {
					...state.calendars[calendarId],
					visible: !state.calendars[calendarId].visible,
				},
			},
		})),

	setCalendars: (calendars) =>
		set({
			calendars: Object.fromEntries(
				calendars.map((calendar) => [
					calendar.id,
					{ ...calendar, visible: true },
				])
			),
		}),

	addCalendar: (calendar) =>
		set((state) => ({
			calendars: {
				...state.calendars,
				[calendar.id]: {
					...calendar,
					visible: true,
				},
			},
		})),

	updateCalendar: (calendar) =>
		set((state) => {
			const old = state.calendars[calendar.id]
			return {
				calendars: {
					...state.calendars,
					[calendar.id]: {
						...old,
						...calendar,
					},
				},
			}
		}),

	deleteCalendar: (calendarId) =>
		set((state) => {
			const newVisibility = { ...state.calendars }
			delete newVisibility[calendarId]

			return {
				calendars: newVisibility,
			}
		}),
}))

export default useCalendarStore
