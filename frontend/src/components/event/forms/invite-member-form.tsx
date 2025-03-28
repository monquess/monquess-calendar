import { Button, MultiSelect, Stack } from '@mantine/core'
import React, { useCallback, useEffect, useState } from 'react'

import { EventImpl } from '@fullcalendar/core/internal'
import { debounce } from 'lodash'

import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import { IEventMember } from '@/shared/interface'
import { User } from '@/shared/store/user-store'

interface InviteEventMembersFormProps {
	event: EventImpl
	onInvite: (newUsers: IEventMember[]) => void
}

const InviteEventMembersForm: React.FC<InviteEventMembersFormProps> = ({
	event,
	onInvite,
}) => {
	const [data, setData] = useState<User[]>([])
	const [search, setSearch] = useState('')
	const [selectedUser, setSelectedUser] = useState<string[]>([])
	const [loading, setLoading] = useState(false)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetchUsers = useCallback(
		debounce(async (query: string) => {
			if (!query.trim()) {
				setData([])
			} else {
				const response = await apiClient.get<User[]>('/users', {
					params: { email: query },
				})
				setData(response.data)
			}
		}, 500),
		[]
	)

	useEffect(() => {
		fetchUsers(search)
	}, [search, fetchUsers])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			setLoading(true)
			const response = await Promise.all(
				selectedUser.map((user) =>
					apiClient.get<User[]>('/users', { params: { email: user } })
				)
			)
			const users = response.flatMap((res) => res.data)

			const responseMember = await Promise.all(
				users.map(({ id }) =>
					apiClient.post(`/events/${event.id}/members/${id}`)
				)
			)
			const newMembers = responseMember.flatMap((res) => res.data)
			onInvite(newMembers)

			showNotification(
				'Member invitation',
				'Members have been successfully invited to the event.',
				'green'
			)
			setSelectedUser([])
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification('Member invitation error', error.message, 'red')
			}
		} finally {
			setLoading(false)
		}
	}
	return (
		<form onSubmit={handleSubmit}>
			<Stack pos="relative">
				<MultiSelect
					data-autofocus
					label="Select users"
					placeholder="Start writing username..."
					searchable
					clearable
					value={selectedUser}
					onSearchChange={setSearch}
					onChange={setSelectedUser}
					data={data.map((user) => ({
						value: user.email,
						label: user.email,
					}))}
					styles={{ dropdown: { zIndex: 1100 } }}
					hidePickedOptions
				/>
				<Button type="submit" loading={loading} variant="outline">
					Invite users
				</Button>
			</Stack>
		</form>
	)
}

export default React.memo(InviteEventMembersForm)
