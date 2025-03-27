import React, { useState } from 'react'
import { Button, Modal, Stack, Text, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import useStore, { User } from '@/shared/store/user-store'
import { updateUserSchema } from '@/shared/validations'

import { useResponsive } from '@/hooks/use-responsive'

interface updateUserModalProps {
	opened: boolean
	onClose: () => void
}

const UpdateUserModal: React.FC<updateUserModalProps> = ({
	opened,
	onClose,
}) => {
	const { isMobile } = useResponsive()
	const { user, updateUser } = useStore()
	const [loading, setLoading] = useState(false)

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			username: user?.username,
			email: user?.email,
		},
		validate: zodResolver(updateUserSchema),
	})

	const handleSubmit = async (values: typeof form.values) => {
		try {
			setLoading(true)
			const { data } = await apiClient.patch<User>(`/users/${user?.id}`, values)
			updateUser(data)
			showNotification(
				'Account update',
				'Your account information has been successfully updated.',
				'green'
			)
			onClose()
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification('Account update error', error.message, 'red')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Update user info"
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack pos="relative">
					<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
						You can update your email or username below. Make sure to save the
						changes
					</Text>
					<TextInput
						label="Username"
						key={form.key('username')}
						{...form.getInputProps('username')}
					></TextInput>
					<TextInput
						label="Email"
						key={form.key('email')}
						{...form.getInputProps('email')}
					></TextInput>
					<Button type="submit" variant="outline" loading={loading}>
						Save changes
					</Button>
				</Stack>
			</form>
		</Modal>
	)
}

export default React.memo(UpdateUserModal)
