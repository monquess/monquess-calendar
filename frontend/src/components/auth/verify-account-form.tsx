import { config } from '@/config/config'
import { emailSchema } from '@/helpers/validations/reset-password-schema'
import { useResponsive } from '@/hooks/use-responsive'
import { Button, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VerificationCodeModal from './modals/verify-code-modal'

const VerifyAccountForm: React.FC = React.memo(() => {
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
			await axios.post(`${config.API_BASE_URL}/auth/send-verification`, {
				email: values.email,
			})
			setRegisteredEmail(values.email)
			setVerificationModalOpened(true)
			form.reset()
			notifications.show({
				title: 'Verify email',
				message: 'Verify email send successfully',
				withCloseButton: true,
				autoClose: 5000,
				color: 'green',
			})
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				notifications.show({
					title: 'Verify email',
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

	const handleVerify = async (token: string) => {
		try {
			await axios.post(`${config.API_BASE_URL}/auth/verify-email`, {
				token,
				email: registeredEmail,
			})
			navigate('/login')
			notifications.show({
				title: 'Verify',
				message: 'Verify successfully, you can now login to your account',
				withCloseButton: true,
				autoClose: 5000,
				color: 'green',
			})
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				notifications.show({
					title: 'Verify',
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
					Send verify email
				</Button>
			</form>
			<VerificationCodeModal
				opened={verificationModalOpened}
				onClose={() => setVerificationModalOpened(false)}
				email={registeredEmail}
				onVerify={handleVerify}
			/>
		</>
	)
})

export default VerifyAccountForm
