import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@mantine/core'
import useStore from '@/helpers/store'

const HomePage: React.FC = React.memo(() => {
	const { user } = useStore()
	return (
		<div>
			<h1>Home Page. Hello {user?.username}</h1>
			<Button>
				<Link to="/login">Login</Link>
			</Button>
			<Button>
				<Link to="/register">Register</Link>
			</Button>
		</div>
	)
})

export default HomePage
