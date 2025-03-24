import { ICalendar } from '@/helpers/interface/calendar.interface'
import { ActionIcon, Menu } from '@mantine/core'
import React, { useState } from 'react'
import { FcInvite } from 'react-icons/fc'
import { GoTrash } from 'react-icons/go'
import { GrUpdate } from 'react-icons/gr'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { IoMdPeople } from 'react-icons/io'
import CalendarMemberModal from './modals/calendar-member-modal'
import DeleteCalendarModal from './modals/delete-calendar.modal'
import InviteMemberModal from './modals/invite-member-modal'
import UpdateCalendarModal from './modals/update-calendar-modal'

interface CalendarMenuProps {
	calendar: ICalendar
}

const CalendarMenu: React.FC<CalendarMenuProps> = React.memo(({ calendar }) => {
	const [openUpdateModal, setUpdateModal] = useState(false)
	const [openDeleteModal, setDeleteModal] = useState(false)
	const [openInviteModal, setInviteModal] = useState(false)
	const [openMembersModal, setMembersModal] = useState(false)

	return (
		<>
			<Menu>
				<Menu.Target>
					<ActionIcon variant="transparent" size={20} radius="xl" color="dark">
						<HiOutlineDotsHorizontal size={18} />
					</ActionIcon>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Item
						leftSection={<GrUpdate size={14} />}
						onClick={() => setUpdateModal(true)}
					>
						Update info
					</Menu.Item>
					<Menu.Item
						leftSection={<FcInvite size={14} />}
						onClick={() => setInviteModal(true)}
					>
						Invite member
					</Menu.Item>
					<Menu.Item
						leftSection={<IoMdPeople size={14} />}
						onClick={() => setMembersModal(true)}
					>
						Members
					</Menu.Item>
					<Menu.Divider />
					<Menu.Item
						color="red"
						leftSection={<GoTrash size={14} />}
						onClick={() => setDeleteModal(true)}
					>
						Delete calendar
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
			<UpdateCalendarModal
				calendar={calendar}
				opened={openUpdateModal}
				onClose={() => setUpdateModal(false)}
			/>
			<DeleteCalendarModal
				calendar={calendar}
				opened={openDeleteModal}
				onClose={() => setDeleteModal(false)}
			/>
			<InviteMemberModal
				calendar={calendar}
				opened={openInviteModal}
				onClose={() => setInviteModal(false)}
			/>
			<CalendarMemberModal
				calendar={calendar}
				opened={openMembersModal}
				onClose={() => setMembersModal(false)}
			/>
		</>
	)
})

export default CalendarMenu
