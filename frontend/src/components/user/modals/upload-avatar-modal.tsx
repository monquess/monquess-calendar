import apiClient from '@/helpers/axios'
import useStore, { User } from '@/helpers/store/user-store'
import { avatarSchema } from '@/helpers/validations/avatar-schema'
import { useResponsive } from '@/hooks/use-responsive'
import { Button, FileInput, Modal, Stack, Text } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { AxiosError } from 'axios'
import React, { useState } from 'react'

interface UploadAvatarModalProps {
	opened: boolean
	onClose: () => void
}

const UploadAvatarModal: React.FC<UploadAvatarModalProps> = React.memo(
	({ opened, onClose }) => {
		const { isMobile } = useResponsive()
		const { user, updateUser } = useStore()
		const [loading, setLoading] = useState(false)

		const form = useForm({
			mode: 'uncontrolled',
			initialValues: {
				file: null as File | null,
			},
			validate: zodResolver(avatarSchema),
		})

		const handleSubmit = async (values: typeof form.values) => {
			try {
				setLoading(true)
				const formData = new FormData()

				if (values.file) {
					formData.append('file', values.file)
				}

				const response = await apiClient.patch<User>(
					`/users/${user?.id}/avatar`,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				)

				notifications.show({
					title: 'Avatar Upload',
					message: 'Avatar uploaded successfully.',
					withCloseButton: true,
					autoClose: 5000,
					color: 'green',
				})
				updateUser(response.data)
				onClose()
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					notifications.show({
						title: 'Avatar Upload',
						message: error.message,
						withCloseButton: true,
						autoClose: 5000,
						color: 'red',
					})
				}
			} finally {
				setLoading(false)
			}
		}
		return (
			<Modal
				opened={opened}
				onClose={onClose}
				title="Upload avatar"
				size={isMobile ? 'sm' : 'md'}
				centered
				closeOnClickOutside={false}
				zIndex={1000}
			>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack pos="relative">
						<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
							New day, new profile pic! Choose an image that represents you
							best.
						</Text>
						<FileInput
							label="Select new avatar"
							placeholder="Upload files"
							accept="image/png,image/jpeg,image/jpg,image/webp"
							clearable
							key={form.key('file')}
							{...form.getInputProps('file')}
						/>
						<Button type="submit" variant="outline" loading={loading}>
							Upload avatar
						</Button>
					</Stack>
				</form>
			</Modal>
		)
	}
)

export default UploadAvatarModal
