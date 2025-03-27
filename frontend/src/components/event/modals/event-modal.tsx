import React, { useEffect, useState } from 'react'
import { Modal, ActionIcon, Divider, Group, Stack, Text } from '@mantine/core'

import { FaCircle } from 'react-icons/fa'
import { FiEdit } from 'react-icons/fi'
import { IoMdClose } from 'react-icons/io'
import { IoCalendar } from 'react-icons/io5'
import { LuUsers } from 'react-icons/lu'
import { MdDelete, MdOutlineSubtitles } from 'react-icons/md'

import { EventClickArg } from '@fullcalendar/core'
import { EventImpl } from '@fullcalendar/core/internal'
import FullCalendar from '@fullcalendar/react'

import { EventType, MemberRole } from '@/shared/enum'
import { IEventMember } from '@/shared/interface'
import useCalendarStore from '@/shared/store/calendar-store'
import useUserStore from '@/shared/store/user-store'

import DeleteEventModal from './delete-event-modal'
import UpdateEventModal from './update-event-modal'
import EventMemberModal from './event-member-modal'
import { useResponsive } from '@/hooks/use-responsive'

interface EventModalProps {
	calendarRef: React.RefObject<FullCalendar | null>
}

const EventModal: React.FC<EventModalProps> = ({ calendarRef }) => {
	const { isMobile } = useResponsive()
	const { user } = useUserStore()
	const { calendars } = useCalendarStore()
	const [opened, setOpened] = useState(false)
	const [selectedEvent, setSelectedEvent] = useState<EventImpl | null>(null)
	const [role, setRole] = useState<MemberRole>()

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
			const member = selectedEvent.extendedProps.members?.find(
				(member: IEventMember) => member.userId === user?.id
			)
			if (member) {
				setRole(member.role)
			}
		}
	}, [selectedEvent, user])

	useEffect(() => {
		const onEventClick = (arg: EventClickArg) => {
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
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				size={isMobile ? 'sm' : 'md'}
				centered={true}
				withCloseButton={false}
				shadow="xl"
				zIndex={1000}
			>
				<Stack gap="sm">
					<Group justify="space-between">
						<Group>
							{selectedEvent.extendedProps.type !== EventType.HOLIDAY && (
								<>
									<ActionIcon
										variant="subtle"
										onClick={() => setMemberModal(true)}
									>
										<LuUsers />
									</ActionIcon>
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
								</>
							)}
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
								{formatDate(selectedEvent.start)}
								{' - '}
								{formatDate(selectedEvent.end)}
							</Text>
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
			</Modal>
			<DeleteEventModal
				opened={deleteModal}
				onClose={() => {
					setOpened(false)
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

export default React.memo(EventModal)
