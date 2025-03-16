import useStore from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'
import { Avatar, Box, Button, Divider, Flex, Stack, Text } from '@mantine/core'
import { Calendar } from '@mantine/dates'
import React from 'react'
import { IoMenu } from 'react-icons/io5'
import ThemeSwitch from '../../buttons/theme-switch'
import CalendarCheckbox from '../../calendar/calendar-checkbox'

interface NavbarContentProps {
	onClickMenu: () => void
	onOpenModal: () => void
}

const NavbarContent: React.FC<NavbarContentProps> = ({
	onClickMenu,
	onOpenModal,
}) => {
	const { user } = useStore()
	const { isMobile } = useResponsive()

	return (
		<Stack m="md" justify="space-between" h={isMobile ? '100%' : 'auto'}>
			<Stack>
				<Flex>
					{!isMobile && (
						<Box pr="md">
							<IoMenu onClick={onClickMenu} size={28} />
						</Box>
					)}
					{!isMobile && <ThemeSwitch />}
				</Flex>
				<Button onClick={onOpenModal} mt={isMobile ? '0' : 'xl'}>
					Create
				</Button>
				<Calendar />
				<CalendarCheckbox />
			</Stack>
			<Stack>
				<Divider mt="xl" />
				<Flex>
					<Avatar src={user?.avatar} alt={user?.username} size="lg" />
					<Stack>
						<Text>{user?.username}</Text>
						<Text>{user?.email}</Text>
					</Stack>
				</Flex>
			</Stack>
		</Stack>
	)
}

export default NavbarContent
