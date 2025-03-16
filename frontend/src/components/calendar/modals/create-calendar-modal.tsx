import { CalendarCreateSchema } from '@/helpers/validations/calendar-create-schema'
import { useResponsive } from '@/hooks/use-responsive'
import {
	Button,
	ColorInput,
	Modal,
	Stack,
	Text,
	TextInput,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import React from 'react'

interface createCalendarModalProps {
	opened: boolean
	onClose: () => void
}

const CreateCalendarModal: React.FC<createCalendarModalProps> = React.memo(
	({ opened, onClose }) => {
		const { isMobile } = useResponsive()

		const form = useForm({
			mode: 'uncontrolled',
			initialValues: {
				name: '',
				description: '',
				color: '',
			},
			validate: zodResolver(CalendarCreateSchema),
		})
		return (
			<Modal
				opened={opened}
				onClose={onClose}
				title="Create calendar"
				size={isMobile ? 'sm' : 'md'}
				centered
				closeOnClickOutside={false}
				zIndex={10000}
			>
				<form onSubmit={() => form.validate()}>
					<Stack pos="relative">
						<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
							Create a calendar for yourself or your team. Choose a name, add a
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
						/>
						<Button type="submit">Create</Button>
					</Stack>
				</form>
			</Modal>
		)
	}
)

export default CreateCalendarModal
