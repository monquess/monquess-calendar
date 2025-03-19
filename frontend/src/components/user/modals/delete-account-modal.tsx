import apiClient from '@/helpers/axios'
import useStore from '@/helpers/store/user-store'
import { useResponsive } from '@/hooks/use-responsive'
import { Button, Flex, Modal, Stack, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface DeleteAccountModalProps {
	opened: boolean
	onClose: () => void
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = React.memo(
	({ opened, onClose }) => {
		const { isMobile } = useResponsive()
		const { user, logout } = useStore()
		const navigate = useNavigate()
		const [loading, setLoading] = useState(false)

		const form = useForm({
			mode: 'uncontrolled',
		})

		const handleSubmit = async () => {
			try {
				setLoading(true)
				await apiClient.delete(`/users/${user?.id}`)

				logout()

				notifications.show({
					title: 'Account Deletion',
					message: 'Your account has been successfully deleted.',
					withCloseButton: true,
					autoClose: 5000,
					color: 'green',
				})
				navigate('/login')
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					notifications.show({
						title: 'Account Deletion',
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
				title="Delete account"
				size={isMobile ? 'sm' : 'md'}
				centered
				closeOnClickOutside={false}
				zIndex={1000}
			>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack pos="relative">
						<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
							Deleting your account is permanent and cannot be undone. You will
							lose access to all your data.
						</Text>
						<TextInput label="Tell us why are you deleting your account?" />
						<Flex justify="space-between">
							<Button type="submit" variant="outline" onClick={() => onClose()}>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="filled"
								color="red"
								loading={loading}
							>
								Delete
							</Button>
						</Flex>
					</Stack>
				</form>
			</Modal>
		)
	}
)

export default DeleteAccountModal
