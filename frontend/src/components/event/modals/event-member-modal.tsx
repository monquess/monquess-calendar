import { Modal } from '@mantine/core'
import React, { useState } from 'react'

import classes from '@/helpers/styles/modal.module.css'
import { useResponsive } from '@/hooks/use-responsive'
import { EventImpl } from '@fullcalendar/core/internal'
import { FloatingIndicator, Stack, Tabs } from '@mantine/core'
import InviteEventMembersForm from '../forms/invite-member-form'
import EventMemberList from '../member/event-member-list'

interface EventMemberModalProps {
	opened: boolean
	onClose: () => void
	event: EventImpl
}

const EventMemberModal: React.FC<EventMemberModalProps> = React.memo(
	({ opened, onClose, event }) => {
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
				title="Event members"
				size={isMobile ? 'sm' : 'md'}
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
								Members
							</Tabs.Tab>
							<Tabs.Tab
								value="2"
								ref={setControlRef('2')}
								className={classes.tab}
								w="50%"
							>
								Invite member
							</Tabs.Tab>
							<FloatingIndicator
								target={value ? controlsRefs[value] : null}
								parent={rootRef}
								className={classes.indicator}
							/>
						</Tabs.List>
						<Tabs.Panel value="1">
							<EventMemberList event={event} onClose={onClose} />
						</Tabs.Panel>
						<Tabs.Panel value="2">
							<InviteEventMembersForm onClose={onClose} event={event} />
						</Tabs.Panel>
					</Tabs>
				</Stack>
			</Modal>
		)
	}
)

export default EventMemberModal
