import { Button, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../helpers/backend-port'
import { emailSchema } from '../../helpers/validations/reset-password-schema'
import { useResponsive } from '../../hooks/use-responsive'
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
			await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
				email: values.email,
			})
			setRegisteredEmail(values.email)
			setVerificationModalOpened(true)
			form.reset()
			notifications.show({
				title: 'Send reset password email',
				message: `Reset password email send successfully to ${values.email}`,
				withCloseButton: true,
				autoClose: 5000,
				color: 'green',
			})
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				notifications.show({
					title: 'Send reset password email',
					message: error.response.data.message,
					withCloseButton: true,
					autoClose: 5000,
					color: 'red',
				})
			}
		} finally {
			setLoading(false)
		}
	}

	const handleSend = async (token: string, password: string) => {
		try {
			await axios.post(`${API_BASE_URL}/auth/reset-password`, {
				token,
				email: registeredEmail,
				password,
			})
			navigate('/login')
			notifications.show({
				title: 'Reset password',
				message:
					'Password reset successfully, you can now login to your account',
				withCloseButton: true,
				autoClose: 5000,
				color: 'green',
			})
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				notifications.show({
					title: 'Reset password',
					message: error.response.data.message,
					withCloseButton: true,
					autoClose: 5000,
					color: 'red',
				})
			}
		}
	}

	return (
		<>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<TextInput
					type="email"
					required
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
