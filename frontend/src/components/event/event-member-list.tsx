import { apiClient } from '@/helpers/api/axios'
import { MemberRole } from '@/helpers/enum'
import { InvitationStatus } from '@/helpers/enum/invitation-status.enum'
import { IEvent, IEventMember } from '@/helpers/interface/event.interface'
import useUserStore from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'
import { EventImpl } from '@fullcalendar/core/internal'
import {
	Avatar,
	Box,
	Card,
	Divider,
	Flex,
	Group,
	ScrollArea,
	Text,
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { FcCancel, FcClock, FcOk } from 'react-icons/fc'

import { capitalize } from 'lodash'

interface EventMemberListProps {
	event: EventImpl
}

const StatusIcons = {
	[InvitationStatus.INVITED]: <FcClock />,
	[InvitationStatus.ACCEPTED]: <FcOk />,
	[InvitationStatus.DECLINED]: <FcCancel />,
} as const

const EventMemberList: React.FC<EventMemberListProps> = React.memo(
	({ event }) => {
		const { user: currentUser } = useUserStore()
		const { isMobile } = useResponsive()
		const [users, setUsers] = useState<IEventMember[]>([])
		const [role, setRole] = useState<MemberRole>()

		useEffect(() => {
			const fetchUsers = async () => {
				const { data } = await apiClient.get<IEvent>(`events/${event.id}`)
				console.log(data)
				setUsers(data.members)
			}

			fetchUsers()
			console.log(users)
		}, [event.id, users])

		useEffect(() => {
			if (event) {
				const user = event.extendedProps.members.find(
					(member: IEventMember) => member.userId === currentUser?.id
				)
				if (user) {
					setRole(user.role)
				}
			}
		}, [event, currentUser?.id])
		return (
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
							{/* {user.status !== InvitationStatus.DECLINED &&
								(role === MemberRole.OWNER &&
								user.userId !== currentUser?.id ? (
									<EditRoleSelect user={user} calendar={calendar} />
								) : (
									<Text size="sm" c="dimmed">
										{capitalize(user.role)}
									</Text>
								))} */}
						</Group>
					</Card>
				))}
			</ScrollArea>
		)
	}
)

export default EventMemberList
