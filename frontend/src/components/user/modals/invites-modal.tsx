import React from 'react'
import { Text, Modal, Stack, Group, Button } from '@mantine/core'

import { ICalendar } from '@/helpers/interface/calendar.interface'
import { InvitationStatus } from '@/helpers/enum'

interface InvitesModalProps {
	opened: boolean
	onClose: () => void
	onClick: (calendar: ICalendar, status: InvitationStatus) => void
	calendars: ICalendar[]
}

const InvitesModal: React.FC<InvitesModalProps> = React.memo(
	({ opened, onClose, onClick, calendars }) => {
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
			</Modal>
		)
	}
)

export default InvitesModal
