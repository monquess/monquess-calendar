import {
	Button,
	Group,
	LoadingOverlay,
	Modal,
	PasswordInput,
	PinInput,
	Stack,
	Text,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import axios, { AxiosError } from 'axios'
import React from 'react'
import { API_BASE_URL } from '../../helpers/backend-port'
import { resetPasswordSchema } from '../../helpers/validations/reset-password-schema'
import { useResponsive } from '../../hooks/use-responsive'

interface ResetPasswordModalProps {
	opened: boolean
	onClose: () => void
	email: string
	onSend: (token: string, password: string) => Promise<void>
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
	opened,
	onClose,
	email,
	onSend,
}) => {
	const { isMobile } = useResponsive()
	const [loading, setLoading] = React.useState(false)
	const [loadingResend, setLoadingResend] = React.useState(false)
	const [loadingPasswordReset, setLoadingPasswordReset] = React.useState(false)

	const form = useForm({
		initialValues: {
			code: '',
			password: '',
			confirmPassword: '',
		},
		validate: zodResolver(resetPasswordSchema),
	})

	const handleSubmit = async (values: typeof form.values) => {
		try {
			setLoadingPasswordReset(true)
			setLoading(true)
			await onSend(values.code, values.password)
			form.reset()
		} catch {
			form.setFieldError('code', 'Invalid verification code')
		} finally {
			setLoading(false)
			setLoadingPasswordReset(false)
		}
	}

	const resendCode = async () => {
		try {
			setLoadingResend(true)
			await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
				email,
			})
			form.reset()
			notifications.show({
				title: 'Resend email with verify code',
				message:
					'Email with verify code send successfully, please check your email',
				withCloseButton: true,
				autoClose: 5000,
				color: 'green',
			})
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				notifications.show({
					title: 'Resend email with verify code',
					message: error.response.data.message,
					withCloseButton: true,
					autoClose: 5000,
					color: 'red',
				})
			}
		} finally {
			setLoadingPasswordReset(false)
		}
	}
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Reset your password"
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			closeOnEscape={false}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack pos="relative">
					<LoadingOverlay visible={loading} />
					<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
						We've sent a verification code to {email}. Please enter the code
						below to reset your password.
					</Text>

					<PinInput
						length={6}
						size={isMobile ? 'md' : 'lg'}
						{...form.getInputProps('code')}
						inputMode="text"
						mx="auto"
					/>
					<PasswordInput
						label="Password"
						required
						mt="xs"
						size={isMobile ? 'sm' : 'md'}
						key={form.key('password')}
						{...form.getInputProps('password')}
					/>
					<PasswordInput
						label="Confirm password"
						required
						mt="xs"
						size={isMobile ? 'sm' : 'md'}
						key={form.key('confirmPassword')}
						{...form.getInputProps('confirmPassword')}
					/>
					<Group mt="md" justify="space-between">
						<Button
							size={isMobile ? 'sm' : 'md'}
							onClick={resendCode}
							color="#666"
							loading={loadingResend}
						>
							Resend code
						</Button>
						<Button
							type="submit"
							size={isMobile ? 'sm' : 'md'}
							loading={loadingPasswordReset}
						>
							Change password
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	)
}

export default ResetPasswordModal
