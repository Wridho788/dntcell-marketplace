'use client'

import { useEffect } from 'react'
import { BottomNav } from '@/components/navigation/bottom-nav'
import { QueryProvider } from './query-provider'
import { ToastContainer, ToastProvider } from '@/components/ui/toast'
import { useAuthStore } from '@/lib/store/auth'
import { getMe } from '@/lib/api/auth'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { token, setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    // Rehydrate auth store from localStorage
    useAuthStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    // Auto-restore session on app startup
    const restoreSession = async () => {
      if (token) {
        try {
          setLoading(true)
          const user = await getMe(token)
          setUser(user)
        } catch (error) {
          console.error('Failed to restore session:', error)
          // Clear invalid session
          logout()
        } finally {
          setLoading(false)
        }
      }
    }

    restoreSession()
  }, [token, setUser, setLoading, logout])

  return (
    <ToastProvider>
      <QueryProvider>
        <main className="pb-20 min-h-screen bg-neutral-50">
          {children}
        </main>
        
        <BottomNav />
        <ToastContainer />
      </QueryProvider>
    </ToastProvider>
  )
}
