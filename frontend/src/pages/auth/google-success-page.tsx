import { apiClient } from '@/helpers/api/axios'
import { showNotification } from '@/helpers/show-notification'
import useUserStore, { User } from '@/helpers/store/user-store'
import { LoadingOverlay } from '@mantine/core'
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const GoogleAuthSuccessPage: React.FC = () => {
	const [searchParams] = useSearchParams()
	const { user, updateToken, updateUser } = useUserStore()
	const navigate = useNavigate()

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const { data } = await apiClient.get<User>(`users/self`)
				updateUser(data)
			} catch {
				showNotification('Error', 'Error getting user information', 'red')
				navigate('/login')
			}
		}
		const token = searchParams.get('accessToken')

		if (token) {
			updateToken(token)
			fetchUser()
		}
	}, [navigate, searchParams, updateToken, updateUser])

	useEffect(() => {
		if (user) {
			navigate('/')
		}
	}, [user, navigate])

	return <LoadingOverlay visible zIndex={1000} />
}

export default GoogleAuthSuccessPage
