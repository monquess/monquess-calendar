import { config } from '@/config/config'
import useStore from '@/helpers/store/user-store'
import { schemaLogin } from '@/helpers/validations/login-schema'
import { useResponsive } from '@/hooks/use-responsive'
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
import { notifications } from '@mantine/notifications'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { FaGoogle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import GoogleRecaptchaModal from './modals/google-recaptcha-modal'

const LoginForm: React.FC = React.memo(() => {
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
			notifications.show({
				title: 'Login',
				message: 'Please submit Captcha',
				withCloseButton: true,
				autoClose: 5000,
				color: 'red',
			})
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
						headers: {
							'x-recaptcha-token': recaptcha.current.getValue(),
						},
					}
				)
				useStore.getState().login(response.data.user, response.data.accessToken)
				form.reset()
				navigate('/')
				notifications.show({
					title: 'Login',
					message: `Welcome, ${response.data.user.username}!`,
					withCloseButton: true,
					autoClose: 5000,
					color: 'green',
					position: 'top-center',
				})
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					notifications.show({
						title: 'Login',
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
})

export default LoginForm
