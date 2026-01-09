import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
    id: number
    name: string
    last_name?: string
    email: string
    image?: string
    favorites?: any[]
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    login: (userData: User) => void
    logout: () => void
    updateUser: (userData: Partial<User>) => void
    toggleFavoriteAction: (product: any) => void
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (userData: User) => set({ user: userData, isAuthenticated: true }),
            logout: () => {
                localStorage.removeItem("token")
                set({ user: null, isAuthenticated: false })
            },
            updateUser: (userData: Partial<User>) => set((state: AuthState) => ({
                user: state.user ? { ...state.user, ...userData } : null
            })),
            toggleFavoriteAction: (product: any) => set((state: AuthState) => {
                if (!state.user) return state;
                const favorites = state.user.favorites || [];
                const isFavorite = favorites.some((f: any) => f.id === product.id);

                const newFavorites = isFavorite
                    ? favorites.filter((f: any) => f.id !== product.id)
                    : [...favorites, product];

                return {
                    user: { ...state.user, favorites: newFavorites }
                };
            })
        }),
        {
            name: "auth-storage", // local storage key
        }
    )
)

export default useAuthStore
