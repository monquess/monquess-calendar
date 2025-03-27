import React from 'react'
import {
	Button,
	Group,
	LoadingOverlay,
	Modal,
	PinInput,
	Stack,
	Text,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'

import axios, { AxiosError } from 'axios'

import { config } from '@/config/config'
import { verifyCodeSchema } from '@/shared/validations'
import { useResponsive } from '@/hooks/use-responsive'

interface VerificationCodeModalProps {
	opened: boolean
	onClose: () => void
	email: string
	onVerify: (code: string) => Promise<void>
}

const VerificationCodeModal: React.FC<VerificationCodeModalProps> = ({
	opened,
	onClose,
	email,
	onVerify,
}) => {
	const { isMobile } = useResponsive()
	const [loading, setLoading] = React.useState(false)
	const [loadingResend, setLoadingResend] = React.useState(false)
	const [loadingVerify, setLoadingVerify] = React.useState(false)

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			code: '',
		},
		validate: zodResolver(verifyCodeSchema),
	})

	const handleSubmit = async (values: { code: string }) => {
		try {
			setLoadingVerify(true)
			setLoading(true)
			await onVerify(values.code)
			form.reset()
		} catch {
			form.setFieldError('code', 'Invalid verification code')
		} finally {
			setLoading(false)
			setLoadingVerify(false)
		}
	}

	const resendCode = async () => {
		try {
			setLoadingResend(true)
			await axios.post(`${config.API_BASE_URL}/auth/send-verification`, {
				email,
			})
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
			setLoadingResend(false)
		}
	}
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Verify your email"
			size={isMobile ? 'sm' : 'md'}
			centered
			withCloseButton={false}
			closeOnClickOutside={false}
			closeOnEscape={false}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack pos="relative">
					<LoadingOverlay visible={loading} />
					<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
						We've sent a verification code to {email}. Please enter the code
						below to verify your account.
					</Text>

					<PinInput
						length={6}
						size={isMobile ? 'md' : 'lg'}
						{...form.getInputProps('code')}
						inputMode="text"
						mx="auto"
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
							loading={loadingVerify}
						>
							Verify
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	)
}

export default React.memo(VerificationCodeModal)
