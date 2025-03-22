import React, { useEffect, useState } from 'react'
import { IoMenu } from 'react-icons/io5'
import { Box, Drawer, Flex } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import FullCalendar from '@fullcalendar/react'
import ThemeSwitch from '@/components/buttons/theme-switch'
import UserMenu from '@/components/user/user-menu'
import { useResponsive } from '@/hooks/use-responsive'
import CreateCalendarModal from '../../calendar/modals/create-calendar-modal'
import NavbarContent from './navbar-content'

interface NavbarProps {
	onToggle: () => void
	calendarRef: React.RefObject<FullCalendar | null>
}

const Navbar: React.FC<NavbarProps> = React.memo(
	({ onToggle, calendarRef }) => {
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
			if (isMobile) {
				close()
			}
			onToggle()
		}

		return (
			<>
				{(isMobile || !openNavbar) && (
					<Flex pt="md" pl="md" justify="space-between">
						<IoMenu onClick={handleClick} size={28} />
						{isMobile && (
							<Flex mr="md" align="center">
								<UserMenu size="sm" />
							</Flex>
						)}
					</Flex>
				)}
				{isMobile ? (
					// <Drawer
					// 	opened={opened}
					// 	onClose={handleCloseClick}
					// 	title="Monquees Calendar"
					// 	size="auto"
					// >
					// 	<NavbarContent
					// 		onClickMenu={handleClick}
					// 		onOpenModal={() => setCreateModalOpen(true)}
					// 	/>
					// </Drawer>
					<Drawer.Root opened={opened} onClose={handleCloseClick} size="auto">
						<Drawer.Overlay />
						<Drawer.Content>
							<Drawer.Header>
								<Drawer.Title>Monquees Calendar</Drawer.Title>
								<Box pl="xl">
									<ThemeSwitch />
								</Box>
								<Drawer.CloseButton />
							</Drawer.Header>
							<Drawer.Body h="90%">
								<NavbarContent
									calendarRef={calendarRef}
									onClickMenu={handleClick}
									onOpenModal={() => setCreateModalOpen(true)}
								/>
							</Drawer.Body>
						</Drawer.Content>
					</Drawer.Root>
				) : (
					openNavbar && (
						<NavbarContent
							calendarRef={calendarRef}
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
	}
)

export default Navbar
