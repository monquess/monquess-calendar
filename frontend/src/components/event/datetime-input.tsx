import React, { useEffect, useRef, useState } from 'react'
import { ActionIcon } from '@mantine/core'
import { DateInput, TimeInput } from '@mantine/dates'

import { GoClock } from 'react-icons/go'

interface DateTimeInputProps {
	value: Date | null
	onChange: (value: Date) => void
	withTime: boolean
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({
	value,
	onChange,
	withTime,
}) => {
	const ref = useRef<HTMLInputElement>(null)
	const [date, setDate] = useState<Date | null>(value)
	const [time, setTime] = useState<string>(() => {
		if (value) {
			return value.toTimeString().slice(0, 5)
		}
		return new Date().toTimeString().slice(0, 5)
	})

	useEffect(() => {
		if (date) {
			const newDate = new Date(date)
			const [hours, minutes] = withTime ? time.split(':').map(Number) : [0, 0]
			newDate.setHours(hours, minutes)

			if (newDate.getTime() !== value?.getTime()) {
				onChange(newDate)
			}
		}
	}, [date, onChange, time, value, withTime])

	const pickerControl = (
		<ActionIcon
			variant="subtle"
			color="gray"
			onClick={() => ref.current?.showPicker()}
		>
			<GoClock size={16} />
		</ActionIcon>
	)

	return (
		<>
			<DateInput
				value={date}
				onChange={setDate}
				popoverProps={{ zIndex: 1100, position: 'bottom' }}
			/>
			{withTime && (
				<TimeInput
					mt="xs"
					ref={ref}
					rightSection={pickerControl}
					value={time}
					onChange={(event) => setTime(event.currentTarget.value)}
				/>
			)}
		</>
	)
}

export default React.memo(DateTimeInput)
