import React, { useState } from 'react'
import apiClient from '@/helpers/axios'
import { countryConst } from '@/helpers/country-code-const'
import { CalendarCreateSchema } from '@/helpers/validations/calendar-create-schema'
import {
	Button,
	ColorInput,
	Group,
	Select,
	SelectProps,
	Stack,
	TextInput,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { AxiosError } from 'axios'

import { Twemoji } from 'react-emoji-render'
import { showNotification } from '@/helpers/show-notification'
import useCalendarStore from '@/helpers/store/calendar-store'
import { ICalendar } from '@/helpers/interface/calendar-interface'

interface createCalendarFormProps {
	onClose: () => void
}

const getFlagEmoji = (countryCode: string) => {
	return countryCode
		.toUpperCase()
		.split('')
		.map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
		.join('')
}

const renderSelectOption: SelectProps['renderOption'] = ({ option }) => (
	<Group flex="1" gap="xs">
		<Twemoji svg text={getFlagEmoji(option.value)} />
		{option.label}
	</Group>
)

const CreateCalendarHolidaysForm: React.FC<createCalendarFormProps> =
	React.memo(({ onClose }) => {
		const { addCalendar } = useCalendarStore()
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

				const { data } = await apiClient.post<ICalendar>('/calendars', values)
				addCalendar(data.id)

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
					<Select
						label="Select country"
						value={value}
						onChange={setValue}
						data={Object.entries(countryConst).map(([code, name]) => ({
							value: code,
							label: name,
						}))}
						renderOption={renderSelectOption}
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
