import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface User {
	id: number
	username: string
	email: string
	verified: boolean
	avatar: string
	createdAt: string
	updatedAt: string
}

interface UserState {
	user: User | null
	accessToken: string | null
	logout: () => void
	login: (user: User, token: string) => void
	updateToken: (token: string) => void
	updateUser: (user: User) => void
}

const useStore = create<UserState>()(
	persist(
		(set) => ({
			user: null,
			accessToken: null,
			logout: () => set({ user: null, accessToken: null }),
			login: (user, accessToken) => set({ user, accessToken }),
			updateToken: (accessToken) => set({ accessToken }),
			updateUser: (user) => set({ user }),
		}),
		{
			name: 'zustand-storage',
			storage: createJSONStorage(() => localStorage),
		}
	)
)

export default useStore
