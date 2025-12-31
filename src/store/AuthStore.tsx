import { create } from "zustand"

interface User {
    id: number
    name: string
    email: string
    avatar?: string
    image?: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    login: (userData: User) => void
    logout: () => void
    updateUser: (userData: Partial<User>) => void

}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: (userData: User) => set({ user: userData, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
    updateUser: (userData: Partial<User>) => set((state: AuthState) => ({
        user: state.user ? { ...state.user, ...userData } : null
    }))
}))

export default useAuthStore
