import { Avatar, Indicator, Menu } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CiLogout } from 'react-icons/ci'
import { FaUserPlus } from 'react-icons/fa'
import { GoTrash } from 'react-icons/go'
import { GrUpdate } from 'react-icons/gr'
import { LuImagePlus } from 'react-icons/lu'

import { apiClient, ApiError } from '@/shared/api/axios'
import { InvitationStatus } from '@/shared/enum'
import { showNotification } from '@/shared/helpers/show-notification'
import { ICalendar, IEvent } from '@/shared/interface'
import useCalendarStore from '@/shared/store/calendar-store'
import useUserStore from '@/shared/store/user-store'

import DeleteAccountModal from './modals/delete-account-modal'
import InvitesModal from './modals/invites-modal'
import UpdateUserModal from './modals/update-user-modal'
import UploadAvatarModal from './modals/upload-avatar-modal'

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
	const [calendarInvites, setCalendarInvites] = useState<ICalendar[]>([])
	const [eventInvites, setEventInvites] = useState<IEvent[]>([])

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
		const fetchCalendarInvites = async () => {
			const { data } = await apiClient.get<ICalendar[]>('/calendars', {
				params: {
					status: InvitationStatus.INVITED,
				},
			})
			setCalendarInvites(data)
		}
		fetchCalendarInvites()
	}, [])

	useEffect(() => {
		const fetchEventInvites = async () => {
			const { data } = await apiClient.get<IEvent[]>('/events/invites')
			setEventInvites(data)
		}
		fetchEventInvites()
	}, [])

	const handleClickCalendar = useCallback(
		async (calendar: ICalendar, status: InvitationStatus) => {
			try {
				await apiClient.patch(
					`calendars/${calendar.id}/users/${user?.id}/status`,
					{ status }
				)

				if (status === InvitationStatus.ACCEPTED) {
					addCalendar(calendar)
				}

				setCalendarInvites((prev) =>
					prev.filter((invite) => invite.id !== calendar.id)
				)
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

	const handleClickEvent = useCallback(
		async (event: IEvent, status: InvitationStatus) => {
			try {
				await apiClient.patch(`events/${event.id}/members/${user?.id}/status`, {
					status,
				})

				setEventInvites((prev) =>
					prev.filter((invite) => invite.id !== event.id)
				)
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
		[user?.id]
	)

	return (
		<React.Fragment>
			<Menu>
				<Menu.Target>
					<Indicator
						inline
						disabled={calendarInvites.length + eventInvites.length === 0}
						processing
						color="red"
						size={20}
						offset={7}
						label={calendarInvites.length + eventInvites.length}
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
						onClick={() => openModal('delete')}
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
				onClickCalendar={handleClickCalendar}
				onClickEvent={handleClickEvent}
				calendars={calendarInvites}
				events={eventInvites}
			/>
		</React.Fragment>
	)
})

export default UserMenu
