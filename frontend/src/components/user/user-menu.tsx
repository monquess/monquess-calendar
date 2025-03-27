import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Indicator, Menu } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

import { CiLogout } from 'react-icons/ci'
import { GoTrash } from 'react-icons/go'
import { GrUpdate } from 'react-icons/gr'
import { FaUserPlus } from 'react-icons/fa'
import { LuImagePlus } from 'react-icons/lu'

import useCalendarStore from '@/shared/store/calendar-store'
import useUserStore from '@/shared/store/user-store'
import { ICalendar } from '@/shared/interface'
import { apiClient, ApiError } from '@/shared/api/axios'
import { InvitationStatus } from '@/shared/enum'
import { showNotification } from '@/shared/helpers/show-notification'

import DeleteAccountModal from './modals/delete-account-modal'
import UpdateUserModal from './modals/update-user-modal'
import UploadAvatarModal from './modals/upload-avatar-modal'
import InvitesModal from './modals/invites-modal'

interface ModalState {
	delete: boolean
	update: boolean
	avatar: boolean
	invites: boolean
}

interface ModalAction {
	type: 'OPEN' | 'CLOSE'
	modal: keyof ModalState
}

interface UserMenuProps {
	size: string
}

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
	switch (action.type) {
		case 'OPEN':
			return { ...state, [action.modal]: true }
		case 'CLOSE':
			return { ...state, [action.modal]: false }
		default:
			return state
	}
}

const UserMenu: React.FC<UserMenuProps> = React.memo(({ size }) => {
	const isSmallMobile = useMediaQuery('(max-width: 420px)')
	const { user, logout } = useUserStore()
	const { setCalendars, addCalendar } = useCalendarStore()
	const navigate = useNavigate()
	const [modals, dispatch] = useReducer(modalReducer, {
		delete: false,
		update: false,
		avatar: false,
		invites: false,
	})
	const [invites, setInvites] = useState<ICalendar[]>([])

	const openModal = (modal: keyof ModalState) => {
		dispatch({ type: 'OPEN', modal })
	}
	const closeModal = (modal: keyof ModalState) => {
		dispatch({ type: 'CLOSE', modal })
	}

	const handleLogout = () => {
		logout()
		setCalendars([])
		navigate('/login')
	}

	useEffect(() => {
		const fetchInvites = async () => {
			const { data } = await apiClient.get<ICalendar[]>('/calendars', {
				params: {
					status: InvitationStatus.INVITED,
				},
			})
			setInvites(data)
		}
		fetchInvites()
	}, [])

	const handleClick = useCallback(
		async (calendar: ICalendar, status: InvitationStatus) => {
			try {
				await apiClient.patch(
					`calendars/${calendar.id}/users/${user?.id}/status`,
					{ status }
				)

				if (status === InvitationStatus.ACCEPTED) {
					addCalendar(calendar)
				}

				setInvites((prev) => prev.filter((invite) => invite.id !== calendar.id))
				showNotification(
					'Invitation accept',
					`Invitation has been successfully ${status.toLowerCase()}`,
					'green'
				)
			} catch (error) {
				if (error instanceof ApiError && error.response) {
					showNotification('Error', error.message, 'red')
				}
			}
		},
		[addCalendar, user?.id]
	)

	return (
		<React.Fragment>
			<Menu>
				<Menu.Target>
					<Indicator
						inline
						disabled={invites.length === 0}
						processing
						color="red"
						size={20}
						offset={7}
						label={invites.length}
					>
						<Avatar
							src={user?.avatar}
							alt={user?.username}
							size={size}
							mb={isSmallMobile ? 'xs' : '0'}
						/>
					</Indicator>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Item
						leftSection={<GrUpdate size={14} />}
						onClick={() => openModal('update')}
					>
						Update info
					</Menu.Item>
					<Menu.Item
						leftSection={<FaUserPlus size={14} />}
						onClick={() => openModal('invites')}
					>
						Invites
					</Menu.Item>
					<Menu.Item
						leftSection={<LuImagePlus size={14} />}
						onClick={() => openModal('avatar')}
					>
						Update avatar
					</Menu.Item>
					<Menu.Item
						leftSection={<CiLogout size={14} />}
						onClick={handleLogout}
					>
						Logout
					</Menu.Item>
					<Menu.Divider />
					<Menu.Item
						color="red"
						leftSection={<GoTrash size={14} />}
						onClick={() => openModal('invites')}
					>
						Delete account
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
			<DeleteAccountModal
				opened={modals.delete}
				onClose={() => closeModal('delete')}
			/>
			<UpdateUserModal
				opened={modals.update}
				onClose={() => closeModal('update')}
			/>
			<UploadAvatarModal
				opened={modals.avatar}
				onClose={() => closeModal('avatar')}
			/>
			<InvitesModal
				opened={modals.invites}
				onClose={() => closeModal('invites')}
				onClick={handleClick}
				calendars={invites}
			/>
		</React.Fragment>
	)
})

export default UserMenu
