import apiClient from '@/helpers/axios'
import { ICalendar } from '@/helpers/interface/calendar-interface'
import useCalendarStore from '@/helpers/store/calendar-store'
import { useResponsive } from '@/hooks/use-responsive'
import { Button, Flex, Modal, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import React from 'react'

interface DeleteCalendarModalProps {
	opened: boolean
	onClose: () => void
	calendar: ICalendar
}

const DeleteCalendarModal: React.FC<DeleteCalendarModalProps> = React.memo(
	({ opened, onClose, calendar }) => {
		const { isMobile } = useResponsive()
		const { deleteCalendar } = useCalendarStore()

		const form = useForm({
			mode: 'uncontrolled',
		})

		const handleSubmit = async () => {
			try {
				await apiClient.delete(`/calendars/${calendar.id}`)
				deleteCalendar(calendar.id)
			} catch {}
		}
		return (
			<Modal
				opened={opened}
				onClose={onClose}
				title="Delete calendar"
				size={isMobile ? 'sm' : 'md'}
				centered
				closeOnClickOutside={false}
				zIndex={1000}
			>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack pos="relative">
						<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
							Do you really want to delete "{calendar.name}"? This action is
							irreversible.
						</Text>
						<Flex justify="space-between">
							<Button type="submit" variant="outline" onClick={() => onClose()}>
								Cancel
							</Button>
							<Button type="submit" variant="filled" color="red">
								Delete
							</Button>
						</Flex>
					</Stack>
				</form>
			</Modal>
		)
	}
)

export default DeleteCalendarModal
