import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

import axios, { AxiosError } from 'axios'

import { config } from '@/config/config'
import { emailSchema } from '@/shared/validations'
import { showNotification } from '@/shared/helpers/show-notification'
import { useResponsive } from '@/hooks/use-responsive'

import ResetPasswordModal from './modals/reset-password-modal'

const PasswordResetForm: React.FC = React.memo(() => {
	const navigate = useNavigate()
	const { isMobile } = useResponsive()
	const [verificationModalOpened, setVerificationModalOpened] =
		React.useState(false)
	const [registeredEmail, setRegisteredEmail] = React.useState('')
	const [loading, setLoading] = useState<boolean>(false)

	const form = useForm({
		mode: 'uncontrolled',
		validate: zodResolver(emailSchema),
		initialValues: {
			email: '',
		},
	})

	const handleSubmit = async (values: typeof form.values) => {
		try {
			setLoading(true)
			await axios.post(`${config.API_BASE_URL}/auth/forgot-password`, {
				email: values.email,
			})
			setRegisteredEmail(values.email)
			setVerificationModalOpened(true)
			form.reset()
			showNotification(
				'Password Reset Email Sent',
				`A password reset email has been successfully sent to ${values.email}.`,
				'green'
			)
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				showNotification(
					'Password reset error',
					error.response.data.message,
					'red'
				)
			}
		} finally {
			setLoading(false)
		}
	}

	const handleSend = async (token: string, password: string) => {
		try {
			await axios.post(`${config.API_BASE_URL}/auth/reset-password`, {
				token,
				email: registeredEmail,
				password,
			})
			navigate('/login')
			showNotification(
				'Reset password',
				'Password reset successfully, you can now login to your account',
				'green'
			)
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				showNotification(
					'Password reset error',
					error.response.data.message,
					'red'
				)
			}
		}
	}

	return (
		<>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<TextInput
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('email')}
					{...form.getInputProps('email')}
				/>

				<Button
					type="submit"
					fullWidth
					mt={isMobile ? 'md' : 'lg'}
					size={isMobile ? 'sm' : 'md'}
					loading={loading}
				>
					Send reset email
				</Button>
			</form>
			<ResetPasswordModal
				opened={verificationModalOpened}
				onClose={() => setVerificationModalOpened(false)}
				email={registeredEmail}
				onSend={handleSend}
			/>
		</>
	)
})

export default PasswordResetForm
