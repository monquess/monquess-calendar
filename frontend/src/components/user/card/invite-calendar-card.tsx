import { useResponsive } from '@/hooks/use-responsive'
import { InvitationStatus } from '@/shared/enum/invitation-status.enum'
import { ICalendar } from '@/shared/interface'
import { ActionIcon, Card, Flex, Group, HoverCard, Text } from '@mantine/core'
import React from 'react'
import { FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa'
import { IoInformationCircleOutline } from 'react-icons/io5'

interface CalendarInviteCardProps {
	calendar: ICalendar
	onClick: (calendar: ICalendar, status: InvitationStatus) => void
}

const CalendarInviteCard: React.FC<CalendarInviteCardProps> = ({
	calendar,
	onClick,
}) => {
	const { isMobile } = useResponsive()

	return (
		<Card
			key={calendar.id}
			pos="relative"
			shadow="xl"
			padding="md"
			mb="10px"
			radius="md"
			w={isMobile ? '340px' : '400px'}
			style={{
				borderLeft: `6px solid ${calendar.color}`,
			}}
		>
			<Flex justify="space-between" align="center">
				<Flex align="center" gap="xs">
					<FaCalendarAlt size={20} color={calendar.color} />
					<Flex align="center" gap="5px">
						<Text size="md">{calendar.name}</Text>
						{calendar.description && (
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
										{calendar.description}
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						)}
					</Flex>
				</Flex>
				<Group>
					<ActionIcon
						onClick={() => onClick(calendar, InvitationStatus.ACCEPTED)}
						variant="subtle"
					>
						<FaCheck size={20} color="green" />
					</ActionIcon>
					<ActionIcon
						onClick={() => onClick(calendar, InvitationStatus.DECLINED)}
						variant="subtle"
					>
						<FaTimes size={20} color="red" />
					</ActionIcon>
				</Group>
			</Flex>
		</Card>
	)
}

export default React.memo(CalendarInviteCard)
