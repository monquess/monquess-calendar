import { Divider, Modal, Stack } from '@mantine/core'
import React, { useCallback, useEffect, useState } from 'react'

import { EventImpl } from '@fullcalendar/core/internal'

import { useResponsive } from '@/hooks/use-responsive'

import { apiClient } from '@/shared/api/axios'
import { IEvent } from '@/shared/interface'
import { IEventMember } from '@/shared/interface/event-member.interface'
import InviteEventMembersForm from '../forms/invite-member-form'
import EventMemberList from '../member/event-member-list'

interface EventMemberModalProps {
	opened: boolean
	onClose: () => void
	event: EventImpl
}

const EventMemberModal: React.FC<EventMemberModalProps> = ({
	opened,
	onClose,
	event,
}) => {
	const { isMobile } = useResponsive()
	const [users, setUsers] = useState<IEventMember[]>([])

	const onDelete = useCallback((userId: number) => {
		setUsers((prev) => prev.filter((user) => user.userId !== userId))
	}, [])

	const onInvite = useCallback((newUsers: IEventMember[]) => {
		setUsers((prevUsers) => [...prevUsers, ...newUsers])
	}, [])

	useEffect(() => {
		const fetchUsers = async () => {
			const { data } = await apiClient.get<IEvent>(`events/${event.id}`)
			setUsers(data.members)
		}

		fetchUsers()
	}, [event.id])
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Event members"
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<Stack pos="relative">
				<InviteEventMembersForm event={event} onInvite={onInvite} />
				<Divider />
				<EventMemberList event={event} onDelete={onDelete} users={users} />
			</Stack>
		</Modal>
	)
}

export default React.memo(EventMemberModal)
