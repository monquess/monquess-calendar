import React, { useState } from 'react'
import { Button, FileInput, Modal, Stack, Text } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

import { IoImageOutline } from 'react-icons/io5'

import { apiClient, ApiError } from '@/shared/api/axios'
import { showNotification } from '@/shared/helpers/show-notification'
import useStore, { User } from '@/shared/store/user-store'
import { avatarSchema } from '@/shared/validations'

import { useResponsive } from '@/hooks/use-responsive'

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

				const { data } = await apiClient.patch<User>(
					`/users/${user?.id}/avatar`,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				)

				showNotification(
					'Avatar upload',
					'Avatar uploaded successfully.',
					'green'
				)
				updateUser(data)
				onClose()
			} catch (error) {
				if (error instanceof ApiError && error.response) {
					showNotification('Avatar upload error', error.message, 'red')
				}
			} finally {
				form.reset()
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
							label="Select new profile picture"
							placeholder="Upload image"
							leftSection={<IoImageOutline />}
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
