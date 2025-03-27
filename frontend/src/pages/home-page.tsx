import React, { useEffect, useRef, useState } from 'react'
import { Flex, Stack } from '@mantine/core'

import {
	DateSelectArg,
	EventInput,
	EventSourceFuncArg,
} from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

import { apiClient } from '@/shared/api/axios'
import { EventType } from '@/shared/enum'
import { IEvent } from '@/shared/interface'
import { mapEvent } from '@/shared/map-event'
import { showNotification } from '@/shared/show-notification'
import useCalendarStore from '@/shared/store/calendar-store'
import { useResponsive } from '@/hooks/use-responsive'

import EventPopover from '@/components/event/event-popover'
import CreateEventModal from '@/components/event/modals/create-event-modal'
import Navbar from '@/components/general/navbar/navbar'

import '@/shared/styles/calendar.css'

const HomePage: React.FC = React.memo(() => {
	const { isMobile } = useResponsive()
	const { calendars } = useCalendarStore()
	const calendarRef = useRef<FullCalendar | null>(null)
	const [isNavbarOpen, setIsNavbarOpen] = useState(!isMobile)
	const [createEventModalOpened, setCreateEventModalOpened] = useState(false)

	const fetchEvents = async (
		info: EventSourceFuncArg,
		successCallback: (eventInputs: EventInput[]) => void,
		failureCallback: (error: Error) => void
	) => {
		const visibleCalendars = Object.entries(calendars).filter(
			([_, value]) => value.visible
		)

		try {
			const responses = await Promise.all(
				visibleCalendars.map(([id]) =>
					apiClient.get<IEvent[]>(`/calendars/${id}/events`, {
						params: {
							startDate: info.start.toISOString(),
							endDate: info.end.toISOString(),
						},
					})
				)
			)
			successCallback(responses.flatMap((r) => r.data).map(mapEvent))
		} catch (error) {
			failureCallback(error as Error)
		}
	}

	const updateCalendarSize = () => {
		if (calendarRef.current) {
			calendarRef.current.getApi().updateSize()
		}
	}

	useEffect(() => {
		setIsNavbarOpen(!isMobile)
		updateCalendarSize()
	}, [isMobile])

	return (
		<React.Fragment>
			<Flex
				h="100vh"
				direction={isNavbarOpen ? (isMobile ? 'column' : 'row') : 'column'}
			>
				<Navbar
					calendarRef={calendarRef}
					onToggle={() => setIsNavbarOpen((prev) => !prev)}
				/>
				<Stack
					flex={1}
					p="xs"
					pt={!isNavbarOpen ? '0' : isMobile ? '0' : 'xl'}
					pl={isNavbarOpen ? (!isMobile ? '0' : 'xl') : 'xl'}
					style={{ borderRadius: '25%' }}
				>
					<FullCalendar
						ref={calendarRef}
						firstDay={1}
						plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
						headerToolbar={{
							left: 'today prev,next',
							center: 'title',
							right: 'dayGridMonth,timeGridWeek,timeGridDay',
						}}
						initialView="dayGridMonth"
						editable={true}
						selectable={true}
						selectMirror={true}
						dayMaxEvents={true}
						height="100%"
						themeSystem="bootstrap5"
						events={{ events: fetchEvents }}
						lazyFetching
						eventTimeFormat={{
							hour: '2-digit',
							minute: '2-digit',
							hour12: false,
						}}
						select={(info: DateSelectArg) => {
							setCreateEventModalOpened(true)
							info.view.calendar.unselect()
						}}
						eventDrop={async ({ event, revert }) => {
							if (event.extendedProps.type === EventType.HOLIDAY) {
								revert()
							} else {
								try {
									await apiClient.patch(`events/${event.id}`, {
										startDate: event.startStr,
										endDate: event.end ? event.endStr : undefined,
									})
								} catch {
									showNotification('Event', 'Error changing event time', 'red')
									revert()
								}
							}
						}}
					/>
				</Stack>
			</Flex>
			<CreateEventModal
				opened={createEventModalOpened}
				onClose={() => {
					setCreateEventModalOpened(false)
				}}
				calendarRef={calendarRef}
			/>
			<EventPopover calendarRef={calendarRef} />
		</React.Fragment>
	)
})

export default HomePage
