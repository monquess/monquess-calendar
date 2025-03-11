import Navbar from '@/components/general/navbar'
import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import { Flex, Paper } from '@mantine/core'
import React from 'react'

const HomePage: React.FC = React.memo(() => {
	return (
		<Flex h="100vh">
			<Navbar />
			<Paper flex={1}>
				<FullCalendar
					firstDay={1}
					plugins={[dayGridPlugin]}
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
				/>
			</Paper>
		</Flex>
	)
})

export default HomePage
