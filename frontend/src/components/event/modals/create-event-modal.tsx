import React, { useEffect, useState } from 'react'
import {
	Modal,
	Text,
	Stack,
	TextInput,
	Select,
	ColorInput,
	Button,
	Grid,
	Divider,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { DateInput } from '@mantine/dates'
import { IoMdTime } from 'react-icons/io'
import { IoCalendar } from 'react-icons/io5'
import { MdNotificationsActive, MdOutlineSubtitles } from 'react-icons/md'
import FullCalendar from '@fullcalendar/react'
import { DateSelectArg } from '@fullcalendar/core'
import { AxiosError } from 'axios'
import apiClient from '@/helpers/axios'
import { useResponsive } from '@/hooks/use-responsive'
import useCalendarStore from '@/helpers/store/calendar-store'
import { showNotification } from '@/helpers/show-notification'
import { EventType } from '@/helpers/enum/event-type.enum'
import { ICalendar } from '@/helpers/interface/calendar.interface'
import { IEvent } from '@/helpers/interface/event.interface'
import { createEventSchema } from '@/helpers/validations/create-event-schema'
import RemindersBox from '../reminders-box'

const reminderToDate = (
	reminder: { value: number; mult: number },
	eventDate: Date
): Date => {
	const minutes = reminder.value * reminder.mult
	return new Date(eventDate.setMinutes(eventDate.getMinutes() - minutes))
}

interface CreateEventModalProps {
	opened: boolean
	onClose: () => void
	calendarRef: React.RefObject<FullCalendar | null>
}

const CreateEventModal: React.FC<CreateEventModalProps> = React.memo(
	({ opened, onClose, calendarRef }) => {
		const { isMobile } = useResponsive()
		const { calendars } = useCalendarStore()
		const [loading, setLoading] = useState(false)

		const [reminders, setReminders] = useState<
			{ value: number; mult: number }[]
		>([])

		const defaultCalendar = Object.values(calendars).find(
			(c) => c.isPersonal && c.users.find((u) => u.role === 'OWNER')
		) as ICalendar
		const [calendarId, setCalendarId] = useState<string>(
			defaultCalendar.id.toString()
		)

		const form = useForm({
			mode: 'uncontrolled',
			initialValues: {
				name: '',
				description: '',
				type: EventType.MEETING,
				color: defaultCalendar.color,
				startDate: new Date(),
				endDate: new Date() as Date | null,
			},
			validate: zodResolver(createEventSchema),
		})

		useEffect(() => {
			const calendar = calendarRef.current
			const onSelect = (info: DateSelectArg) => {
				form.setFieldValue('startDate', info.start)
				form.setFieldValue('endDate', info.end)
			}

			if (calendar) {
				calendar.getApi().on('select', onSelect)
			}

			return () => {
				if (calendar) {
					calendar.getApi().off('select', onSelect)
				}
			}
		}, [calendarRef, form])

		useEffect(() => {
			if (!opened) {
				setReminders([])
				form.reset()
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [opened])

		useEffect(() => {
			if (opened && Object.values(calendars).length > 0) {
				setCalendarId(defaultCalendar.id.toString())
			}
		}, [opened, calendars, defaultCalendar.id])

		const handleSubmit = async (values: typeof form.values) => {
			try {
				setLoading(true)
				const { data: event } = await apiClient.post<IEvent>(
					`/calendars/${calendarId}/events`,
					values
				)

				if (reminders.length > 0) {
					await Promise.all(
						reminders.map((reminder) =>
							apiClient.post(`/events/${event.id}/reminders`, {
								time: reminderToDate(reminder, new Date(event.startDate)),
							})
						)
					)
				}

				calendarRef.current?.getApi().addEvent({
					...event,
					id: event.id.toString(),
					title: event.name,
					start: event.startDate,
					end: event.endDate ?? undefined,
					backgroundColor: event.color,
					borderColor: event.color,
				})
				showNotification(
					'Event created',
					'Event has been successfully created.',
					'green'
				)
				onClose()
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					showNotification('Event creating error', error.message, 'red')
				}
			} finally {
				setLoading(false)
			}
		}

		return (
			<Modal
				opened={opened}
				onClose={onClose}
				title="Create event"
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
									placeholder="Choose a title"
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
									placeholder="Description"
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
								<MdNotificationsActive size={20} />
							</Grid.Col>
							<Grid.Col span={12}>
								<RemindersBox
									reminders={reminders}
									onCreate={() => {
										if (reminders.length === 0) {
											setReminders((prev) => [...prev, { value: 15, mult: 1 }])
										} else if (reminders.length < 3) {
											setReminders((prev) => [
												...prev,
												{
													value: prev[prev.length - 1].value + 15,
													mult: 1,
												},
											])
										}
									}}
									onChange={(index, value) =>
										setReminders((prev) =>
											prev.map((reminder, i) => {
												if (i === index) {
													return { ...reminder, value: value as number }
												}
												return reminder
											})
										)
									}
									onSelect={(index, value) => {
										setReminders((prev) =>
											prev.map((reminder, i) => {
												if (i === index) {
													return {
														...reminder,
														mult: Number(value),
													}
												}
												return reminder
											})
										)
									}}
									onDelete={(index) => {
										setReminders((prev) => prev.filter((_, i) => i !== index))
									}}
								/>
							</Grid.Col>
							<Grid.Col span={1}>
								<IoCalendar size={20} />
							</Grid.Col>
							<Grid.Col span={6}>
								<Select
									value={calendarId}
									onChange={(_, option) => {
										form.setFieldValue(
											'color',
											calendars[Number(option.value)].color
										)
										setCalendarId(option.value)
									}}
									data={Object.entries(calendars)
										.filter(([_, calendar]) => calendar.type !== 'HOLIDAYS')
										.map(([id, calendar]) => ({
											value: id,
											label: calendar.name,
										}))}
									checkIconPosition="right"
									styles={{ dropdown: { zIndex: 1100 } }}
									w="100%"
								/>
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
									data={Object.entries(EventType).map(([value, label]) => ({
										value,
										label: label.charAt(0) + label.slice(1).toLowerCase(),
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
							Create
						</Button>
					</Stack>
				</form>
			</Modal>
		)
	}
)

export default CreateEventModal
