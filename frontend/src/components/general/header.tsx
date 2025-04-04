import {
	ActionIcon,
	Box,
	Button,
	Group,
	Menu,
	Text,
	useMantineColorScheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { FaBars, FaCalendarAlt } from 'react-icons/fa'

import { useResponsive } from '@/hooks/use-responsive'
import ThemeSwitch from '../buttons/theme-switch'

interface Props {
	isLandingPage: boolean
}

const Header: React.FC<Props> = React.memo(({ isLandingPage }) => {
	const { isMobile } = useResponsive()
	const isMobileSmall = useMediaQuery('(max-width: 320px)')
	const mobileHeight = useMediaQuery('(max-height: 720px)')
	const { colorScheme } = useMantineColorScheme()
	const navigate = useNavigate()

	return (
		<Box
			pos={mobileHeight ? 'relative' : 'fixed'}
			w="100%"
			bg="#222831"
			c="white"
			bd="0 1px solid #393E46"
			mt={isMobile ? (mobileHeight ? '0' : '-20') : '0'}
		>
			<header>
				<Group justify="space-between" p="md">
					<Group>
						<FaCalendarAlt size={isMobile ? 16 : 20} />
						{isMobileSmall ? (
							<Text fw={500}>
								Monquees <br />
								Calendar
							</Text>
						) : (
							<Text fw={500} onClick={() => navigate('/')}>
								Monquees Calendar
							</Text>
						)}
					</Group>

					{isMobile ? (
						<Group justify="space-between">
							<ThemeSwitch />
							{!isLandingPage && (
								<Menu shadow="md" width={200} position="bottom-end">
									<Menu.Target>
										<ActionIcon
											variant="subtle"
											aria-label="Open menu"
											c="white"
										>
											<FaBars size={20} />
										</ActionIcon>
									</Menu.Target>
									<Menu.Dropdown>
										<Menu.Item>
											<Button
												fullWidth
												variant="filled"
												color={colorScheme === 'dark' ? 'dark.4' : '#222831'}
												onClick={() => navigate('/verify')}
											>
												Verify account
											</Button>
										</Menu.Item>
									</Menu.Dropdown>
								</Menu>
							)}
						</Group>
					) : (
						<Group gap="sm">
							{!isLandingPage && (
								<Button
									variant="filled"
									color={colorScheme === 'dark' ? '#222831' : 'light'}
									onClick={() => navigate('/verify')}
								>
									Verify account
								</Button>
							)}
							<ThemeSwitch />
						</Group>
					)}
				</Group>
			</header>
		</Box>
	)
})

export default Header
