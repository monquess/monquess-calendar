import React, { useState, useEffect } from 'react'
import { IoMdClose } from 'react-icons/io'
import { MdDelete, MdOutlineSubtitles } from 'react-icons/md'
import { FiEdit } from 'react-icons/fi'
import { IoCalendar } from 'react-icons/io5'
import { ActionIcon, Grid, Group, Modal, Popover, Text } from '@mantine/core'
import { useForm } from '@mantine/form'

import { EventImpl } from '@fullcalendar/core/internal'
import FullCalendar from '@fullcalendar/react'
import { EventClickArg } from '@fullcalendar/core/index.js'

import { apiClient, ApiError } from '@/helpers/api/axios'
import { IEventMember } from '@/helpers/interface/event.interface'
import { MemberRole } from '@/helpers/enum/member-role.enum'
import { showNotification } from '@/helpers/show-notification'
import useUserStore from '@/helpers/store/user-store'
import useCalendarStore from '@/helpers/store/calendar-store'
import { useClickOutside } from '@mantine/hooks'
import { FaCircle } from 'react-icons/fa'

interface EventPopoverProps {
	calendarRef: React.RefObject<FullCalendar | null>
}

const EventPopover: React.FC<EventPopoverProps> = ({ calendarRef }) => {
	const { user } = useUserStore()
	const { calendars } = useCalendarStore()
	const [selectedEvent, setSelectedEvent] = useState<EventImpl | null>(null)
	const [opened, setOpened] = useState(false)
	const ref = useClickOutside(() => setOpened(false))
	const [role, setRole] = useState<MemberRole>()
	const [modalOpened, setModalOpened] = useState(false)
	const [position, setPosition] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	})

	const form = useForm({
		mode: 'uncontrolled',
	})

	const onEventClick = (arg: EventClickArg) => {
		const rect = arg.el.getBoundingClientRect()
		const popover = document.querySelector('.mantine-Popover-dropdown')

		if (popover) {
			if (rect.bottom + popover.clientHeight > window.innerHeight) {
				setPosition({
					x: rect.left,
					y: rect.top - popover.clientHeight,
				})
			}
		} else {
			setPosition({
				x: rect.left,
				y: rect.bottom,
			})
		}

		setOpened(true)
		setSelectedEvent(arg.event)

		console.log(calendars[arg.event.extendedProps.calendarId])
		console.log(arg.event)
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
			if (role === MemberRole.OWNER) {
				await apiClient.delete(`/events/${selectedEvent?.id}`)
			} else {
				await apiClient.delete(
					`/events/${selectedEvent?.id}/members/${user?.id}`
				)
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
			setOpened(false)
			setSelectedEvent(null)
		}
	}

	if (!selectedEvent) {
		return null
	}

	return (
		<React.Fragment>
			<Popover
				opened={opened}
				onClose={() => setOpened(false)}
				position="bottom"
				width={300}
				transitionProps={{
					transition: 'slide-down',
					duration: 200,
					timingFunction: 'linear',
				}}
				styles={{
					dropdown: {
						position: 'absolute',
						left: position.x,
						top: position.y,
					},
				}}
			>
				<Popover.Dropdown ref={ref}>
					<Grid>
						<Grid.Col span={12}>
							<Group justify="flex-end">
								{role !== MemberRole.VIEWER ? (
									<ActionIcon variant="subtle">
										<FiEdit />
									</ActionIcon>
								) : null}
								<ActionIcon variant="subtle" type="submit">
									<MdDelete />
								</ActionIcon>
								<ActionIcon variant="subtle" onClick={() => setOpened(false)}>
									<IoMdClose />
								</ActionIcon>
							</Group>
						</Grid.Col>
						<Grid.Col span={1}>
							<FaCircle size={20} color={selectedEvent.backgroundColor} />
						</Grid.Col>
						<Grid.Col span={11}>
							<Text size="xl" truncate="end">
								{selectedEvent.title}
							</Text>
						</Grid.Col>
						<Grid.Col span={12}>
							<Group>
								<Text size="lg">{selectedEvent.start?.toDateString()}</Text>
								<Text size="lg">-</Text>
								<Text size="lg">{selectedEvent.end?.toDateString()}</Text>
							</Group>
						</Grid.Col>
						{selectedEvent.extendedProps.description ? (
							<>
								<Grid.Col span={1}>
									<MdOutlineSubtitles size={20} />
								</Grid.Col>
								<Grid.Col span={11}>
									<Text size="sm">
										{selectedEvent.extendedProps.description}
									</Text>
								</Grid.Col>
							</>
						) : null}
						<Grid.Col span={1}>
							<IoCalendar size={20} />
						</Grid.Col>
						<Grid.Col span={11}>
							<Text fw={500}>
								{calendars[selectedEvent.extendedProps.calendarId].name}
							</Text>
						</Grid.Col>
					</Grid>
				</Popover.Dropdown>
			</Popover>
			<Modal
				opened={modalOpened}
				onClose={() => setModalOpened(false)}
				title="Create event"
				// size={isMobile ? 'sm' : 'md'}
				centered
				closeOnClickOutside={true}
				zIndex={1000}
			>
				<form onSubmit={form.onSubmit(handleSubmit)}></form>
			</Modal>
		</React.Fragment>
	)
}

export default EventPopover
