import Navbar from '@/components/general/navbar/navbar'
import { useResponsive } from '@/hooks/use-responsive'
import '@/pages/style.css'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Flex, Stack } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'

const HomePage: React.FC = React.memo(() => {
	const { isMobile } = useResponsive()
	const calendarRef = useRef<FullCalendar | null>(null)
	const [isNavbarOpen, setIsNavbarOpen] = useState(!isMobile)

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

	return (
		<Flex
			h="100vh"
			direction={isNavbarOpen ? (isMobile ? 'column' : 'row') : 'column'}
		>
			<Navbar onToggle={() => setIsNavbarOpen((prev) => !prev)} />
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
				/>
			</Stack>
		</Flex>
	)
})

export default HomePage
