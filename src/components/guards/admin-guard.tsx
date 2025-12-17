'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'
import { canAccessAdminPanel } from '@/lib/guards/capabilities'

interface AdminGuardProps {
  children: React.ReactNode
}

/**
 * Admin Guard
 * Protects admin-only routes
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuthStore()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/admin')
      } else if (!canAccessAdminPanel(user)) {
        router.push('/forbidden')
      }
    }
  }, [isAuthenticated, loading, user, router])

  // Show loading while checking
  if (loading || !isAuthenticated || !canAccessAdminPanel(user)) {
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
