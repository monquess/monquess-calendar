import React, { useCallback, useEffect, useState } from 'react'
import { Button, Modal, MultiSelect, Stack } from '@mantine/core'
import { AxiosError } from 'axios'
import { debounce } from 'lodash'
import apiClient from '@/helpers/axios'
import { ICalendar } from '@/helpers/interface/calendar.interface'
import { showNotification } from '@/helpers/show-notification'
import { User } from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'

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
		const [loading, setLoading] = useState(false)

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

		const handleSubmit = async (event: React.FormEvent) => {
			event.preventDefault()
			try {
				setLoading(true)
				const users = await Promise.all(
					selectedUser.map((user) =>
						apiClient.get<User[]>('/users', { params: { email: user } })
					)
				)

				const userIds = users
					.map(({ data }) => {
						return data.length > 0 ? data[0].id : null
					})
					.filter(Boolean)

				await Promise.all(
					userIds.map((id) =>
						apiClient.post(`/calendars/${calendar.id}/users/${id}`)
					)
				)

				showNotification(
					'Member invitation',
					'Members have been successfully invited to the calendar.',
					'green'
				)
				onClose()
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					showNotification('Member invitation error', error.message, 'red')
				}
			} finally {
				setLoading(false)
			}
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
			</Modal>
		)
	}
)

export default InviteMemberModal
