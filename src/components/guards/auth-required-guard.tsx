'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'

interface AuthRequiredGuardProps {
  children: React.ReactNode
}

/**
 * Auth Required Guard (Enhanced)
 * Component to protect routes that require authentication
 */
export function AuthRequiredGuard({ children }: AuthRequiredGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, loading, isHydrated } = useAuthStore()

  useEffect(() => {
    // Wait for store to hydrate before checking auth
    if (!isHydrated) return

    if (!loading && !isAuthenticated) {
      // Save current path for redirect after login
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, loading, isHydrated, router, pathname])

  // Show loading while checking auth
  if (!isHydrated || loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
