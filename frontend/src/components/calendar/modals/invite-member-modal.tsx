import apiClient from '@/helpers/axios'
import { ICalendar } from '@/helpers/interface/calendar-interface'
import { User } from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'
import { Button, Modal, MultiSelect, Stack } from '@mantine/core'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'

interface InviteMemberModalProps {
	opened: boolean
	onClose: () => void
	calendar: ICalendar
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = React.memo(
	({ opened, onClose, calendar }) => {
		const { isMobile } = useResponsive()
		const [data, setData] = useState<User[]>([])
		const [search, setSearch] = useState('')
		const [selectedUser, setSelectedUser] = useState<string[]>([])

		const fetchUsers = useCallback(
			debounce(async (query: string) => {
				if (!query.trim()) {
					setData([])
					return
				}
				try {
					const response = await apiClient.get('/users', {
						params: { email: query },
					})
					setData(response.data)
				} catch {}
			}, 500),
			[]
		)

		useEffect(() => {
			fetchUsers(search)
		}, [search, fetchUsers])

		const handleSubmit = async (event: React.FormEvent) => {
			event.preventDefault()
			try {
				await Promise.all(
					selectedUser.map((userId) =>
						apiClient.post(`/calendars/${calendar.id}/users/${userId}`)
					)
				)
				onClose()
			} catch {}
		}

		return (
			<Modal
				opened={opened}
				onClose={onClose}
				title="Invite members to calendar"
				size={isMobile ? 'sm' : 'md'}
				centered
				closeOnClickOutside={false}
				zIndex={1000}
			>
				<form onSubmit={handleSubmit}>
					<Stack pos="relative">
						<MultiSelect
							label="Select users"
							placeholder="Start writing username..."
							searchable
							clearable
							value={selectedUser}
							onSearchChange={setSearch}
							onChange={setSelectedUser}
							data={data.map((user) => ({
								value: user.id.toString(),
								label: user.email,
							}))}
							styles={{ dropdown: { zIndex: 1100 } }}
						/>
						<Button type="submit">Invite users</Button>
					</Stack>
				</form>
			</Modal>
		)
	}
)

export default InviteMemberModal
