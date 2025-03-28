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

import { EventImpl } from '@fullcalendar/core/internal'
import { capitalize } from 'lodash'

import { useResponsive } from '@/hooks/use-responsive'
import { InvitationStatus, MemberRole } from '@/shared/enum'
import { IEventMember } from '@/shared/interface'
import useUserStore from '@/shared/store/user-store'

import EventMemberDelete from './event-member-delete'
import EditEventRoleSelect from './event-member-role-select'

interface EventMemberListProps {
	event: EventImpl
	users: IEventMember[]
	onDelete: (userId: number) => void
}

const StatusIcons = {
	[InvitationStatus.INVITED]: <FcClock />,
	[InvitationStatus.ACCEPTED]: <FcOk />,
	[InvitationStatus.DECLINED]: <FcCancel />,
} as const

const EventMemberList: React.FC<EventMemberListProps> = ({
	event,
	users,
	onDelete,
}) => {
	const { user: currentUser } = useUserStore()
	const { isMobile } = useResponsive()
	const [role, setRole] = useState<MemberRole>()

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
					<Flex justify="space-between">
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
						{user.status !== InvitationStatus.INVITED &&
							role === MemberRole.OWNER &&
							user.userId !== currentUser?.id && (
								<EventMemberDelete
									user={user}
									event={event}
									onDelete={onDelete}
								/>
							)}
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
							(role === MemberRole.OWNER && user.userId !== currentUser?.id ? (
								<EditEventRoleSelect user={user} event={event} />
							) : (
								<Text size="sm" c="dimmed">
									{capitalize(user.role)}
								</Text>
							))}
					</Group>
				</Card>
			))}
		</ScrollArea>
	)
}

export default React.memo(EventMemberList)
