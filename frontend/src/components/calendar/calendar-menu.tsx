import { ActionIcon, Menu } from '@mantine/core'
import React, { useState } from 'react'
import { FcInvite } from 'react-icons/fc'
import { GoTrash } from 'react-icons/go'
import { GrUpdate } from 'react-icons/gr'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import DeleteCalendarModal from './modals/delete-calendar.modal'
import UpdateCalendarModal from './modals/update-calendar-modal'

interface Calendar {
	id: number
	isPersonal: boolean
	name: string
	description?: string
	color: string
	createdAt: string
}

interface CalendarMenuProps {
	calendar: Calendar
}

const CalendarMenu: React.FC<CalendarMenuProps> = React.memo(({ calendar }) => {
	const [openUpdateModal, setOpenUpdateModal] = useState(false)
	const [openDeleteModal, setDeleteUpdateModal] = useState(false)

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
						onClick={() => setOpenUpdateModal(true)}
					>
						Update info
					</Menu.Item>
					<Menu.Item leftSection={<FcInvite size={14} />}>
						Invite member
					</Menu.Item>
					<Menu.Divider />
					<Menu.Item
						color="red"
						leftSection={<GoTrash size={14} />}
						onClick={() => setDeleteUpdateModal(true)}
					>
						Delete calendar
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
			<UpdateCalendarModal
				calendar={calendar}
				opened={openUpdateModal}
				onClose={() => setOpenUpdateModal(false)}
			/>
			<DeleteCalendarModal
				calendar={calendar}
				opened={openDeleteModal}
				onClose={() => setDeleteUpdateModal(false)}
			/>
		</>
	)
})

export default CalendarMenu
