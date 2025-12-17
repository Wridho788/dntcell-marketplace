'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { useUIStore } from '@/lib/store/ui'
import { authService } from '@/services/auth.service'
import { setupGlobalErrorHandler } from '@/lib/utils/error-handler'

interface AppBootstrapProps {
  children: ReactNode
}

/**
 * AppBootstrap Component
 * Handles app initialization flow:
 * - Rehydrate stores
 * - Restore session
 * - Setup error handlers
 * - Block render until ready
 */
export function AppBootstrap({ children }: AppBootstrapProps) {
  const [initError, setInitError] = useState<string | null>(null)
  const { 
    token, 
    setUser, 
    setLoading, 
    logout, 
    isHydrated,
    setHydrated 
  } = useAuthStore()
  const { isAppReady, setAppReady } = useUIStore()

  useEffect(() => {
    // Setup global error handler on mount
    setupGlobalErrorHandler()
  }, [])

  useEffect(() => {
    // Rehydrate auth store from localStorage
    useAuthStore.persist.rehydrate()
    setHydrated(true)
  }, [setHydrated])

  useEffect(() => {
    // Initialize app after hydration
    if (!isHydrated) return

    const initializeApp = async () => {
      try {
        setLoading(true)
        setInitError(null)

        // If token exists, restore session
        if (token) {
          try {
            const session = await authService.getSession()
            
            if (session) {
              setUser(session.user)
            } else {
              // Token invalid, clear session
              logout()
            }
          } catch (error) {
            console.error('[AppBootstrap] Session restore failed:', error)
            // Clear invalid session
            logout()
          }
        }

        // Mark app as ready
        setAppReady(true)
      } catch (error) {
        console.error('[AppBootstrap] Initialization failed:', error)
        setInitError('Gagal menginisialisasi aplikasi. Silakan refresh halaman.')
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [isHydrated, token, setUser, setLoading, logout, setAppReady])

  // Show loading screen while initializing
  if (!isAppReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center space-y-4 px-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-pulse mx-auto" />
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto absolute inset-0" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-neutral-900">
              Memuat Aplikasi
            </h3>
            <p className="text-sm text-neutral-600">
              Mohon tunggu sebentar...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show error screen if initialization failed
  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-neutral-900">
              Terjadi Kesalahan
            </h3>
            <p className="text-neutral-600">{initError}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
