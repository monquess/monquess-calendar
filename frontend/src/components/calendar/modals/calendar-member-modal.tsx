import apiClient from '@/helpers/axios'
import { ICalendar } from '@/helpers/interface/calendar-interface'
import { User } from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'
import { Avatar, Card, Modal, ScrollArea, Stack, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'

interface CalendarMemberModalProps {
	opened: boolean
	onClose: () => void
	calendar: ICalendar
}

const CalendarMemberModal: React.FC<CalendarMemberModalProps> = React.memo(
	({ opened, onClose, calendar }) => {
		const { isMobile } = useResponsive()
		const [users, setUsers] = useState<User[]>([])

		useEffect(() => {
			const fetchUsers = async () => {
				try {
					const responses = await Promise.all(
						calendar.users.map((user) =>
							apiClient.get<User>(`/users/${user.userId}`)
						)
					)
					setUsers(responses.map((res) => res.data))
				} catch (error) {
					console.error('Error fetching users:', error)
				}
			}

			fetchUsers()
		}, [calendar.users])

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
				<ScrollArea h="400px">
					{users.map((user) => (
						<Card
							key={user.id}
							shadow="sm"
							padding="lg"
							mb="10px"
							radius="md"
							w={isMobile ? '340px' : '400px'}
						>
							<Stack>
								<Avatar
									src={user.avatar}
									alt={user.username}
									size={40}
									radius="xl"
								/>
								<Text w={500}>{user.username}</Text>
							</Stack>
							<Text size="sm" c="dimmed">
								{user.email}
							</Text>
						</Card>
					))}
				</ScrollArea>
			</Modal>
		)
	}
)

export default CalendarMemberModal
