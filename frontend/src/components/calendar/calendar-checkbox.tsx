import apiClient from '@/helpers/axios'
import { ICalendar } from '@/helpers/interface/calendar-interface'
import useCalendarStore from '@/helpers/store/calendar-store'
import { useResponsive } from '@/hooks/use-responsive'
import {
	Box,
	Checkbox,
	Divider,
	Flex,
	HoverCard,
	Stack,
	Text,
} from '@mantine/core'
import React, { useEffect } from 'react'
import { IoInformationCircleOutline } from 'react-icons/io5'
import CalendarMenu from './calendar-menu'

const CalendarCheckbox: React.FC = React.memo(() => {
	const { calendars, calendarVisibility, toggleCalendar, setCalendars } =
		useCalendarStore()

	const { isMobile } = useResponsive()

	useEffect(() => {
		if (Object.keys(calendars).length !== 0) return

		const fetchCalendars = async () => {
			try {
				const response = await apiClient.get<ICalendar[]>('/calendars')
				setCalendars(response.data)
			} catch {}
		}
		fetchCalendars()
	}, [setCalendars, calendars])

	return (
		<Stack>
			<Divider />
			<Text fw={500}>My calendars</Text>
			{Object.values(calendars)
				.filter((calendar) => calendar.isPersonal)
				.map((calendar) => (
					<Flex justify="space-between">
						<Checkbox
							key={calendar.id}
							label={calendar.name}
							checked={calendarVisibility[calendar.id] ?? true}
							onChange={() => toggleCalendar(calendar.id)}
							color={calendar.color}
						/>
						<Flex>
							{(calendar.description?.length ?? 0) > 0 && (
								<HoverCard>
									<HoverCard.Target>
										<IoInformationCircleOutline size={20} />
									</HoverCard.Target>
									<HoverCard.Dropdown>
										<Text size={isMobile ? 'xs' : 'md'}>
											{calendar.description}
										</Text>
									</HoverCard.Dropdown>
								</HoverCard>
							)}
							<Box ml="md">
								<CalendarMenu calendar={calendar} />
							</Box>
						</Flex>
					</Flex>
				))}

			<Divider />
			<Text fw={500}>Other calendars</Text>
			{Object.values(calendars)
				.filter((calendar) => !calendar.isPersonal)
				.map((calendar) => (
					<Flex justify="space-between">
						<Checkbox
							key={calendar.id}
							label={calendar.name}
							checked={calendarVisibility[calendar.id] ?? true}
							onChange={() => toggleCalendar(calendar.id)}
							color={calendar.color}
						/>
						<Flex justify="center">
							{(calendar.description?.length ?? 0) > 0 && (
								<HoverCard>
									<HoverCard.Target>
										<IoInformationCircleOutline size={20} />
									</HoverCard.Target>
									<HoverCard.Dropdown>
										<Text size={isMobile ? 'xs' : 'md'}>
											{calendar.description}
										</Text>
									</HoverCard.Dropdown>
								</HoverCard>
							)}
							<Box ml="xs">
								<CalendarMenu calendar={calendar} />
							</Box>
						</Flex>
					</Flex>
				))}
		</Stack>
	)
})

export default CalendarCheckbox
