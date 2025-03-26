import React, { useEffect } from 'react'
import {
	Box,
	Checkbox,
	Divider,
	Flex,
	HoverCard,
	ScrollArea,
	Stack,
	Text,
} from '@mantine/core'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { apiClient } from '@/helpers/api/axios'
import { ICalendar } from '@/helpers/interface/calendar.interface'
import useCalendarStore from '@/helpers/store/calendar-store'
import { useResponsive } from '@/hooks/use-responsive'

import CalendarMenu from './calendar-menu'
import { CalendarType } from '@/helpers/enum/calendar-type.enum'

const CalendarCheckbox: React.FC = React.memo(() => {
	const { isMobile } = useResponsive()
	const { calendars, toggleCalendar, setCalendars } = useCalendarStore()

	useEffect(() => {
		const fetchCalendars = async () => {
			const { data } = await apiClient.get<ICalendar[]>('/calendars')

			const newCalendars = data.filter(
				({ id }) => !Object.keys(calendars).includes(id.toString())
			)

			if (newCalendars.length > 0) {
				setCalendars([
					...Object.entries(calendars).map(([_, value]) => value),
					...newCalendars,
				])
			}
		}

		fetchCalendars()
	}, [setCalendars, calendars])

	return (
		<Stack>
			<Divider />
			<Text fw={500}>My calendars</Text>
			{Object.values(calendars)
				.filter((calendar) => calendar.type === CalendarType.PERSONAL)
				.map((calendar) => (
					<Flex key={calendar.id} justify="space-between">
						<Checkbox
							label={calendar.name}
							checked={calendars[calendar.id].visible ?? true}
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
			<ScrollArea mah="300px" scrollbarSize={8} type="auto" offsetScrollbars>
				{Object.values(calendars)
					.filter((calendar) => calendar.type !== CalendarType.PERSONAL)
					.map((calendar) => (
						<Flex key={calendar.id} justify="space-between" pb="xs">
							<Checkbox
								label={calendar.name}
								checked={calendars[calendar.id].visible ?? true}
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
			</ScrollArea>
		</Stack>
	)
})

export default CalendarCheckbox
