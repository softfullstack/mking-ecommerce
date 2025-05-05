import { create } from "zustand"
import { persist } from "zustand/middleware"
interface AuthStore {
    isAuthenticated: boolean;
    user: any;
    login: (userData: any) => void;
    logout: () => void;
    updateUser: (userData: any) => void;
}
const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: (userData:any) => {
                set({
                    user: userData,
                    isAuthenticated: true,
                })
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                })
            },

            updateUser: (userData:any) => {
                set((state:any) => ({
                    user: {
                        ...state.user,
                        ...userData,
                    },
                }))
            },
        }),
        {
            name: "auth-storage",
        },
    ),
)

export default useAuthStore
