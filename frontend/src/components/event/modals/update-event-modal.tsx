import React, { useState } from 'react'
import {
	Button,
	ColorInput,
	Divider,
	Grid,
	Modal,
	Select,
	Stack,
	Text,
	TextInput,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm, zodResolver } from '@mantine/form'

import { IoMdTime, IoIosColorPalette } from 'react-icons/io'
import { MdOutlineSubtitles } from 'react-icons/md'

import FullCalendar from '@fullcalendar/react'
import { EventImpl } from '@fullcalendar/core/internal'

import { apiClient, ApiError } from '@/shared/api/axios'
import { EventType } from '@/shared/enum'
import { IEvent } from '@/shared/interface'
import { showNotification } from '@/shared/helpers/show-notification'
import { mapEvent } from '@/shared/helpers/map-event'
import { createEventSchema } from '@/shared/validations'
import { useResponsive } from '@/hooks/use-responsive'

import { capitalize } from 'lodash'

interface UpdateEventModalProps {
	opened: boolean
	onClose: () => void
	event: EventImpl
	calendarRef: React.RefObject<FullCalendar | null>
}

const UpdateEventModal: React.FC<UpdateEventModalProps> = ({
	opened,
	onClose,
	event,
	calendarRef,
}) => {
	const { isMobile } = useResponsive()
	const [loading, setLoading] = useState(false)

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			name: event.title,
			description: event.extendedProps.description,
			type: event.extendedProps.type,
			startDate: event.start,
			endDate: event.end,
			color: event.backgroundColor,
		},
		validate: zodResolver(createEventSchema),
	})

	const handleSubmit = async (values: typeof form.values) => {
		try {
			setLoading(true)
			const { data } = await apiClient.patch<IEvent>(
				`/events/${event.id}`,
				values
			)

			calendarRef.current?.getApi().getEventById(event.id)?.remove()
			calendarRef.current?.getApi().addEvent(mapEvent(data))
			showNotification(
				'Event update',
				'Event has been successfully updated.',
				'green'
			)
			onClose()
		} catch (error) {
			if (error instanceof ApiError && error.response) {
				showNotification('Event updating error', error.message, 'red')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Update event"
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack pos="relative">
					<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
						Create an event for yourself or your team. Choose a name, add a
						short description, and pick a color to make it uniquely yours!
					</Text>
					<Grid align="center" gutter="xs" columns={13}>
						<Grid.Col span={1}>
							<MdOutlineSubtitles size={20} />
						</Grid.Col>
						<Grid.Col span={12}>
							<TextInput
								data-autofocus
								key={form.key('name')}
								{...form.getInputProps('name')}
								w="100%"
							/>
						</Grid.Col>
						<Grid.Col span={1}>
							<MdOutlineSubtitles size={20} />
						</Grid.Col>
						<Grid.Col span={12}>
							<TextInput
								key={form.key('description')}
								{...form.getInputProps('description')}
								w="100%"
							/>
						</Grid.Col>
						<Grid.Col span={13}>
							<Divider my="xs" />
						</Grid.Col>
						<Grid.Col span={1}>
							<IoMdTime size={20} />
						</Grid.Col>
						<Grid.Col span={6}>
							<DateInput
								key={form.key('startDate')}
								{...form.getInputProps('startDate')}
								popoverProps={{
									zIndex: 1100,
									position: 'bottom',
								}}
								w="100%"
							/>
						</Grid.Col>
						<Grid.Col span={6}>
							<DateInput
								key={form.key('endDate')}
								{...form.getInputProps('endDate')}
								popoverProps={{
									zIndex: 1100,
									position: 'bottom',
								}}
								w="100%"
							/>
						</Grid.Col>
						<Grid.Col span={1}>
							<IoIosColorPalette size={20} />
						</Grid.Col>
						<Grid.Col span={6}>
							<ColorInput
								key={form.key('color')}
								{...form.getInputProps('color')}
								styles={{
									dropdown: { zIndex: 1100 },
								}}
								w="100%"
							/>
						</Grid.Col>
						<Grid.Col span={1} />
						<Grid.Col span={12}>
							<Select
								label="Event type"
								data={Object.entries(EventType)
									.filter(([value]) => value !== EventType.HOLIDAY)
									.map(([value, label]) => ({
										value,
										label: capitalize(label),
									}))}
								key={form.key('type')}
								{...form.getInputProps('type')}
								checkIconPosition="right"
								styles={{ dropdown: { zIndex: 1100 } }}
								w="45%"
							/>
						</Grid.Col>
					</Grid>
					<Button type="submit" variant="outline" loading={loading}>
						Update
					</Button>
				</Stack>
			</form>
		</Modal>
	)
}

export default React.memo(UpdateEventModal)
