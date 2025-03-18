import UserMenu from '@/components/user/user-menu'
import useStore from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'
import { Box, Button, Divider, Flex, Stack, Text } from '@mantine/core'
import { Calendar } from '@mantine/dates'
import { useMediaQuery } from '@mantine/hooks'
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
	const isSmallMobile = useMediaQuery('(max-width: 420px)')

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
				<Divider />
				<Flex align="center" gap="md">
					<UserMenu />
					<Box mb={isSmallMobile ? 'xs' : '0'}>
						<Text fw={700}>{user?.username}</Text>
						<Text c="dimmed">{user?.email}</Text>
					</Box>
				</Flex>
			</Stack>
		</Stack>
	)
}

export default NavbarContent
