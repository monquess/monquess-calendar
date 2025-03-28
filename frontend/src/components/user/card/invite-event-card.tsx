import { useResponsive } from '@/hooks/use-responsive'
import { InvitationStatus } from '@/shared/enum/invitation-status.enum'
import { IEvent } from '@/shared/interface'
import { ActionIcon, Card, Flex, Group, HoverCard, Text } from '@mantine/core'
import React from 'react'
import { FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa'
import { IoInformationCircleOutline } from 'react-icons/io5'

interface EventInviteCardProps {
	event: IEvent
	onClick: (event: IEvent, status: InvitationStatus) => void
}

const EventInviteCard: React.FC<EventInviteCardProps> = ({
	event,
	onClick,
}) => {
	const { isMobile } = useResponsive()

	return (
		<Card
			key={event.id}
			pos="relative"
			shadow="xl"
			padding="md"
			mb="10px"
			radius="md"
			w={isMobile ? '340px' : '400px'}
			style={{
				borderLeft: `6px solid ${event.color}`,
			}}
		>
			<Flex justify="space-between" align="center">
				<Flex align="center" gap="xs">
					<FaCalendarAlt size={20} color={event.color} />
					<Flex align="center" gap="5px">
						<Text size="md">{event.name}</Text>
						<HoverCard
							shadow="md"
							styles={{
								dropdown: {
									zIndex: 2000,
								},
							}}
							width={200}
						>
							<HoverCard.Target>
								<IoInformationCircleOutline size={18} />
							</HoverCard.Target>
							<HoverCard.Dropdown>
								<Text size="xs" c="dimmed">
									{event.description}
								</Text>
								<Text>
									{event.startDate} - {event.endDate}
								</Text>
							</HoverCard.Dropdown>
						</HoverCard>
					</Flex>
				</Flex>
				<Group>
					<ActionIcon
						onClick={() => onClick(event, InvitationStatus.ACCEPTED)}
						variant="subtle"
					>
						<FaCheck size={20} color="green" />
					</ActionIcon>
					<ActionIcon
						onClick={() => onClick(event, InvitationStatus.DECLINED)}
						variant="subtle"
					>
						<FaTimes size={20} color="red" />
					</ActionIcon>
				</Group>
			</Flex>
		</Card>
	)
}

export default React.memo(EventInviteCard)
