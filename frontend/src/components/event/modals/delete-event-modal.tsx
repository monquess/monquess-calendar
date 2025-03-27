import React from 'react'
import { Button, Modal, Stack, Text } from '@mantine/core'

import { EventImpl } from '@fullcalendar/core/internal'
import FullCalendar from '@fullcalendar/react'

import { apiClient, ApiError } from '@/shared/api/axios'
import { MemberRole } from '@/shared/enum'
import { showNotification } from '@/shared/show-notification'
import useUserStore from '@/shared/store/user-store'

import { useResponsive } from '@/hooks/use-responsive'

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

				calendarRef.current?.getApi().getEventById(event.id)?.remove()
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
