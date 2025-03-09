import axios from 'axios'
import { API_BASE_URL } from './backend-port'
import useStore from './store'

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
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
				const response = await axios.post(`${API_BASE_URL}/auth/refresh`)
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
