import React from 'react'
import { ActionIcon, Anchor, Group, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
	FaCalendarAlt,
	FaInstagram,
	FaTwitter,
	FaYoutube,
} from 'react-icons/fa'
import { useResponsive } from '@/hooks/use-responsive'

const links = [
	{ link: '#', label: 'Contact' },
	{ link: '#', label: 'Privacy' },
	{ link: '#', label: 'Blog' },
	{ link: '#', label: 'Store' },
	{ link: '#', label: 'Careers' },
]

const Footer: React.FC = React.memo(() => {
	const { isMobile } = useResponsive()
	const mobileHeight = useMediaQuery('(max-height: 720px)')
	const year = new Date().getFullYear()

	const items = links.map((link) => (
		<Anchor
			c="dimmed"
			key={link.label}
			href={link.link}
			lh={1}
			onClick={(event) => event.preventDefault()}
			size="sm"
		>
			{link.label}
		</Anchor>
	))

	return (
		<Group
			pos={mobileHeight ? 'relative' : 'fixed'}
			bottom={0}
			w="100vw"
			py="md"
			px="sm"
			justify="center"
			align="center"
			style={{ borderTop: '1px solid #ddd' }}
		>
			{isMobile ? (
				<Stack align="center">
					<Group>
						<FaCalendarAlt size={16} />
						<Text fw={500}>Monquees Calendar © {year}</Text>
					</Group>
					<Group>{items}</Group>
					<Group>
						<ActionIcon size="lg" color="gray" variant="subtle">
							<FaTwitter size={18} />
						</ActionIcon>
						<ActionIcon size="lg" color="gray" variant="subtle">
							<FaYoutube size={18} />
						</ActionIcon>
						<ActionIcon size="lg" color="gray" variant="subtle">
							<FaInstagram size={18} />
						</ActionIcon>
					</Group>
				</Stack>
			) : (
				<Group w="100%" px="md" justify="space-between">
					<Group>
						<FaCalendarAlt size={20} />
						<Text fw={500}>Monquees Calendar © {year}</Text>
					</Group>

					<Group>{items}</Group>

					<Group>
						<ActionIcon size="lg" color="gray" variant="subtle">
							<FaTwitter size={24} />
						</ActionIcon>
						<ActionIcon size="lg" color="gray" variant="subtle">
							<FaYoutube size={24} />
						</ActionIcon>
						<ActionIcon size="lg" color="gray" variant="subtle">
							<FaInstagram size={24} />
						</ActionIcon>
					</Group>
				</Group>
			)}
		</Group>
	)
})

export default Footer
