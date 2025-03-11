import useStore from '@/helpers/store'
import { useResponsive } from '@/hooks/use-responsive'
import { Avatar, Box, Button, Divider, Flex, Stack, Text } from '@mantine/core'
import { Calendar } from '@mantine/dates'
import React, { useEffect, useState } from 'react'
import { IoMenu } from 'react-icons/io5'
import ThemeSwitch from '../buttons/theme-switch'
import CreateCalendarModal from '../calendar/modals/create-calendar-modal'

const Navbar: React.FC = React.memo(() => {
	const [openNavbar, setNavbarOpen] = useState<boolean>(true)
	const { isMobile } = useResponsive()
	const { user } = useStore()
	const [openCreateModal, setCreateModalOpen] = useState<boolean>(false)

	useEffect(() => {
		if (isMobile) setNavbarOpen(false)
	}),
		[isMobile]

	const handleClick = () => {
		setNavbarOpen((prev) => !prev)
	}
	return (
		<>
			{!openNavbar && (
				<Box pt="md" pl="md">
					<IoMenu onClick={handleClick} size={28} />
				</Box>
			)}
			{openNavbar && (
				<Stack m="md" justify="space-between">
					<Stack>
						<Flex>
							<Box pr="md">
								<IoMenu onClick={handleClick} size={28} />
							</Box>
							<ThemeSwitch />
						</Flex>
						<Button onClick={() => setCreateModalOpen(true)}>Create</Button>
						<Calendar />
						<Text>My calendars</Text>
						<Text>Other calendars</Text>
					</Stack>
					<Stack>
						<Divider mt="xl"></Divider>
						<Flex>
							<Avatar
								src={user?.avatar}
								alt={user?.username}
								size="lg"
							></Avatar>
							<Stack>
								<Text>{user?.username}</Text>
								<Text>{user?.email}</Text>
							</Stack>
						</Flex>
					</Stack>
				</Stack>
			)}
			<CreateCalendarModal
				opened={openCreateModal}
				onClose={() => setCreateModalOpen(false)}
			/>
		</>
	)
})

export default Navbar
