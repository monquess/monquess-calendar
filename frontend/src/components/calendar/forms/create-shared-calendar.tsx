import React, { useState } from 'react'
import { Button, ColorInput, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

import { apiClient, ApiError } from '@/shared/api/axios'
import { CalendarType } from '@/shared/enum'
import { ICalendar } from '@/shared/interface'
import { showNotification } from '@/shared/helpers/show-notification'
import useCalendarStore from '@/shared/store/calendar-store'
import { CalendarCreateSchema } from '@/shared/validations'

interface CreateSharedCalendarFormProps {
	onClose: () => void
}

const CreateSharedCalendarForm: React.FC<CreateSharedCalendarFormProps> = ({
	onClose,
}) => {
	const { addCalendar } = useCalendarStore()
	const [loading, setLoading] = useState(false)

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			name: '',
			description: '',
			color: '',
			type: CalendarType.SHARED,
		},
		validate: zodResolver(CalendarCreateSchema),
	})

	const handleSubmit = async (values: typeof form.values) => {
		try {
			setLoading(true)

			const { data } = await apiClient.post<ICalendar>('/calendars', values)
			addCalendar(data)

			showNotification(
				'Holidays calendar created',
				`Calendar "${values.name}" has been successfully created.`,
				'green'
			)
			onClose()
		} catch (error) {
			if (error instanceof ApiError && error.response) {
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
					data-autofocus
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

export default React.memo(CreateSharedCalendarForm)
