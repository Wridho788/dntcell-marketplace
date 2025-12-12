import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/types/auth'

interface AuthState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  loading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isLoggedIn: false,
      loading: false,

      // Actions
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      
      setToken: (token) => set({ token }),
      
      login: (user, token) => set({ 
        user, 
        token, 
        isLoggedIn: true,
        loading: false 
      }),
      
      logout: () => {
        // Clear query cache when logging out
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('auth-logout')
          window.dispatchEvent(event)
        }
        
        set({ 
          user: null, 
          token: null, 
          isLoggedIn: false,
          loading: false
        })
      },
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
      
      setLoading: (loading) => set({ loading })
    }),
    {
      name: 'dntcell-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn
      }),
      skipHydration: true
    }
  )
)
