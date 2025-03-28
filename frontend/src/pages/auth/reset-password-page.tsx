import { Box, Paper, Text, Title } from '@mantine/core'
import React from 'react'

import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import PasswordResetForm from '@/components/auth/reset-password-form'
import Footer from '@/components/general/footer'
import Header from '@/components/general/header'

import { useResponsive } from '@/hooks/use-responsive'

const ResetPasswordPage: React.FC = () => {
	const { isMobile } = useResponsive()
	const navigate = useNavigate()

	return (
		<Box h="100vh">
			<Header isLandingPage={false} />
			<Box
				style={{
					justifyContent: 'center',
					alignItems: 'center',
				}}
				display="flex"
				h="100vh"
				p={isMobile ? 'xs' : 'md'}
				m={isMobile ? 'lg' : '0'}
			>
				<Paper
					p={isMobile ? 'md' : 'xl'}
					m={isMobile ? 'lg' : '0'}
					w="100%"
					maw={{
						base: '100%',
						xs: '400px',
					}}
					bd="1px solid #ccc"
					radius={25}
				>
					<FaArrowLeft
						size={isMobile ? 14 : 20}
						onClick={() => navigate('/login')}
					/>
					<Title order={1} ta="center" size={isMobile ? 'h2' : 'h1'}>
						Reset password
					</Title>
					<Text size={isMobile ? 'xs' : 'sm'} mt="xs" c="dimmed">
						Enter your email address to reset your password
					</Text>
					<PasswordResetForm />
				</Paper>
			</Box>
			<Footer />
		</Box>
	)
}

export default React.memo(ResetPasswordPage)
