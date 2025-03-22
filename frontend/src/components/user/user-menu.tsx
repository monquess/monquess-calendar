import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CiLogout } from 'react-icons/ci'
import { GoTrash, GoUpload } from 'react-icons/go'
import { GrUpdate } from 'react-icons/gr'
import { Avatar, Menu } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import useStore from '@/helpers/store/user-store'
import DeleteAccountModal from './modals/delete-account-modal'
import UpdateUserModal from './modals/update-user-modal'
import UploadAvatarModal from './modals/upload-avatar-modal'

interface Props {
	size: string
}

const UserMenu: React.FC<Props> = React.memo(({ size }) => {
	const isSmallMobile = useMediaQuery('(max-width: 420px)')
	const { user, logout } = useStore()
	const navigate = useNavigate()
	const [deleteModal, setDeleteModal] = useState(false)
	const [updateModal, setUpdateModal] = useState(false)
	const [uploadModal, setUploadModal] = useState(false)

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	return (
		<>
			<Menu>
				<Menu.Target>
					<Avatar
						src={user?.avatar}
						alt={user?.username}
						size={size}
						mb={isSmallMobile ? 'xs' : '0'}
					/>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Item
						leftSection={<GrUpdate size={14} />}
						onClick={() => setUpdateModal(true)}
					>
						Update info
					</Menu.Item>
					<Menu.Item
						leftSection={<GoUpload size={14} />}
						onClick={() => setUploadModal(true)}
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
						onClick={() => setDeleteModal(true)}
					>
						Delete account
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
			<DeleteAccountModal
				opened={deleteModal}
				onClose={() => setDeleteModal(false)}
			/>
			<UpdateUserModal
				opened={updateModal}
				onClose={() => setUpdateModal(false)}
			/>
			<UploadAvatarModal
				opened={uploadModal}
				onClose={() => setUploadModal(false)}
			/>
		</>
	)
})

export default UserMenu
