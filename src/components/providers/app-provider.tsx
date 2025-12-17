'use client'

import { BottomNav } from '@/components/navigation/bottom-nav'
import { QueryProvider } from './query-provider'
import { ToastContainer, ToastProvider } from '@/components/ui/toast'
import { AppBootstrap } from './app-bootstrap'
import { apiClient } from '@/lib/api/api-client'
import { useAuthStore } from '@/lib/store/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    // Setup API client callbacks
    apiClient.setOnUnauthorized(() => {
      logout()
      router.push('/login?session=expired')
    })

    apiClient.setOnForbidden(() => {
      router.push('/forbidden')
    })
  }, [logout, router])

  return (
    <ToastProvider>
      <QueryProvider>
        <AppBootstrap>
          <main className="pb-20 min-h-screen bg-neutral-50">
            {children}
          </main>
          
          <BottomNav />
          <ToastContainer />
        </AppBootstrap>
      </QueryProvider>
    </ToastProvider>
  )
}
