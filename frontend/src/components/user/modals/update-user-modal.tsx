import apiClient from '@/helpers/axios'
import useStore, { User } from '@/helpers/store/user-store'
import { updateUserSchema } from '@/helpers/validations/update-user-schema'
import { useResponsive } from '@/hooks/use-responsive'
import { Button, Modal, Stack, Text, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import React from 'react'

interface updateUserModalProps {
	opened: boolean
	onClose: () => void
}

const UpdateUserModal: React.FC<updateUserModalProps> = React.memo(
	({ opened, onClose }) => {
		const { isMobile } = useResponsive()
		const { user, updateUser } = useStore()

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
				const response = await apiClient.patch<User>(
					`/users/${user?.id}`,
					values
				)
				updateUser(response.data)
				onClose()
			} catch {}
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
						<Button type="submit" variant="outline">
							Save changes
						</Button>
					</Stack>
				</form>
			</Modal>
		)
	}
)

export default UpdateUserModal
