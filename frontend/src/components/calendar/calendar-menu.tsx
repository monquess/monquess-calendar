import React, { useEffect, useState } from 'react'
import { ActionIcon, Menu } from '@mantine/core'

import { FcInvite } from 'react-icons/fc'
import { GoTrash } from 'react-icons/go'
import { GrUpdate } from 'react-icons/gr'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { IoMdPeople } from 'react-icons/io'

import { CalendarType, MemberRole } from '@/shared/enum'
import { ICalendar, ICalendarMember } from '@/shared/interface'

import CalendarMemberModal from './modals/calendar-member-modal'
import DeleteCalendarModal from './modals/delete-calendar.modal'
import InviteMemberModal from './modals/invite-member-modal'
import UpdateCalendarModal from './modals/update-calendar-modal'
import useUserStore from '@/shared/store/user-store'

interface CalendarMenuProps {
	calendar: ICalendar
}

const CalendarMenu: React.FC<CalendarMenuProps> = ({ calendar }) => {
	const { user } = useUserStore()
	const [openUpdateModal, setUpdateModal] = useState(false)
	const [openDeleteModal, setDeleteModal] = useState(false)
	const [openInviteModal, setInviteModal] = useState(false)
	const [openMembersModal, setMembersModal] = useState(false)

	const [role, setRole] = useState<MemberRole>()

	useEffect(() => {
		if (calendar) {
			const member = calendar.users?.find(
				(member: ICalendarMember) => member.userId === user?.id
			)

			console.log(member)
			if (member) {
				setRole(member.role)
			}
		}
	}, [calendar, user])

	return (
		<>
			<Menu>
				<Menu.Target>
					<ActionIcon variant="transparent" size={20} radius="xl" color="dark">
						<HiOutlineDotsHorizontal size={18} />
					</ActionIcon>
				</Menu.Target>
				<Menu.Dropdown>
					{calendar.type !== CalendarType.HOLIDAYS && (
						<>
							{role !== MemberRole.VIEWER && (
								<>
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
								</>
							)}
							<Menu.Item
								leftSection={<IoMdPeople size={14} />}
								onClick={() => setMembersModal(true)}
							>
								Members
							</Menu.Item>
						</>
					)}
					<Menu.Divider />
					<Menu.Item
						color="red"
						leftSection={<GoTrash size={14} />}
						onClick={() => setDeleteModal(true)}
					>
						{role == MemberRole.OWNER ? 'Delete' : 'Leave'}
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
}

export default React.memo(CalendarMenu)
