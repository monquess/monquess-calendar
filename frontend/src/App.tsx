import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/login-page'
import RegisterPage from './pages/auth/register-page'
import ResetPasswordPage from './pages/auth/reset-password-page'
import VerifyPage from './pages/auth/verify-account-page'
import HomePage from './pages/home-page'
import { theme } from './theme'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

function App() {
	return (
		<MantineProvider defaultColorScheme="auto" theme={theme}>
			<Notifications />
			<Routes>
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/" element={<HomePage />} />
				<Route path="/reset-password" element={<ResetPasswordPage />} />
				<Route path="/verify" element={<VerifyPage />} />
			</Routes>
		</MantineProvider>
	)
}

export default App

//switcha236@gmail.com
