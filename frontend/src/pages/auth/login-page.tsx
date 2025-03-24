import LoginForm from '@/components/auth/login-form'
import Footer from '@/components/general/footer'
import Header from '@/components/general/header'
import useUserStore from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'
import { Box, Paper, Title } from '@mantine/core'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage: React.FC = React.memo(() => {
	const { isMobile } = useResponsive()
	const navigate = useNavigate()
	const { user } = useUserStore()

	useEffect(() => {
		if (user) navigate('/')
	})

	return (
		<Box h="100vh">
			<Header />
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
					<Title order={1} mb="md" ta="center" size={isMobile ? 'h2' : 'h1'}>
						Sign in
					</Title>
					<LoginForm />
				</Paper>
			</Box>
			<Footer />
		</Box>
	)
})

export default LoginPage
