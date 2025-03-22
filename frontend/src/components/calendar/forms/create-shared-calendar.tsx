import React, { useState } from 'react'
import apiClient from '@/helpers/axios'
import { showNotification } from '@/helpers/show-notification'
import { CalendarCreateSchema } from '@/helpers/validations/calendar-create-schema'
import { Button, ColorInput, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { AxiosError } from 'axios'

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
				showNotification(
					'Holidays calendar created',
					`Calendar "${values.name}" has been successfully created.`,
					'green'
				)
				onClose()
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					showNotification(
						'Holidays calendar creation error',
						error.response.data.message,
						'red'
					)
					showNotification('Shared calendar created', error.message, 'red')
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
