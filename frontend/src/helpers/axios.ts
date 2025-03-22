import { config } from '@/config/config'
import axios from 'axios'
import useStore from './store/user-store'

const apiClient = axios.create({
	baseURL: config.API_BASE_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		// 'Accept-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
		'Accept-Timezone': 'Europe/Warsaw',
	},
})

apiClient.interceptors.request.use(
	(config) => {
		const accessToken = useStore.getState().accessToken

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

apiClient.interceptors.response.use(
	(response) => {
		return response
	},
	async (error) => {
		const originalRequest = error.config

		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			try {
				const response = await axios.post(`${config.API_BASE_URL}/auth/refresh`)
				const newAccessToken = response.data.accessToken
				useStore.getState().updateToken(newAccessToken)
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
				return axios(originalRequest)
			} catch {
				useStore.getState().logout()
			}
		}
		return Promise.reject(error)
	}
)

export default apiClient
