'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Product Discovery & Trust UX Cache Strategy
            staleTime: 2 * 60 * 1000, // 2 minutes - Product data refreshes reasonably fast
            gcTime: 10 * 60 * 1000, // 10 minutes - Keep data in cache longer
            refetchOnWindowFocus: true, // Refetch when user returns to tab
            refetchOnReconnect: true, // Refetch when connection restored
            retry: 2, // Retry failed requests twice
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
            refetchOnMount: 'always', // Always refetch on component mount for fresh data
          },
          mutations: {
            // Mutation defaults
            retry: 1,
            retryDelay: 1000,
          },
        },
      })
  )

  useEffect(() => {
    // Listen for logout event and clear cache
    const handleLogout = () => {
      queryClient.clear()
    }

    // Listen for manual refresh event
    const handleRefresh = () => {
      queryClient.invalidateQueries()
    }

    window.addEventListener('auth-logout', handleLogout)
    window.addEventListener('app-refresh', handleRefresh)
    
    return () => {
      window.removeEventListener('auth-logout', handleLogout)
      window.removeEventListener('app-refresh', handleRefresh)
    }
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
