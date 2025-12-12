'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * Component to protect routes that require authentication
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn, loading } = useAuthStore()

  useEffect(() => {
    // Rehydrate store on mount
    useAuthStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      // Save current path for redirect after login
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isLoggedIn, loading, router, pathname])

  // Show loading while checking auth
  if (loading || !isLoggedIn) {
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
