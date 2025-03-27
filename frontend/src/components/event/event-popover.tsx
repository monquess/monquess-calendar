import useUserStore from '@/helpers/store/user-store'
import { ActionIcon, Divider, Group, Popover, Stack, Text } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'

import { EventClickArg } from '@fullcalendar/core/index.js'
import { EventImpl } from '@fullcalendar/core/internal'
import FullCalendar from '@fullcalendar/react'

import { MemberRole } from '@/helpers/enum/member-role.enum'
import { IEventMember } from '@/helpers/interface/event.interface'
import useCalendarStore from '@/helpers/store/calendar-store'

import DeleteEventModal from './modals/delete-event-modal'
import UpdateEventModal from './modals/update-event-modal'

import { FaCircle } from 'react-icons/fa'
import { FiEdit } from 'react-icons/fi'
import { IoMdClose } from 'react-icons/io'
import { IoCalendar } from 'react-icons/io5'
import { LuUsers } from 'react-icons/lu'
import { MdDelete, MdOutlineSubtitles } from 'react-icons/md'
import EventMemberModal from './modals/event-member-modal'

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
	const [memberModal, setMemberModal] = useState(false)

	const formatDate = (date: Date | null): string =>
		new Intl.DateTimeFormat('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		}).format(date ?? new Date())

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
		}
		const calendar = calendarRef.current

		if (calendar) {
			calendar.getApi().on('eventClick', onEventClick)
		}

		return () => {
			if (calendar) {
				calendar.getApi().off('eventClick', onEventClick)
			}
		}
	}, [calendarRef, calendars])

	if (!selectedEvent) {
		return null
	}

	return (
		<React.Fragment>
			<Popover
				opened={opened}
				onClose={() => setOpened(false)}
				position="bottom"
				width={230}
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
				shadow="xl"
			>
				<Popover.Dropdown ref={ref}>
					<Stack gap="sm">
						<Group justify="space-between">
							<Group>
								{role !== MemberRole.VIEWER && (
									<ActionIcon
										variant="subtle"
										onClick={() => setUpdateModal(true)}
									>
										<FiEdit />
									</ActionIcon>
								)}
								<ActionIcon
									variant="subtle"
									onClick={() => setDeleteModal(true)}
								>
									<MdDelete />
								</ActionIcon>
								<ActionIcon
									variant="subtle"
									onClick={() => setMemberModal(true)}
								>
									<LuUsers />
								</ActionIcon>
							</Group>
							<ActionIcon variant="subtle" onClick={() => setOpened(false)}>
								<IoMdClose />
							</ActionIcon>
						</Group>
						<Divider />
						<Group>
							<FaCircle size={16} color={selectedEvent.backgroundColor} />
							<Text size="lg" fw={600}>
								{selectedEvent.title}
							</Text>
						</Group>
						<Group align="start">
							<Stack gap={2}>
								<Text size="md">
									{formatDate(selectedEvent.start)} :{' '}
									{formatDate(selectedEvent.end)}
								</Text>
								{/* <Text size="md">{formatDate(selectedEvent.end)}</Text> */}
							</Stack>
						</Group>
						{selectedEvent.extendedProps.description && (
							<>
								<Divider />
								<Group>
									<MdOutlineSubtitles size={16} />
									<Text size="md" c="dimmed">
										{selectedEvent.extendedProps.description}
									</Text>
								</Group>
							</>
						)}
						<Divider />
						<Group>
							<IoCalendar size={16} />
							<Text fw={500} size="md" c="dimmed">
								{calendars[selectedEvent.extendedProps.calendarId]?.name}
							</Text>
						</Group>
					</Stack>
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
			<EventMemberModal
				opened={memberModal}
				onClose={() => setMemberModal(false)}
				event={selectedEvent}
			/>
		</React.Fragment>
	)
}

export default EventPopover
