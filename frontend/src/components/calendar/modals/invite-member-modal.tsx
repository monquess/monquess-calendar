import apiClient from '@/helpers/axios'
import { ICalendar } from '@/helpers/interface/calendar-interface'
import { User } from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'
import { Button, Modal, MultiSelect, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { AxiosError } from 'axios'
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

				notifications.show({
					title: 'Member Invitation',
					message: 'Members have been successfully invited to the calendar.',
					withCloseButton: true,
					autoClose: 5000,
					color: 'green',
				})
				onClose()
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					notifications.show({
						title: 'Member Invitation',
						message: error.message,
						withCloseButton: true,
						autoClose: 5000,
						color: 'red',
					})
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
