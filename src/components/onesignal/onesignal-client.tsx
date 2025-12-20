'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/auth'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    OneSignalDeferred?: Promise<any>
    OneSignal?: any
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

interface OneSignalClientProps {
  appId: string
}

export function OneSignalClient({ appId }: OneSignalClientProps) {
  const { user, isLoggedIn } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)
  const [playerId, setPlayerId] = useState<string | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Initialize OneSignal
    const initOneSignal = async () => {
      try {
        // Load OneSignal SDK
        if (!window.OneSignalDeferred) {
          const script = document.createElement('script')
          script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
          script.async = true
          
          // Add error handler for script loading
          script.onerror = () => {
            // Silent fail - OneSignal is optional
            return
          }
          
          document.head.appendChild(script)

          // Wait for script to load with timeout
          await Promise.race([
            new Promise((resolve) => {
              script.onload = resolve
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('OneSignal SDK load timeout')), 10000)
            )
          ])
        }

        // Wait for OneSignal to be ready with timeout
        const OneSignal = await Promise.race([
          window.OneSignalDeferred,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('OneSignal initialization timeout')), 10000)
          )
        ])

        // Check if OneSignal loaded properly
        if (!OneSignal || typeof OneSignal.init !== 'function') {
          // Silent fail - don't show warning for optional feature
          return
        }

        // Check if app ID is provided
        if (!appId) {
          // Silent fail - don't show warning for optional feature
          return
        }

        // Initialize
        await OneSignal.init({
          appId: appId,
          safari_web_id: 'web.onesignal.auto.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          notifyButton: {
            enable: false, // We'll use custom UI
          },
          allowLocalhostAsSecureOrigin: true, // For development
        })

        setIsInitialized(true)
        // OneSignal initialized successfully - silent mode

        // Listen for subscription changes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        OneSignal.User.PushSubscription.addEventListener('change', async (event: any) => {
          // Subscription changed - silent mode
          
          if (event.current.id) {
            setPlayerId(event.current.id)
            
            // Register player ID with backend if user is authenticated
            if (isLoggedIn && user?.id) {
              await registerPlayerId(user.id, event.current.id)
            }
          }
        })

        // Check current subscription
        const currentSubscription = await OneSignal.User.PushSubscription.id
        if (currentSubscription) {
          setPlayerId(currentSubscription)
          
          if (isLoggedIn && user?.id) {
            await registerPlayerId(user.id, currentSubscription)
          }
        }

      } catch (error) {
        // Silent fail - don't spam console with errors
        // OneSignal is optional feature, app should work without it
        console.info('Push notifications not available:', error instanceof Error ? error.message : 'Unknown error')
      }
    }

    initOneSignal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId])

  // Handle user authentication changes
  useEffect(() => {
    if (!isInitialized || !window.OneSignal) return

    const handleAuthChange = async () => {
      try {
        if (isLoggedIn && user?.id) {
          // User logged in - register or update player ID
          if (playerId) {
            await registerPlayerId(user.id, playerId)
          }

          // Set external user ID
          await window.OneSignal.login(user.id)
          // OneSignal user logged in - silent mode
        } else {
          // User logged out - logout from OneSignal
          await window.OneSignal.logout()
          // OneSignal user logged out - silent mode
        }
      } catch (error) {
        // Silent fail for auth changes
        console.info('OneSignal auth update skipped:', error instanceof Error ? error.message : 'Unknown error')
      }
    }

    handleAuthChange()
  }, [isLoggedIn, user?.id, isInitialized, playerId])

  return null // This component doesn't render anything
}

/**
 * Register player ID with backend
 */
async function registerPlayerId(userId: string, playerId: string) {
  try {
    const response = await fetch('/api/user/onesignal/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        playerId,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to register player ID')
    }

    // Player ID registered successfully - silent mode
  } catch (error) {
    console.error('Error registering player ID:', error)
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
  if (!window.OneSignal) {
    console.info('OneSignal not available. Cannot request notification permission.')
    return false
  }

  try {
    const permission = await window.OneSignal.Notifications.requestPermission()
    // Notification permission granted - silent mode
    return permission
  } catch (error) {
    console.info('Error requesting notification permission:', error instanceof Error ? error.message : 'Unknown error')
    return false
  }
}

/**
 * Check if notifications are enabled
 */
export async function isNotificationEnabled() {
  if (!window.OneSignal) return false

  try {
    const permission = await window.OneSignal.Notifications.permission
    return permission
  } catch {
    return false
  }
}
