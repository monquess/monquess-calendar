import {
	Stack,
	Group,
	NumberInput,
	Select,
	CloseButton,
	Button,
} from '@mantine/core'

interface RemindersBoxProps {
	reminders: { value: number; mult: number }[]
	onCreate: () => void
	onChange: (index: number, value: string | number) => void
	onSelect: (index: number, value: string | null) => void
	onDelete: (index: number) => void
}

const RemindersBox: React.FC<RemindersBoxProps> = ({
	reminders,
	onChange,
	onCreate,
	onDelete,
	onSelect,
}) => {
	const selectData = [
		{
			value: '1',
			label: 'minutes',
		},
		{
			value: '60',
			label: 'hours',
		},
	]

	return (
		<Stack>
			{reminders.map((reminder, index) => (
				<Group key={index}>
					<NumberInput
						value={reminder.value}
						w="40%"
						onChange={(value) => onChange(index, value)}
					/>
					<Select
						value={reminder.mult.toString()}
						onChange={(value) => onSelect(index, value)}
						data={selectData}
						checkIconPosition="right"
						styles={{ dropdown: { zIndex: 1100 } }}
						w="40%"
					/>
					<CloseButton onClick={() => onDelete(index)} />
				</Group>
			))}
			{reminders.length < 3 ? (
				<Button variant="outline" onClick={() => onCreate()}>
					Add reminder
				</Button>
			) : null}
		</Stack>
	)
}

export default RemindersBox
