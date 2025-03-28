import {
	Divider,
	FloatingIndicator,
	Modal,
	ScrollArea,
	Stack,
	Tabs,
	Text,
} from '@mantine/core'
import React, { useState } from 'react'

import { useResponsive } from '@/hooks/use-responsive'
import { InvitationStatus } from '@/shared/enum'
import { ICalendar, IEvent } from '@/shared/interface'

import classes from '@/shared/styles/modal.module.css'
import InviteCalendarCard from '../card/invite-calendar-card'
import EventInviteCard from '../card/invite-event-card'

interface InvitesModalProps {
	opened: boolean
	onClose: () => void
	onClickCalendar: (calendar: ICalendar, status: InvitationStatus) => void
	onClickEvent: (event: IEvent, status: InvitationStatus) => void
	calendars: ICalendar[]
	events: IEvent[]
}

const InvitesModal: React.FC<InvitesModalProps> = ({
	opened,
	onClose,
	onClickCalendar,
	onClickEvent,
	calendars,
	events,
}) => {
	const { isMobile } = useResponsive()
	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)
	const [value, setValue] = useState<string | null>('1')
	const [controlsRefs, setControlsRefs] = useState<
		Record<string, HTMLButtonElement | null>
	>({})
	const setControlRef = (val: string) => (node: HTMLButtonElement) => {
		controlsRefs[val] = node
		setControlsRefs(controlsRefs)
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Invites"
			size={isMobile ? 'sm' : 'md'}
			centered
			closeOnClickOutside={false}
			zIndex={1000}
		>
			<Stack pos="relative" mih={200}>
				<Tabs variant="none" value={value} onChange={setValue}>
					<Tabs.List
						ref={setRootRef}
						className={classes.list}
						pos="relative"
						justify="space-between"
					>
						<Tabs.Tab
							value="1"
							ref={setControlRef('1')}
							className={classes.tab}
							w="50%"
						>
							Invites to calendar ({calendars.length})
						</Tabs.Tab>
						<Tabs.Tab
							value="2"
							ref={setControlRef('2')}
							className={classes.tab}
							w="50%"
						>
							Invites to events ({events.length})
						</Tabs.Tab>
						<FloatingIndicator
							target={value ? controlsRefs[value] : null}
							parent={rootRef}
							className={classes.indicator}
						/>
					</Tabs.List>
					<Divider mb="md" />
					<Tabs.Panel value="1">
						<ScrollArea h={175}>
							{calendars.length > 0 ? (
								calendars.map((calendar) => (
									<InviteCalendarCard
										key={calendar.id}
										calendar={calendar}
										onClick={onClickCalendar}
									/>
								))
							) : (
								<Text>
									You've not been invited to any calendars or events yet
								</Text>
							)}
						</ScrollArea>
					</Tabs.Panel>
					<Tabs.Panel value="2">
						<ScrollArea h={175}>
							{events.length > 0 ? (
								events.map((event) => (
									<EventInviteCard
										key={event.id}
										event={event}
										onClick={onClickEvent}
									/>
								))
							) : (
								<Text>
									You've not been invited to any calendars or events yet
								</Text>
							)}
						</ScrollArea>
					</Tabs.Panel>
				</Tabs>
			</Stack>
		</Modal>
	)
}

export default React.memo(InvitesModal)
