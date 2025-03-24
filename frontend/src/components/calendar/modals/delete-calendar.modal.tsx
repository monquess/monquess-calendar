import apiClient from '@/helpers/axios'
import { MemberRole } from '@/helpers/enum/member-role.enum'
import { ICalendar } from '@/helpers/interface/calendar.interface'
import { showNotification } from '@/helpers/show-notification'
import useCalendarStore from '@/helpers/store/calendar-store'
import useStore from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'
import { Button, Flex, Modal, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'

interface DeleteCalendarModalProps {
	opened: boolean
	onClose: () => void
	calendar: ICalendar
}

const DeleteCalendarModal: React.FC<DeleteCalendarModalProps> = React.memo(
	({ opened, onClose, calendar }) => {
		const { isMobile } = useResponsive()
		const { deleteCalendar } = useCalendarStore()
		const { user } = useStore()
		const [role, setRole] = useState<string>()
		const [loading, setLoading] = useState(false)

		useEffect(() => {
			const findUser = calendar.users.find((e) => e.userId === user?.id)
			if (findUser) {
				setRole(findUser.role)
			}
		}, [calendar.users, user])

		const form = useForm({
			mode: 'uncontrolled',
		})

		const handleSubmit = async () => {
			try {
				setLoading(true)
				if (role === MemberRole.OWNER) {
					await apiClient.delete(`/calendars/${calendar.id}`)
				} else {
					await apiClient.delete(`/calendars/${calendar.id}/users/${user?.id}`)
				}

				deleteCalendar(calendar.id)
				showNotification(
					'Calendar deletion',
					'The calendar has been successfully deleted.',
					'green'
				)
				onClose()
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					showNotification('Calendar deletion error', error.message, 'red')
				}
			} finally {
				setLoading(false)
			}
		}
		return (
			<Modal
				opened={opened}
				onClose={onClose}
				title={role === 'OWNER' ? 'Delete calendar' : 'Leave calendar'}
				size={isMobile ? 'sm' : 'md'}
				centered
				closeOnClickOutside={false}
				zIndex={1000}
			>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack pos="relative">
						<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
							{role === 'OWNER'
								? `Do you really want to delete "${calendar.name}"? This action is irreversible.`
								: `Do you really want to leave "${calendar.name}"? This action is irreversible.`}
						</Text>
						<Flex justify="space-between">
							<Button type="submit" variant="outline" onClick={() => onClose()}>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="filled"
								color="red"
								loading={loading}
							>
								{role === 'OWNER' ? `Delete` : `Leave`}
							</Button>
						</Flex>
					</Stack>
				</form>
			</Modal>
		)
	}
)

export default DeleteCalendarModal
