import { ActionIcon, Grid, Group, Popover, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { IoMdClose } from 'react-icons/io'
import { IoCalendar } from 'react-icons/io5'
import { MdDelete, MdOutlineSubtitles } from 'react-icons/md'

import { EventClickArg } from '@fullcalendar/core/index.js'
import { EventImpl } from '@fullcalendar/core/internal'
import FullCalendar from '@fullcalendar/react'

import { MemberRole } from '@/helpers/enum/member-role.enum'
import { IEventMember } from '@/helpers/interface/event.interface'
import useCalendarStore from '@/helpers/store/calendar-store'
import useUserStore from '@/helpers/store/user-store'
import { useClickOutside } from '@mantine/hooks'
import { FaCircle } from 'react-icons/fa'
import DeleteEventModal from './modals/delete-event-modal'
import UpdateEventModal from './modals/update-event-modal'

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
	const [position, setPosition] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	})
	const [deleteModal, setDeleteModal] = useState(false)
	const [updateModal, setUpdateModal] = useState(false)

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
									<ActionIcon
										variant="subtle"
										onClick={() => setUpdateModal(true)}
									>
										<FiEdit />
									</ActionIcon>
								) : null}
								<ActionIcon
									variant="subtle"
									type="submit"
									onClick={() => setDeleteModal(true)}
								>
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
			<DeleteEventModal
				opened={deleteModal}
				onClose={() => {
					setDeleteModal(false)
				}}
				event={selectedEvent}
				role={role}
				calendarRef={calendarRef}
			/>
			<UpdateEventModal
				opened={updateModal}
				onClose={() => setUpdateModal(false)}
				event={selectedEvent}
				calendarRef={calendarRef}
			/>
		</React.Fragment>
	)
}

export default EventPopover
