import { ICalendar } from '@/helpers/interface/calendar.interface'
import { useResponsive } from '@/hooks/use-responsive'
import { Flex, Modal, ScrollArea, Text } from '@mantine/core'
import React from 'react'

interface CalendarMemberModalProps {
	opened: boolean
	onClose: () => void
	calendar: ICalendar
}

const CalendarMemberModal: React.FC<CalendarMemberModalProps> = React.memo(
	({ opened, onClose, calendar }) => {
		const { isMobile } = useResponsive()
		return (
			<Modal
				opened={opened}
				onClose={onClose}
				title={`Members of ${calendar.name} calendar`}
				size={isMobile ? 'sm' : 'md'}
				centered
				closeOnClickOutside={false}
				zIndex={1000}
			>
				<ScrollArea>
					{calendar.users.map((user) => (
						<Flex key={user.userId}>
							<Text>
								{user.role} {user.status}
							</Text>
						</Flex>
					))}
				</ScrollArea>
			</Modal>
		)
	}
)

export default CalendarMemberModal
