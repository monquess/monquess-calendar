import React, { useEffect, useState } from 'react'
import {
	Avatar,
	Box,
	Card,
	Divider,
	Flex,
	Group,
	Modal,
	ScrollArea,
	Text,
} from '@mantine/core'
import { FcCancel, FcClock, FcOk } from 'react-icons/fc'

import { capitalize } from 'lodash'

import { apiClient } from '@/helpers/api/axios'
import { MemberRole } from '@/helpers/enum/member-role.enum'
import { ICalendar, IUserMember } from '@/helpers/interface/calendar.interface'
import { InvitationStatus } from '@/helpers/enum'
import useUserStore from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'

import EditRoleSelect from '../edit-role-select'

interface CalendarMemberModalProps {
	opened: boolean
	onClose: () => void
	calendar: ICalendar
}

const StatusIcons = {
	[InvitationStatus.INVITED]: <FcClock />,
	[InvitationStatus.ACCEPTED]: <FcOk />,
	[InvitationStatus.DECLINED]: <FcCancel />,
} as const

const CalendarMemberModal: React.FC<CalendarMemberModalProps> = React.memo(
	({ opened, onClose, calendar }) => {
		const { user: currentUser } = useUserStore()
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
				const user = calendar.users.find(
					({ userId }) => userId === currentUser?.id
				)
				if (user) {
					setRole(user.role)
				}
			}
		}, [calendar, currentUser?.id])

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
							<Divider my={'xs'} />
							<Group justify="space-between" align="center">
								<Group align="center" gap="xs">
									<Box>{StatusIcons[user.status]}</Box>
									<Text size="sm" mb="5px">
										{capitalize(user.status)}
									</Text>
								</Group>
								{user.status !== InvitationStatus.DECLINED &&
									(role === MemberRole.OWNER &&
									user.userId !== currentUser?.id ? (
										<EditRoleSelect user={user} calendar={calendar} />
									) : (
										<Text size="sm" c="dimmed">
											{capitalize(user.role)}
										</Text>
									))}
							</Group>
						</Card>
					))}
				</ScrollArea>
			</Modal>
		)
	}
)

export default CalendarMemberModal
