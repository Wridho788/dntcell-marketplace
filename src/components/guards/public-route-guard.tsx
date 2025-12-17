'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'

interface PublicRouteGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

/**
 * Public Route Guard
 * Redirects authenticated users away from auth pages (login, register)
 */
export function PublicRouteGuard({ children, redirectTo = '/' }: PublicRouteGuardProps) {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuthStore()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, loading, router, redirectTo])

  // Show content while checking (prevents flash)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-600">Mengalihkan...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
