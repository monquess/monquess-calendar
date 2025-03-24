import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserStore from './store/user-store'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { user } = useUserStore()
	const navigate = useNavigate()

	useEffect(() => {
		if (!user) {
			navigate('/login')
		}
	}, [user, navigate])

	if (!user) {
		return null
	}

	return <>{children}</>
}

export default ProtectedRoute
