import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/types/auth'

interface AuthState {
  // State
  user: User | null
  token: string | null
  isLoggedIn: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
  isHydrated: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  setLoading: (loading: boolean) => void
  setHydrated: (hydrated: boolean) => void
  refreshSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoggedIn: false,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      isHydrated: false,

      // Actions
      setUser: (user) => set({ 
        user, 
        isLoggedIn: !!user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }),
      
      setToken: (token) => set({ token }),
      
      login: (user, token) => set({ 
        user, 
        token, 
        isLoggedIn: true,
        isAuthenticated: true,
        isAdmin: user?.role === 'admin',
        loading: false 
      }),
      
      logout: async () => {
        // Clear query cache when logging out
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('auth-logout')
          window.dispatchEvent(event)
        }
        
        set({ 
          user: null, 
          token: null, 
          isLoggedIn: false,
          isAuthenticated: false,
          isAdmin: false,
          loading: false
        })
      },
      
      updateUser: (userData) => set((state) => {
        const updatedUser = state.user ? { ...state.user, ...userData } : null
        return {
          user: updatedUser,
          isAdmin: updatedUser?.role === 'admin'
        }
      }),
      
      setLoading: (loading) => set({ loading }),
      
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
      
      refreshSession: async () => {
        const { token } = get()
        if (!token) {
          set({ loading: false })
          return
        }
        
        try {
          set({ loading: true })
          // Import dynamically to avoid circular dependency
          const { authService } = await import('@/services/auth.service')
          const session = await authService.getSession()
          
          if (session) {
            set({ 
              user: session.user, 
              token: session.token,
              isLoggedIn: true,
              isAuthenticated: true,
              isAdmin: session.user.role === 'admin',
              loading: false 
            })
          } else {
            get().logout()
          }
        } catch (error) {
          console.error('[AuthStore] Session refresh failed:', error)
          get().logout()
        }
      }
    }),
    {
      name: 'dntcell-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      }
    }
  )
)
