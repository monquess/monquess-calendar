import React, { useState } from 'react'
import {
	Button,
	FloatingIndicator,
	Group,
	Modal,
	Stack,
	Tabs,
	Text,
} from '@mantine/core'

import { InvitationStatus } from '@/shared/enum'
import { ICalendar, IEvent } from '@/shared/interface'
import { useResponsive } from '@/hooks/use-responsive'

import classes from '@/shared/styles/modal.module.css'

interface InvitesModalProps {
	opened: boolean
	onClose: () => void
	onClick: (calendar: ICalendar, status: InvitationStatus) => void
	calendars: ICalendar[]
	events: IEvent[]
}

const InvitesModal: React.FC<InvitesModalProps> = ({
	opened,
	onClose,
	onClick,
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
					<Tabs.Panel value="1">
						<Stack>
							{calendars.length > 0 ? (
								calendars.map((calendar) => (
									<Group key={calendar.id} justify="space-between">
										<Text>{calendar.name}</Text>
										<Group>
											<Button
												onClick={() =>
													onClick(calendar, InvitationStatus.ACCEPTED)
												}
											>
												Accept
											</Button>
											<Button
												onClick={() =>
													onClick(calendar, InvitationStatus.DECLINED)
												}
											>
												Decline
											</Button>
										</Group>
									</Group>
								))
							) : (
								<Text>
									You've not been invited to any calendars or events yet
								</Text>
							)}
						</Stack>
					</Tabs.Panel>
					<Tabs.Panel value="2">
						<Stack>
							{events.length > 0 ? (
								events.map((events) => (
									<Group key={events.id} justify="space-between">
										<Text>{events.name}</Text>
										<Group>
											<Button
											// onClick={() =>
											// 	onClick(calendar, InvitationStatus.ACCEPTED)
											// }
											>
												Accept
											</Button>
											<Button
											// onClick={() =>
											// 	onClick(calendar, InvitationStatus.DECLINED)
											// }
											>
												Decline
											</Button>
										</Group>
									</Group>
								))
							) : (
								<Text>
									You've not been invited to any calendars or events yet
								</Text>
							)}
						</Stack>
					</Tabs.Panel>
				</Tabs>
			</Stack>
		</Modal>
	)
}

export default React.memo(InvitesModal)
