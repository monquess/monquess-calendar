import React, { useState, useEffect } from 'react'
import { IoMdClose } from 'react-icons/io'
import { MdDelete } from 'react-icons/md'
import { FiEdit } from 'react-icons/fi'
import { ActionIcon, Group, Popover, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'

import { EventImpl } from '@fullcalendar/core/internal'
import FullCalendar from '@fullcalendar/react'
import { EventClickArg } from '@fullcalendar/core/index.js'

import { apiClient, ApiError } from '@/helpers/api/axios'
import useUserStore from '@/helpers/store/user-store'
import { IEventMember } from '@/helpers/interface/event.interface'
import { MemberRole } from '@/helpers/enum/member-role.enum'
import { showNotification } from '@/helpers/show-notification'

interface EventPopoverProps {
	calendarRef: React.RefObject<FullCalendar | null>
}

const EventPopover: React.FC<EventPopoverProps> = ({ calendarRef }) => {
	const { user } = useUserStore()
	const [target, setTarget] = useState<HTMLElement | null>(null)
	const [selectedEvent, setSelectedEvent] = useState<EventImpl | null>(null)
	const [open, setOpen] = useState(false)
	const [role, setRole] = useState<MemberRole>()

	const form = useForm({
		mode: 'uncontrolled',
	})

	const onEventClick = (arg: EventClickArg) => {
		setTarget(arg.el)
		setOpen(true)
		setSelectedEvent(arg.event)
	}

	useEffect(() => {
		if (selectedEvent) {
			const member = selectedEvent.extendedProps.members.find(
				(member: IEventMember) => member.userId === user?.id
			)
			if (member) {
				setRole(member.role)
			}
		}
	}, [selectedEvent, user])

	useEffect(() => {
		const calendar = calendarRef.current

		if (calendar) {
			calendar.getApi().on('eventClick', onEventClick)
		}

		return () => {
			if (calendar) {
				calendar.getApi().off('eventClick', onEventClick)
			}
		}
	}, [calendarRef])

	const handleSubmit = async () => {
		try {
			// setLoading(true)
			if (role === MemberRole.OWNER) {
				await apiClient.delete(`/events/${selectedEvent?.id}`)
			} else {
				await apiClient.delete(
					`/events/${selectedEvent?.id}/members/${user?.id}`
				)
			}

			// deleteCalendar(calendar.id)
			showNotification(
				'Event deletion',
				'The event has been successfully deleted.',
				'green'
			)
			// onClose()
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification('Event deletion error', error.message, 'red')
			}
		} finally {
			// setLoading(false)
		}
	}

	if (!target || !selectedEvent) {
		return null
	}

	return (
		<Popover
			opened={open}
			onClose={() => setOpen(false)}
			position="bottom"
			transitionProps={{
				transition: 'slide-down',
				duration: 200,
				timingFunction: 'linear',
			}}
			styles={{
				dropdown: {
					position: 'absolute',
					left: target.getBoundingClientRect().left,
					top: target.getBoundingClientRect().bottom,
				},
			}}
		>
			<Popover.Dropdown>
				<Stack>
					<Group justify="flex-end">
						<Group>
							<ActionIcon variant="subtle">
								<FiEdit />
							</ActionIcon>
							<form onSubmit={form.onSubmit(handleSubmit)}>
								<ActionIcon variant="subtle" type="submit">
									<MdDelete />
								</ActionIcon>
							</form>
							<ActionIcon variant="subtle" onClick={() => setOpen(false)}>
								<IoMdClose />
							</ActionIcon>
						</Group>
					</Group>
					<Text fw={500}>{selectedEvent.title}</Text>
				</Stack>
			</Popover.Dropdown>
		</Popover>
	)
}

export default EventPopover
