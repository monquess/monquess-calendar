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
import axios from 'axios'
import React, { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../App'
import { registerSchema } from '../../helpers/validations/register-schema'
import { useResponsive } from '../../hooks/use-responsive'
import VerificationCodeModal from './verify-code-modal'

const RegisterForm: React.FC = React.memo(() => {
	const navigate = useNavigate()
	const { isMobile } = useResponsive()
	const [verificationModalOpened, setVerificationModalOpened] =
		React.useState(false)
	const [registeredEmail, setRegisteredEmail] = React.useState('')
	const [loading, setLoading] = useState<boolean>(false)

	const form = useForm({
		mode: 'uncontrolled',
		validate: zodResolver(registerSchema),
		initialValues: {
			fullname: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	})

	const handleSubmit = async (values: typeof form.values) => {
		try {
			setLoading(true)
			await axios.post(`${API_BASE_URL}/auth/register`, {
				username: values.fullname,
				email: values.email,
				password: values.password,
			})
			setRegisteredEmail(values.email)
			setVerificationModalOpened(true)
			form.reset()
			notifications.show({
				title: 'Register',
				message: 'Register successfully, now you need to verify your account',
				withCloseButton: true,
				autoClose: 5000,
				color: 'green',
			})
		} catch (error: any) {
			notifications.show({
				title: 'Register',
				message: error.response.data.message,
				withCloseButton: true,
				autoClose: 5000,
				color: 'red',
			})
		} finally {
			setLoading(false)
		}
	}

	const handleVerify = async (token: string) => {
		try {
			await axios.post(`${API_BASE_URL}/auth/verify-email`, {
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
		} catch (error: any) {
			notifications.show({
				title: 'Verify',
				message: error.response.data.message,
				withCloseButton: true,
				autoClose: 5000,
				color: 'red',
			})
		}
	}

	return (
		<>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<TextInput
					label="Username"
					required
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('fullname')}
					{...form.getInputProps('fullname')}
				/>
				<TextInput
					label="Email"
					type="email"
					required
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('email')}
					{...form.getInputProps('email')}
				/>
				<PasswordInput
					label="Password"
					required
					mt="md"
					size={isMobile ? 'sm' : 'md'}
					key={form.key('password')}
					{...form.getInputProps('password')}
				/>
				<PasswordInput
					label="Confirm password"
					required
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
		</>
	)
})

export default RegisterForm
