import apiClient from '@/helpers/axios'
import { CalendarCreateSchema } from '@/helpers/validations/calendar-create-schema'
import { Button, ColorInput, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { AxiosError } from 'axios'
import React, { useState } from 'react'

interface createCalendarFormProps {
	onClose: () => void
}

const CreateCalendarDefaultForm: React.FC<createCalendarFormProps> = React.memo(
	({ onClose }) => {
		const [loading, setLoading] = useState(false)

		const form = useForm({
			mode: 'uncontrolled',
			initialValues: {
				name: '',
				description: '',
				color: '',
			},
			validate: zodResolver(CalendarCreateSchema),
		})

		const handleSubmit = async (values: typeof form.values) => {
			try {
				setLoading(true)
				await apiClient.post('/calendars', values)
				notifications.show({
					title: 'Shared Calendar Created',
					message: `Calendar "${values.name}" has been successfully created.`,
					withCloseButton: true,
					autoClose: 5000,
					color: 'green',
				})
				onClose()
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					notifications.show({
						title: 'Shared Calendar Created',
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
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack pos="relative">
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
						Create
					</Button>
				</Stack>
			</form>
		)
	}
)

export default CreateCalendarDefaultForm
