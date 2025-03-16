import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface Calendar {
	id: number
	isPersonal: boolean
	name: string
	description?: string
	color: string
	createdAt: string
}

type CalendarState = {
	calendars: Record<number, Calendar>
	calendarVisibility: Record<number, boolean>
	toggleCalendar: (calendarId: number) => void
	setCalendars: (calendars: Calendar[]) => void
	addCalendar: (calendar: Calendar) => void
	updateCalendar: (calendarId: number, updatedData: Partial<Calendar>) => void
	deleteCalendar: (calendarId: number) => void
}

const useCalendarStore = create<CalendarState>()(
	persist(
		(set) => ({
			calendars: {},
			calendarVisibility: {},
			toggleCalendar: (calendarId) =>
				set((state) => ({
					calendarVisibility: {
						...state.calendarVisibility,
						[calendarId]: !state.calendarVisibility[calendarId],
					},
				})),
			setCalendars: (calendars) =>
				set({
					calendars: Object.fromEntries(calendars.map((cal) => [cal.id, cal])),
					calendarVisibility: Object.fromEntries(
						calendars.map((cal) => [cal.id, true])
					),
				}),
			addCalendar: (calendar) =>
				set((state) => ({
					calendars: {
						...state.calendars,
						[calendar.id]: calendar,
					},
					calendarVisibility: {
						...state.calendarVisibility,
						[calendar.id]: true,
					},
				})),
			updateCalendar: (calendarId, updatedData) =>
				set((state) => ({
					calendars: {
						...state.calendars,
						[calendarId]: {
							...state.calendars[calendarId],
							...updatedData,
						},
					},
				})),
			deleteCalendar: (calendarId) =>
				set((state) => {
					const newCalendars = { ...state.calendars }
					const newVisibility = { ...state.calendarVisibility }
					delete newCalendars[calendarId]
					delete newVisibility[calendarId]

					return {
						calendars: newCalendars,
						calendarVisibility: newVisibility,
					}
				}),
		}),
		{
			name: 'calendar-storage',
			storage: createJSONStorage(() => localStorage),
		} as any
	)
)

export default useCalendarStore
