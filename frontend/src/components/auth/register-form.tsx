import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Button,
	Divider,
	Group,
	PasswordInput,
	Text,
	TextInput,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

import { FcGoogle } from 'react-icons/fc'

import axios, { AxiosError } from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'

import { config } from '@/config/config'
import { showNotification } from '@/shared/show-notification'
import { registerSchema } from '@/shared/validations'
import { useResponsive } from '@/hooks/use-responsive'

import GoogleRecaptchaModal from './modals/google-recaptcha-modal'
import VerificationCodeModal from './modals/verify-code-modal'

const RegisterForm: React.FC = React.memo(() => {
	const navigate = useNavigate()
	const { isMobile } = useResponsive()
	const [verificationModalOpened, setVerificationModalOpened] =
		React.useState(false)
	const [recaptchaModalOpened, setRecaptchaModalOpened] = React.useState(false)
	const [registeredEmail, setRegisteredEmail] = React.useState('')
	const [loading, setLoading] = useState<boolean>(false)

	const recaptcha = React.useRef<ReCAPTCHA>(null)

	const form = useForm({
		mode: 'uncontrolled',
		validate: zodResolver(registerSchema),
		initialValues: {
			fullname: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validateInputOnChange: true,
	})

	const handleCaptchaSubmit = () => {
		const values = form.getValues()
		handleSubmit(values)
		setRecaptchaModalOpened(false)
	}

	const handleSubmit = async (values: typeof form.values) => {
		if (!recaptcha.current?.getValue()) {
			showNotification('Register', 'Please submit Captcha', 'red')
		} else {
			try {
				setLoading(true)
				await axios.post(
					`${config.API_BASE_URL}/auth/register`,
					{
						username: values.fullname,
						email: values.email,
						password: values.password,
					},
					{
						headers: {
							'x-recaptcha-token': recaptcha.current.getValue(),
						},
					}
				)
				setRegisteredEmail(values.email)
				setVerificationModalOpened(true)
				form.reset()
				showNotification(
					'Registration',
					'You have registered successfully. Please verify your account.',
					'green'
				)
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					showNotification(
						'Registration error',
						error.response.data.message,
						'red'
					)
				}
			} finally {
				setLoading(false)
			}
		}
	}

	const handleVerify = async (token: string) => {
		try {
			await axios.post(`${config.API_BASE_URL}/auth/verify-email`, {
				token,
				email: registeredEmail,
			})
			navigate('/login')
			showNotification('Verification', 'Account verified successfully', 'green')
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
			<form
				onSubmit={(e) => {
					e.preventDefault()
					const formError = form.validate()
					if (!formError.hasErrors) {
						setRecaptchaModalOpened(true)
					}
				}}
			>
				<TextInput
					label="Username"
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('fullname')}
					{...form.getInputProps('fullname')}
				/>
				<TextInput
					label="Email"
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('email')}
					{...form.getInputProps('email')}
				/>
				<PasswordInput
					label="Password"
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('password')}
					{...form.getInputProps('password')}
				/>
				<PasswordInput
					label="Confirm password"
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('confirmPassword')}
					{...form.getInputProps('confirmPassword')}
				/>
				<Divider
					my="lg"
					label="or continue with"
					labelPosition="center"
				></Divider>
				<Group mt={isMobile ? 'sm' : 'md'} justify="center" grow={isMobile}>
					<Button
						type="button"
						variant="light"
						color="gray"
						size={isMobile ? 'xs' : 'sm'}
						w="100%"
					>
						<Group gap={6} justify="center">
							<FcGoogle />
							Google
						</Group>
					</Button>
				</Group>
				<Button
					type="submit"
					fullWidth
					mt={isMobile ? 'md' : 'lg'}
					size={isMobile ? 'sm' : 'md'}
					loading={loading}
				>
					Register
				</Button>
				<Text size={isMobile ? 'xs' : 'sm'} ta="center" mt="sm">
					Already have an account?{' '}
					<Text
						component="a"
						href="/login"
						style={{ textDecoration: 'none' }}
						inherit
						c="blue"
					>
						Login
					</Text>
				</Text>
			</form>
			<VerificationCodeModal
				opened={verificationModalOpened}
				onClose={() => setVerificationModalOpened(false)}
				email={registeredEmail}
				onVerify={handleVerify}
			/>
			<GoogleRecaptchaModal
				opened={recaptchaModalOpened}
				onClose={() => setRecaptchaModalOpened(false)}
				ref={recaptcha}
				onSubmit={handleCaptchaSubmit}
			/>
		</>
	)
})

export default RegisterForm
