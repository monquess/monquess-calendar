import apiClient from '@/helpers/axios'
import { countryConst } from '@/helpers/country-code-const'
import { CalendarCreateSchema } from '@/helpers/validations/calendar-create-schema'
import { Button, ColorInput, Select, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { AxiosError } from 'axios'
import React, { useState } from 'react'

interface createCalendarFormProps {
	onClose: () => void
}

const CreateCalendarHolidaysForm: React.FC<createCalendarFormProps> =
	React.memo(({ onClose }) => {
		const [value, setValue] = useState<string | null>('')
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
					title: 'Holidays Calendar Created',
					message: `Calendar "${values.name}" has been successfully created.`,
					withCloseButton: true,
					autoClose: 5000,
					color: 'green',
				})
				onClose()
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					notifications.show({
						title: 'Holidays Calendar Created',
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

		const getFlagEmoji = (countryCode: string) => {
			return countryCode
				.toUpperCase()
				.split('')
				.map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
				.join('')
		}

		return (
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack pos="relative">
					<TextInput
						label="Name"
						key={form.key('name')}
						{...form.getInputProps('name')}
					></TextInput>
					<Select
						label="Select country"
						value={value}
						onChange={setValue}
						data={Object.entries(countryConst).map(([code, name]) => ({
							value: code,
							label: `${getFlagEmoji(code)} ${name}`,
						}))}
						styles={{ dropdown: { zIndex: 1100 } }}
						placeholder="Start writing name..."
						searchable
						clearable
					/>
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
	})

export default CreateCalendarHolidaysForm
