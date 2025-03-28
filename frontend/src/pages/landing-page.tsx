import Footer from '@/components/general/footer'
import Header from '@/components/general/header'
import { Button, Container, Group, Stack, Text, Title } from '@mantine/core'
import { motion } from 'framer-motion'
import React from 'react'
import { FaCalendarAlt, FaCheckCircle, FaRocket } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const LandingPage: React.FC = () => {
	const navigate = useNavigate()

	return (
		<>
			<Header isLandingPage={true} />
			<Container
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
				}}
				display="flex"
				h="100vh"
			>
				<Stack align="center" gap="xl">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<Title ta="center" order={1} size={48} fw={700}>
							Welcome to{' '}
							<span style={{ color: '#00A8E8' }}>Monquees Calendar</span>
						</Title>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
						<Text ta="center" size="lg" c="dimmed">
							Plan your events, stay organized, and never miss an important
							date.
						</Text>
					</motion.div>

					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.5 }}
					>
						<Button
							size="lg"
							radius="xl"
							color="blue"
							onClick={() => navigate('/login')}
						>
							🚀 Go to the App
						</Button>
					</motion.div>
				</Stack>

				<Stack mt={80} align="center" gap="xl">
					<Title order={2} ta="center">
						Why Choose Monquees Calendar?
					</Title>

					<Group justify="center" gap="xl">
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7 }}
						>
							<FeatureCard
								icon={<FaCheckCircle />}
								title="Reminders"
								description="Smart event notifications and alerts."
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7 }}
						>
							<FeatureCard
								icon={<FaCalendarAlt />}
								title="Sync Everywhere"
								description="Seamlessly sync across all your devices."
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
						>
							<FeatureCard
								icon={<FaRocket />}
								title="Fast & Lightweight"
								description="Experience a fast and intuitive interface."
							/>
						</motion.div>
					</Group>
				</Stack>
			</Container>
			<Footer />
		</>
	)
}

const FeatureCard: React.FC<{
	icon: React.ReactNode
	title: string
	description: string
}> = ({ icon, title, description }) => (
	<Stack
		align="center"
		w={250}
		p="md"
		style={{
			border: '1px solid #ddd',
			borderRadius: 10,
			textAlign: 'center',
		}}
	>
		<div style={{ fontSize: 40, color: '#00A8E8' }}>{icon}</div>
		<Text fw={600}>{title}</Text>
		<Text c="dimmed" ta="center">
			{description}
		</Text>
	</Stack>
)

export default LandingPage
