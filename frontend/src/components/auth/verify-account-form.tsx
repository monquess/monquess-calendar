import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

import axios, { AxiosError } from 'axios'

import { config } from '@/config/config'
import { emailSchema } from '@/shared/validations'
import { showNotification } from '@/shared/helpers/show-notification'
import { useResponsive } from '@/hooks/use-responsive'

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
			showNotification(
				'Verify email',
				'Verify email send successfully',
				'green'
			)
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				showNotification(
					'Verification error',
					error.response.data.message,
					'red'
				)
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
			showNotification(
				'Verification',
				'You have successfully verified your account. You can now log in.',
				'green'
			)
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				showNotification(
					'Verification error',
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
