import { notifications } from '@mantine/notifications'

export const showNotification = (
	title: string,
	message: string,
	color: string
) => {
	notifications.show({
		title,
		message,
		withCloseButton: true,
		autoClose: 5000,
		color,
	})
}
