import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type CalendarVisibilityState = {
	calendarVisibility: Record<number, boolean>
	toggleCalendar: (calendarId: number) => void
	setCalendars: (calendarIds: number[]) => void
	deleteCalendar: (calendarId: number) => void
}

const useCalendarStore = create<CalendarVisibilityState>()(
	persist(
		(set) => ({
			calendarVisibility: {},

			toggleCalendar: (calendarId) =>
				set((state) => ({
					calendarVisibility: {
						...state.calendarVisibility,
						[calendarId]: !state.calendarVisibility[calendarId],
					},
				})),

			setCalendars: (calendarIds) =>
				set({
					calendarVisibility: Object.fromEntries(
						calendarIds.map((id) => [id, true])
					),
				}),

			deleteCalendar: (calendarId) =>
				set((state) => {
					const newVisibility = { ...state.calendarVisibility }
					delete newVisibility[calendarId]

					return {
						calendarVisibility: newVisibility,
					}
				}),
		}),
		{
			name: 'calendar-visibility-storage',
			storage: createJSONStorage(() => localStorage),
		}
	)
)

export default useCalendarStore
