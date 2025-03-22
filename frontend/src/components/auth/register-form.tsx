import { config } from '@/config/config'
import { registerSchema } from '@/helpers/validations/register-schema'
import { useResponsive } from '@/hooks/use-responsive'
import {
	Button,
	Divider,
	Group,
	PasswordInput,
	Text,
	TextInput,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import GoogleRecaptchaModal from './modals/google-recaptcha-modal'
import VerificationCodeModal from './modals/verify-code-modal'

import ReCAPTCHA from 'react-google-recaptcha'

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
			notifications.show({
				title: 'Register',
				message: 'Please submit Captcha',
				withCloseButton: true,
				autoClose: 5000,
				color: 'red',
			})
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
				notifications.show({
					title: 'Registration',
					message:
						'You have registered successfully. Please verify your account.',
					withCloseButton: true,
					autoClose: 5000,
					color: 'green',
				})
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					notifications.show({
						title: 'Registration',
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
				message: 'Verify successfully',
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
							<FaGoogle />
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
