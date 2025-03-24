import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface User {
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

const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			user: null,
			accessToken: null,
			logout: () => set({ user: null, accessToken: null }),
			login: (user: User, accessToken: string) => set({ user, accessToken }),
			updateToken: (accessToken: string) => set({ accessToken }),
			updateUser: (user: User) => set({ user }),
		}),
		{
			name: 'zustand-storage',
			storage: createJSONStorage(() => localStorage),
		}
	)
)

export default useUserStore
