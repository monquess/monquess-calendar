import React, { useEffect, useState } from 'react'
import { Avatar, Card, Modal, ScrollArea, Stack, Text } from '@mantine/core'
import { apiClient } from '@/helpers/api/axios'
import { ICalendar } from '@/helpers/interface/calendar.interface'
import useUserStore, { User } from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'
import { MemberRole } from '@/helpers/enum/member-role.enum'

interface CalendarMemberModalProps {
	opened: boolean
	onClose: () => void
	calendar: ICalendar
}

const CalendarMemberModal: React.FC<CalendarMemberModalProps> = React.memo(
	({ opened, onClose, calendar }) => {
		const { user } = useUserStore()
		const { isMobile } = useResponsive()
		const [users, setUsers] = useState<User[]>([])
		const [role, setRole] = useState<MemberRole>()

		useEffect(() => {
			const fetchUsers = async () => {
				const { data } = await apiClient.get<ICalendar>(
					`calendars/${calendar.id}`
				)
				const responses = await Promise.all(
					data.users.map((user) => apiClient.get<User>(`/users/${user.userId}`))
				)
				setUsers(responses.map((res) => res.data))
			}

			fetchUsers()
		}, [calendar.id])

		useEffect(() => {
			if (calendar) {
				const u = calendar.users.find(({ userId }) => userId === user?.id)
				if (u) {
					setRole(u.role)
				}
			}
		}, [calendar, user?.id])

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
				<>{role}</>
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
