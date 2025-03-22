import React, { useEffect, useRef, useState } from 'react'
import { Flex, Stack } from '@mantine/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

import Navbar from '@/components/general/navbar/navbar'
import apiClient from '@/helpers/axios'
import { IEvent } from '@/helpers/interface/event-interface'
import useCalendarStore from '@/helpers/store/calendar-store'
import { useResponsive } from '@/hooks/use-responsive'

import '@/pages/style.css'

const HomePage: React.FC = React.memo(() => {
	const { isMobile } = useResponsive()
	const calendarRef = useRef<FullCalendar | null>(null)
	const [isNavbarOpen, setIsNavbarOpen] = useState(!isMobile)
	const { calendarVisibility } = useCalendarStore()

	useEffect(() => {
		setIsNavbarOpen(!isMobile)
	}, [isMobile])

	const updateCalendarSize = () => {
		if (calendarRef.current) {
			calendarRef.current.getApi().updateSize()
		}
	}

	useEffect(() => {
		updateCalendarSize()
	}, [isNavbarOpen])

	useEffect(() => {
		setIsNavbarOpen(!isMobile)
	}, [isMobile])

	const [events, setEvents] = useState<IEvent[]>([])
	useEffect(() => {
		if (!calendarRef.current) {
			return
		}
		const { currentStart, currentEnd } = calendarRef.current.getApi().view

		const fetchEvents = async () => {
			const calendarIds = Object.entries(calendarVisibility)
				.filter(([_, value]) => value)
				.map(([key]) => key)
			const response = await Promise.all(
				calendarIds.map((id) =>
					apiClient.get<IEvent[]>(`/calendars/${id}/events`, {
						params: {
							startDate: currentStart.toISOString(),
							endDate: currentEnd.toISOString(),
						},
					})
				)
			)
			setEvents(
				response
					.reduce<IEvent[]>((res, events) => [...res, ...events.data], [])
					.map((event) => ({
						...event,
						id: event.id.toString(),
						title: event.name,
						start: event.startDate,
						end: event.endDate,
						backgroundColor: event.color,
						borderColor: event.color,
					}))
			)
		}
		fetchEvents()
	}, [calendarVisibility])

	return (
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
					events={events}
					eventTimeFormat={{
						hour: '2-digit',
						minute: '2-digit',
						hour12: false,
					}}
				/>
			</Stack>
		</Flex>
	)
})

export default HomePage
