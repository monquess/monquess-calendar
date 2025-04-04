import React, { useEffect, useState } from 'react'
import { Button, Flex, Modal, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'

import { apiClient, ApiError } from '@/shared/api/axios'
import { MemberRole } from '@/shared/enum'
import { ICalendar } from '@/shared/interface'
import { showNotification } from '@/shared/helpers/show-notification'
import useCalendarStore from '@/shared/store/calendar-store'
import useUserStore from '@/shared/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'

interface DeleteCalendarModalProps {
	opened: boolean
	onClose: () => void
	calendar: ICalendar
}

const DeleteCalendarModal: React.FC<DeleteCalendarModalProps> = ({
	opened,
	onClose,
	calendar,
}) => {
	const { isMobile } = useResponsive()
	const { deleteCalendar } = useCalendarStore()
	const { user } = useUserStore()
	const [role, setRole] = useState<MemberRole>()
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
			if (error instanceof ApiError && error.response) {
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

export default React.memo(DeleteCalendarModal)
