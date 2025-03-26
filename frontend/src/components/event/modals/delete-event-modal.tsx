import { apiClient, ApiError } from '@/helpers/api/axios'
import { MemberRole } from '@/helpers/enum/member-role.enum'
import { showNotification } from '@/helpers/show-notification'
import useUserStore from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'
import { EventImpl } from '@fullcalendar/core/internal'
import FullCalendar from '@fullcalendar/react'
import { Button, Modal, Stack, Text } from '@mantine/core'
import React from 'react'

interface DeleteEventModalProps {
	opened: boolean
	onClose: () => void
	event: EventImpl
	role?: MemberRole
	calendarRef: React.RefObject<FullCalendar | null>
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = React.memo(
	({ event, opened, onClose, role, calendarRef }) => {
		const { isMobile } = useResponsive()
		const { user } = useUserStore()

		const handleClick = async () => {
			try {
				if (role === MemberRole.OWNER) {
					await apiClient.delete(`/events/${event?.id}`)
				} else {
					await apiClient.delete(`/events/${event?.id}/members/${user?.id}`)
				}

				calendarRef.current?.getApi().refetchEvents()
				showNotification(
					'Event deletion',
					'The event has been successfully deleted.',
					'green'
				)
			} catch (error) {
				if (error instanceof ApiError && error.response) {
					showNotification('Event deletion error', error.message, 'red')
				}
			} finally {
				onClose()
			}
		}

		return (
			<Modal
				opened={opened}
				onClose={onClose}
				title="Delete event"
				size={isMobile ? 'sm' : 'md'}
				centered
				closeOnClickOutside={false}
			>
				<Stack pos="relative">
					<Text>Are you sure to delete '{event.title}' event?</Text>
					<Button variant="outline" onClick={handleClick}>
						Delete event
					</Button>
				</Stack>
			</Modal>
		)
	}
)

export default DeleteEventModal
