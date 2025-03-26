import { apiClient } from '@/helpers/api/axios'
import { MemberRole } from '@/helpers/enum/member-role.enum'
import { ICalendar, IUserMember } from '@/helpers/interface/calendar.interface'
import useUserStore from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'
import {
	Avatar,
	Box,
	Card,
	Divider,
	Flex,
	Modal,
	ScrollArea,
	Text,
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import EditRolePopover from '../edit-role-popover'

interface CalendarMemberModalProps {
	opened: boolean
	onClose: () => void
	calendar: ICalendar
}

const CalendarMemberModal: React.FC<CalendarMemberModalProps> = React.memo(
	({ opened, onClose, calendar }) => {
		const { user } = useUserStore()
		const { isMobile } = useResponsive()
		const [users, setUsers] = useState<IUserMember[]>([])
		const [role, setRole] = useState<MemberRole>()

		useEffect(() => {
			const fetchUsers = async () => {
				const { data } = await apiClient.get<ICalendar>(
					`calendars/${calendar.id}`
				)
				setUsers(data.users)
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
				<ScrollArea h="400px">
					{users.map((user) => (
						<Card
							key={user.userId}
							shadow="sm"
							padding="sm"
							mb="10px"
							radius="md"
							w={isMobile ? '340px' : '400px'}
						>
							<Flex align="center" gap="md">
								<Avatar
									src={user.user.avatar}
									alt={user.user.username}
									size="md"
									radius="xl"
								/>
								<Box>
									<Text>{user.user.username}</Text>
									<Text size="sm" c="dimmed">
										{user.user.email}
									</Text>
								</Box>
							</Flex>
							<Divider />
							<Box pt="xs">
								<Text size="sm" mb="5px">
									Status: {user.status.toLocaleLowerCase()}
								</Text>
								<Flex gap="xs" align="center">
									{user.role !== MemberRole.OWNER && (
										<>
											<Text size="sm" c="dimmed">
												Role: {user.role.toLocaleLowerCase()}
											</Text>
											{role === MemberRole.OWNER && (
												<EditRolePopover user={user} calendar={calendar} />
											)}
										</>
									)}
								</Flex>
							</Box>
						</Card>
					))}
				</ScrollArea>
			</Modal>
		)
	}
)

export default CalendarMemberModal
