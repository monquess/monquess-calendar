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
import { ICalendar } from '@/shared/interface'

import classes from '@/shared/styles/modal.module.css'

interface InvitesModalProps {
	opened: boolean
	onClose: () => void
	onClick: (calendar: ICalendar, status: InvitationStatus) => void
	calendars: ICalendar[]
}

const InvitesModal: React.FC<InvitesModalProps> = React.memo(
	({ opened, onClose, onClick, calendars }) => {
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
				// size={isMobile ? 'sm' : 'md'}
				centered
				closeOnClickOutside={false}
				zIndex={1000}
			>
				<Stack pos="relative">
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
								Invites to calendar({calendars.length})
							</Tabs.Tab>
							<Tabs.Tab
								value="2"
								ref={setControlRef('2')}
								className={classes.tab}
								w="50%"
							>
								Invites to events({calendars.length})
							</Tabs.Tab>
							<FloatingIndicator
								target={value ? controlsRefs[value] : null}
								parent={rootRef}
								className={classes.indicator}
							/>
						</Tabs.List>
						<Tabs.Panel value="1">
							<Stack>
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
							</Stack>
						</Tabs.Panel>
						<Tabs.Panel value="2">
							<Stack>
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
							</Stack>
						</Tabs.Panel>
					</Tabs>
				</Stack>
			</Modal>
		)
	}
)

export default InvitesModal
