import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { Route, Routes } from 'react-router-dom'

import ProtectedRoute from './components/general/protected-route'

import GoogleAuthSuccessPage from './pages/auth/google-success-page'
import LoginPage from './pages/auth/login-page'
import RegisterPage from './pages/auth/register-page'
import ResetPasswordPage from './pages/auth/reset-password-page'
import VerifyPage from './pages/auth/verify-account-page'
import HomePage from './pages/home-page'
import NotFound from './pages/not-found-page'

import { theme } from './theme'

import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import LandingPage from './pages/landing-page'

function App() {
	return (
		<MantineProvider defaultColorScheme="auto" theme={theme}>
			<Notifications zIndex={5000} />
			<Routes>
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route
					path="/home"
					element={
						<ProtectedRoute>
							<HomePage />
						</ProtectedRoute>
					}
				/>
				<Route path="/google-success" element={<GoogleAuthSuccessPage />} />
				<Route path="/reset-password" element={<ResetPasswordPage />} />
				<Route path="/verify" element={<VerifyPage />} />
				<Route path="/" element={<LandingPage />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</MantineProvider>
	)
}

export default App
