'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'
import { useToast } from '@/components/ui/toast'

/**
 * Hook to check authentication and redirect if not logged in
 */
export function useAuthGuard() {
  const router = useRouter()
  const { isLoggedIn, loading } = useAuthStore()
  const { showToast } = useToast()

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      showToast('Silakan login terlebih dahulu', 'info')
      router.push('/login')
    }
  }, [isLoggedIn, loading, router, showToast])

  return { isLoggedIn, loading }
}

/**
 * Hook to check authentication for specific actions (like favorite, negotiate)
 */
export function useRequireAuth() {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()
  const { showToast } = useToast()

  const requireAuth = (callback: () => void, redirectPath?: string) => {
    if (!isLoggedIn) {
      showToast('Silakan login terlebih dahulu', 'info')
      router.push(`/login?redirect=${encodeURIComponent(redirectPath || window.location.pathname)}`)
      return false
    }
    callback()
    return true
  }

  return { requireAuth, isLoggedIn }
}
