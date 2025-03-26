import React, { useEffect, useRef, useState } from 'react'
import { Flex, Stack } from '@mantine/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import {
	DateSelectArg,
	EventInput,
	EventSourceFuncArg,
} from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

import Navbar from '@/components/general/navbar/navbar'
import CreateEventModal from '@/components/event/modals/create-event-modal'
import { apiClient } from '@/helpers/api/axios'
import { IEvent } from '@/helpers/interface/event.interface'
import { EventType } from '@/helpers/enum/event-type.enum'
import useCalendarStore from '@/helpers/store/calendar-store'
import { useResponsive } from '@/hooks/use-responsive'

import EventPopover from '@/components/event/event-popover'
import { showNotification } from '@/helpers/show-notification'

import '@/pages/style.css'

const mapEvent = (event: IEvent): EventInput => {
	return {
		id: event.id.toString(),
		title: event.name,
		start: new Date(event.startDate),
		end: event.endDate ? new Date(event.endDate) : undefined,
		backgroundColor: event.color,
		borderColor: event.color,
		extendedProps: {
			calendarId: event.calendarId,
			description: event.description,
			type: event.type,
			members: event.members,
		},
	}
}

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
			const response = await Promise.all(
				visibleCalendars.map(([id]) =>
					apiClient.get<IEvent[]>(`/calendars/${id}/events`, {
						params: {
							startDate: info.start.toISOString(),
							endDate: info.end.toISOString(),
						},
					})
				)
			)
			successCallback(response.flatMap((r) => r.data).map(mapEvent))
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
					p="xl"
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
