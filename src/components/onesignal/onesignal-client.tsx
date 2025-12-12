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
          document.head.appendChild(script)

          // Wait for script to load
          await new Promise((resolve) => {
            script.onload = resolve
          })
        }

        // Wait for OneSignal to be ready
        const OneSignal = await window.OneSignalDeferred

        // Check if OneSignal loaded properly
        if (!OneSignal || typeof OneSignal.init !== 'function') {
          console.error('OneSignal SDK failed to load properly')
          return
        }

        // Check if app ID is provided
        if (!appId) {
          console.warn('OneSignal App ID not provided. Push notifications will not work.')
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
        console.log('OneSignal initialized successfully')

        // Listen for subscription changes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        OneSignal.User.PushSubscription.addEventListener('change', async (event: any) => {
          console.log('Push subscription changed:', event)
          
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
        console.error('Error initializing OneSignal:', error)
      }
    }

    initOneSignal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId])

  // Handle user authentication changes
  useEffect(() => {
    if (!isInitialized || !window.OneSignal) return

    const handleAuthChange = async () => {
      if (isLoggedIn && user?.id) {
        // User logged in - register or update player ID
        if (playerId) {
          await registerPlayerId(user.id, playerId)
        }

        // Set external user ID
        try {
          await window.OneSignal.login(user.id)
          console.log('OneSignal external user ID set:', user.id)
        } catch (error) {
          console.error('Error setting OneSignal external user ID:', error)
        }
      } else {
        // User logged out - logout from OneSignal
        try {
          await window.OneSignal.logout()
          console.log('OneSignal user logged out')
        } catch (error) {
          console.error('Error logging out from OneSignal:', error)
        }
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

    console.log('Player ID registered successfully:', playerId)
  } catch (error) {
    console.error('Error registering player ID:', error)
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
  if (!window.OneSignal) {
    console.error('OneSignal not initialized')
    return false
  }

  try {
    const permission = await window.OneSignal.Notifications.requestPermission()
    console.log('Notification permission:', permission)
    return permission
  } catch (error) {
    console.error('Error requesting notification permission:', error)
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
  } catch (error) {
    console.error('Error checking notification permission:', error)
    return false
  }
}
