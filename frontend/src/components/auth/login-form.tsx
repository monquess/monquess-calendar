import {
	Button,
	Divider,
	Group,
	PasswordInput,
	Stack,
	Text,
	TextInput,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FcGoogle } from 'react-icons/fc'

import axios, { AxiosError } from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'

import { config } from '@/config/config'
import { useResponsive } from '@/hooks/use-responsive'
import { showNotification } from '@/shared/helpers/show-notification'
import useUserStore from '@/shared/store/user-store'
import { schemaLogin } from '@/shared/validations'

import GoogleRecaptchaModal from './modals/google-recaptcha-modal'

const LoginForm: React.FC = () => {
	const { isMobile } = useResponsive()
	const navigate = useNavigate()
	const [loading, setLoading] = useState<boolean>(false)
	const [recaptchaModalOpened, setRecaptchaModalOpened] =
		useState<boolean>(false)

	const recaptcha = React.useRef<ReCAPTCHA>(null)

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			email: '',
			password: '',
		},
		validate: zodResolver(schemaLogin),
	})

	const handleCaptchaSubmit = () => {
		const values = form.getValues()
		handleSubmit(values)
		setRecaptchaModalOpened(false)
	}

	const handleSubmit = async (values: typeof form.values) => {
		if (!recaptcha.current?.getValue()) {
			showNotification('Login', 'Please submit Captcha', 'red')
		} else {
			try {
				setLoading(true)
				const response = await axios.post(
					`${config.API_BASE_URL}/auth/login`,
					{
						email: values.email,
						password: values.password,
					},
					{
						withCredentials: true,
						headers: {
							'x-recaptcha-token': recaptcha.current.getValue(),
						},
					}
				)
				useUserStore
					.getState()
					.login(response.data.user, response.data.accessToken)
				form.reset()
				navigate('/home')
				showNotification(
					'Login',
					`Welcome, ${response.data.user.username}!`,
					'green'
				)
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					showNotification('Login error', error.response.data.message, 'red')
				}
			} finally {
				setLoading(false)
			}
		}
	}

	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					const formError = form.validate()
					if (!formError.hasErrors) setRecaptchaModalOpened(true)
				}}
			>
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
				<Divider
					my="lg"
					label="or continue with"
					labelPosition="center"
				></Divider>
				<Group mt={isMobile ? 'sm' : 'md'} justify="center" grow={isMobile}>
					<Button
						variant="light"
						color="gray"
						size={isMobile ? 'xs' : 'sm'}
						w="100%"
						href={`${config.API_BASE_URL}/auth/google`}
						component="a"
					>
						<Group gap={6} justify="center">
							<FcGoogle />
							Google
						</Group>
					</Button>
				</Group>
				<Stack mt="sm" justify="space-between">
					<Text
						size={isMobile ? 'xs' : 'sm'}
						ta="right"
						component="a"
						href="/reset-password"
						style={{ textDecoration: 'none' }}
					>
						Forgot password?
					</Text>
				</Stack>
				<Button
					type="submit"
					fullWidth
					mt={isMobile ? 'lg' : 'xl'}
					size={isMobile ? 'sm' : 'md'}
					loading={loading}
				>
					Login
				</Button>
				<Text size={isMobile ? 'xs' : 'sm'} ta="center" mt="sm">
					Don't have an account?{' '}
					<Text
						component="a"
						href="/register"
						style={{ textDecoration: 'none' }}
						inherit
						c="blue"
					>
						Register
					</Text>
				</Text>
			</form>
			<GoogleRecaptchaModal
				opened={recaptchaModalOpened}
				onClose={() => setRecaptchaModalOpened(false)}
				ref={recaptcha}
				onSubmit={handleCaptchaSubmit}
			/>
		</>
	)
}

export default React.memo(LoginForm)
