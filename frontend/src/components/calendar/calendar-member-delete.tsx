import React, { useState } from 'react'
import { ActionIcon, Box, Flex, Popover, Text } from '@mantine/core'

import { FaCheck, FaTimes } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

import { apiClient, ApiError } from '@/shared/api/axios'
import { ICalendar, ICalendarMember } from '@/shared/interface'
import { showNotification } from '@/shared/show-notification'

interface CalendarMemberDeleteProps {
	user: ICalendarMember
	calendar: ICalendar
	onClose: () => void
}

const CalendarMemberDelete: React.FC<CalendarMemberDeleteProps> = React.memo(
	({ user, calendar, onClose }) => {
		const [opened, setOpened] = useState(false)

		const handleClick = async () => {
			try {
				await apiClient.delete(`calendars/${calendar.id}/users/${user.userId}`)
				showNotification(
					'Member delete',
					'Members have been successfully delete from the calendar.',
					'green'
				)
				onClose()
			} catch (error) {
				if (error instanceof ApiError && error.response) {
					showNotification('Member deletion error', error.message, 'red')
				}
			}
		}

		return (
			<Popover
				opened={opened}
				onChange={setOpened}
				styles={{
					dropdown: {
						zIndex: 3000,
					},
				}}
				width={220}
			>
				<Popover.Target>
					<ActionIcon
						variant="subtle"
						onClick={() => setOpened((prev) => !prev)}
					>
						<MdDelete size={20} color="#ef4444" />
					</ActionIcon>
				</Popover.Target>
				<Popover.Dropdown>
					<Box mb="8px">
						<Text
							size="sm"
							fw={500}
							style={{
								wordWrap: 'break-word',
							}}
						>
							Are you sure you want to delete "{user.user.username}" member?
						</Text>
					</Box>
					<Flex justify="space-between" align="center">
						<ActionIcon variant="subtle" onClick={() => setOpened(false)}>
							<FaTimes size={16} color="#f87171" />
						</ActionIcon>
						<ActionIcon variant="subtle" onClick={handleClick}>
							<FaCheck size={16} color="#34d399" />
						</ActionIcon>
					</Flex>
				</Popover.Dropdown>
			</Popover>
		)
	}
)

export default CalendarMemberDelete
