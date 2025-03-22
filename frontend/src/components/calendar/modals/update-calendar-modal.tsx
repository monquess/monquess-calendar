import React, { useState } from 'react'
import {
	Button,
	ColorInput,
	Modal,
	Stack,
	Text,
	TextInput,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { AxiosError } from 'axios'
import apiClient from '@/helpers/axios'
import { ICalendar } from '@/helpers/interface/calendar-interface'
import { showNotification } from '@/helpers/show-notification'
import { CalendarCreateSchema } from '@/helpers/validations/calendar-create-schema'
import { useResponsive } from '@/hooks/use-responsive'

interface updateCalendarModalProps {
	opened: boolean
	onClose: () => void
	calendar: ICalendar
}

const UpdateCalendarModal: React.FC<updateCalendarModalProps> = React.memo(
	({ opened, onClose, calendar }) => {
		const { isMobile } = useResponsive()
		const [loading, setLoading] = useState(false)

		const form = useForm({
			mode: 'uncontrolled',
			initialValues: {
				name: calendar.name,
				description: calendar.description,
				color: calendar.color,
			},
			validate: zodResolver(CalendarCreateSchema),
		})

		const handleSubmit = async (values: typeof form.values) => {
			try {
				setLoading(true)
				await apiClient.patch(`/calendars/${calendar.id}`, values)

				showNotification(
					'Calendar update',
					'Your calendar has been successfully updated.',
					'green'
				)
				onClose()
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					showNotification('Calendar update error', error.message, 'red')
				}
			} finally {
				setLoading(false)
			}
		}

		return (
			<Modal
				opened={opened}
				onClose={onClose}
				title="Update calendar"
				size={isMobile ? 'sm' : 'md'}
				centered
				closeOnClickOutside={false}
				zIndex={1000}
			>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack pos="relative">
						<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
							Update a calendar for yourself or your team. Choose a name, add a
							short description, and pick a color to make it uniquely yours!
						</Text>
						<TextInput
							label="Name"
							key={form.key('name')}
							{...form.getInputProps('name')}
						></TextInput>
						<TextInput
							label="Description"
							key={form.key('description')}
							{...form.getInputProps('description')}
						></TextInput>
						<ColorInput
							label="Pick color"
							key={form.key('color')}
							{...form.getInputProps('color')}
							styles={{
								dropdown: { zIndex: 1100 },
							}}
						/>
						<Button type="submit" variant="outline" loading={loading}>
							Update info
						</Button>
					</Stack>
				</form>
			</Modal>
		)
	}
)

export default UpdateCalendarModal
