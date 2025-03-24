import UserMenu from '@/components/user/user-menu'
import useUserStore from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'
import FullCalendar from '@fullcalendar/react'
import { Box, Button, Divider, Flex, Stack, Text } from '@mantine/core'
import { DatePicker, DatesRangeValue } from '@mantine/dates'
import { useMediaQuery } from '@mantine/hooks'
import React, { useState } from 'react'
import { IoMenu } from 'react-icons/io5'
import ThemeSwitch from '../../buttons/theme-switch'
import CalendarCheckbox from '../../calendar/calendar-checkbox'

interface NavbarContentProps {
	onClickMenu: () => void
	onOpenModal: () => void
	calendarRef: React.RefObject<FullCalendar | null>
}

const NavbarContent: React.FC<NavbarContentProps> = ({
	onClickMenu,
	onOpenModal,
	calendarRef,
}) => {
	const { user } = useUserStore()
	const { isMobile } = useResponsive()
	const isSmallMobile = useMediaQuery('(max-width: 420px)')
	const [value, setValue] = useState<DatesRangeValue>([new Date(), new Date()])

	return (
		<Stack m="md" justify="space-between" h={isMobile ? '100%' : 'auto'}>
			<Stack>
				<Flex>
					{!isMobile && (
						<Box pr="md">
							<IoMenu onClick={onClickMenu} size={28} />
						</Box>
					)}
					{!isMobile && <ThemeSwitch />}
				</Flex>
				<Button onClick={onOpenModal} mt={isMobile ? '0' : 'xl'}>
					Create
				</Button>
				<DatePicker
					type="range"
					allowSingleDateInRange
					defaultDate={new Date()}
					value={value}
					onChange={([start, end]) => {
						if (calendarRef.current && start && end) {
							calendarRef.current.getApi().setOption('validRange', {
								start: start,
								end: new Date(end).setDate(new Date(end).getDate() + 1),
							})
						}
						setValue([start, end])
					}}
				/>
				<CalendarCheckbox />
			</Stack>
			<Stack>
				<Divider />
				<Flex align="center" gap="md">
					<UserMenu size="lg" />
					<Box mb={isSmallMobile ? 'xs' : '0'}>
						<Text fw={700}>{user?.username}</Text>
						<Text c="dimmed">{user?.email}</Text>
					</Box>
				</Flex>
			</Stack>
		</Stack>
	)
}

export default NavbarContent
