import React, { useState } from 'react'
import {
	Button,
	ColorInput,
	Group,
	Select,
	SelectProps,
	Stack,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

import { Twemoji } from 'react-emoji-render'

import { apiClient, ApiError } from '@/shared/api/axios'
import { CountryCodes } from '@/shared/constant/country-codes'
import { CalendarType } from '@/shared/enum'
import { ICalendar } from '@/shared/interface'
import { showNotification } from '@/shared/helpers/show-notification'
import useCalendarStore from '@/shared/store/calendar-store'
import { HolidayCalendarCreateSchema } from '@/shared/validations'

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

const CreateHolidaysCalendarForm: React.FC<CreateHolidaysCalendarFormProps> = ({
	onClose,
}) => {
	const { addCalendar } = useCalendarStore()
	const [region, setRegion] = useState<string | null>('')
	const [loading, setLoading] = useState(false)

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			description: '',
			color: '',
			region: '',
			type: CalendarType.HOLIDAYS,
		},
		validate: zodResolver(HolidayCalendarCreateSchema),
	})

	const handleSubmit = async (values: typeof form.values) => {
		try {
			setLoading(true)

			const { data } = await apiClient.post<ICalendar>('/calendars', {
				...values,
				region,
			})

			addCalendar(data)
			showNotification(
				'Holidays calendar created',
				`Holiday calendar has been successfully created.`,
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
					value={region}
					onChange={setRegion}
					data={Object.entries(CountryCodes).map(([code, name]) => ({
						value: code,
						label: name,
					}))}
					leftSection={
						region ? <Twemoji svg text={getFlagEmoji(region)} /> : null
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
}

export default React.memo(CreateHolidaysCalendarForm)
