import { Link } from 'react-router-dom'
import { Button, Container, Group, Text, Title } from '@mantine/core'

const NotFound: React.FC = () => {
	return (
		<Container size="lg" style={{ textAlign: 'center', paddingTop: '50px' }}>
			<Title order={1} size={50} c="red">
				404
			</Title>
			<Text size="lg" color="dimmed">
				Oops! The page you are looking for does not exist.
			</Text>
			<Group mt="lg" justify="center">
				<Button component={Link} to="/" variant="filled" color="blue">
					Go Home
				</Button>
			</Group>
		</Container>
	)
}

export default NotFound
