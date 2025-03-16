import { useResponsive } from '@/hooks/use-responsive'
import { Box, Drawer } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import { IoMenu } from 'react-icons/io5'
import CreateCalendarModal from '../../calendar/modals/create-calendar-modal'
import NavbarContent from './navbar-content'

interface NavbarProps {
	onToggle: () => void
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onToggle }) => {
	const { isMobile } = useResponsive()
	const [openCreateModal, setCreateModalOpen] = useState(false)
	const [openNavbar, setNavbarOpen] = useState(!isMobile)
	const [opened, { open, close }] = useDisclosure(false)

	useEffect(() => {
		setNavbarOpen(!isMobile)
	}, [isMobile])

	const handleClick = () => {
		setNavbarOpen((prev) => !prev)
		if (isMobile) open()
		onToggle()
	}

	const handleCloseClick = () => {
		setNavbarOpen((prev) => !prev)
		if (isMobile) close()
		onToggle()
	}

	return (
		<>
			{(isMobile || !openNavbar) && (
				<Box pt="md" pl="md">
					<IoMenu onClick={handleClick} size={28} />
				</Box>
			)}
			{isMobile ? (
				<Drawer
					opened={opened}
					onClose={handleCloseClick}
					title="Menu"
					size="auto"
				>
					<NavbarContent
						onClickMenu={handleClick}
						onOpenModal={() => setCreateModalOpen(true)}
					/>
				</Drawer>
			) : (
				openNavbar && (
					<NavbarContent
						onClickMenu={handleClick}
						onOpenModal={() => setCreateModalOpen(true)}
					/>
				)
			)}
			<CreateCalendarModal
				opened={openCreateModal}
				onClose={() => setCreateModalOpen(false)}
			/>
		</>
	)
})

export default Navbar
