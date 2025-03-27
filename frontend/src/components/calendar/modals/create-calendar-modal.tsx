import React, { useState } from 'react'
import { FloatingIndicator, Modal, Stack, Tabs, Text } from '@mantine/core'

import classes from '@/shared/styles/modal.module.css'
import { useResponsive } from '@/hooks/use-responsive'

import CreateHolidaysCalendarForm from '../forms/create-holidays-calendar'
import CreateSharedCalendarForm from '../forms/create-shared-calendar'

interface CreateCalendarModalProps {
	opened: boolean
	onClose: () => void
}

const CreateCalendarModal: React.FC<CreateCalendarModalProps> = React.memo(
	({ opened, onClose }) => {
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
				title="Create calendar"
				size={isMobile ? 'sm' : 'md'}
				centered
				closeOnClickOutside={false}
				zIndex={1000}
			>
				<Stack pos="relative">
					<Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="unset">
						Create a calendar for yourself or your team. Choose a name, add a
						short description, and pick a color to make it uniquely yours!
					</Text>
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
								Shared calendar
							</Tabs.Tab>
							<Tabs.Tab
								value="2"
								ref={setControlRef('2')}
								className={classes.tab}
								w="50%"
							>
								Holidays calendar
							</Tabs.Tab>
							<FloatingIndicator
								target={value ? controlsRefs[value] : null}
								parent={rootRef}
								className={classes.indicator}
							/>
						</Tabs.List>
						<Tabs.Panel value="1">
							<CreateSharedCalendarForm onClose={onClose} />
						</Tabs.Panel>
						<Tabs.Panel value="2">
							<CreateHolidaysCalendarForm onClose={onClose} />
						</Tabs.Panel>
					</Tabs>
				</Stack>
			</Modal>
		)
	}
)

export default CreateCalendarModal
