import apiClient from '@/helpers/axios'
import { CountryCodes } from '@/helpers/country-codes'
import { HolidayCalendarCreateSchema } from '@/helpers/validations/calendar-create-schema'
import {
	Button,
	ColorInput,
	Group,
	Select,
	SelectProps,
	Stack,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { AxiosError } from 'axios'
import React, { useState } from 'react'

import { ICalendar } from '@/helpers/interface/calendar-interface'
import { showNotification } from '@/helpers/show-notification'
import useCalendarStore from '@/helpers/store/calendar-store'
import { Twemoji } from 'react-emoji-render'
import { ICalendar } from '@/helpers/interface/calendar.interface'

interface CreateHolidaysCalendarFormProps {
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

const CreateHolidaysCalendarForm: React.FC<CreateHolidaysCalendarFormProps> =
	React.memo(({ onClose }) => {
		const { addCalendar } = useCalendarStore()
		const [value, setValue] = useState<string | null>('')
		const [loading, setLoading] = useState(false)

		const form = useForm({
			mode: 'uncontrolled',
			initialValues: {
				description: '',
				color: '',
			},
			validate: zodResolver(HolidayCalendarCreateSchema),
		})

		const handleSubmit = async (values: typeof form.values) => {
			try {
				setLoading(true)

				const { data } = await apiClient.post<ICalendar>('/calendars', values)
				addCalendar(data)
				addCalendar(data)

				showNotification(
					'Holidays calendar created',
					`Holiday calendar has been successfully created.`,
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
					<Select
						label="Select country"
						value={value}
						onChange={setValue}
						data={Object.entries(CountryCodes).map(([code, name]) => ({
							value: code,
							label: name,
						}))}
						leftSection={
							value ? <Twemoji svg text={getFlagEmoji(value)} /> : null
						}
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

export default CreateHolidaysCalendarForm
