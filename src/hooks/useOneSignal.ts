/**
 * OneSignal Hook for React Components
 * Provides easy access to OneSignal functionality in components
 */

'use client'

import { useState, useEffect } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    OneSignal?: any
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function useOneSignal() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [permission, setPermission] = useState<'default' | 'granted' | 'denied'>('default')

  useEffect(() => {
    const checkOneSignal = async () => {
      if (typeof window === 'undefined' || !window.OneSignal) {
        return
      }

      try {
        setIsInitialized(true)

        // Check subscription status
        const subscription = await window.OneSignal.User.PushSubscription.id
        setIsSubscribed(!!subscription)
        setPlayerId(subscription)

        // Check permission
        const perm = await window.OneSignal.Notifications.permission
        setPermission(perm ? 'granted' : 'default')
      } catch (error) {
        console.error('Error checking OneSignal:', error)
      }
    }

    // Check initially
    checkOneSignal()

    // Set up interval to check periodically
    const interval = setInterval(checkOneSignal, 2000)

    return () => clearInterval(interval)
  }, [])

  /**
   * Request notification permission
   */
  const requestPermission = async () => {
    if (!window.OneSignal) {
      console.error('OneSignal not initialized')
      return false
    }

    try {
      const result = await window.OneSignal.Notifications.requestPermission()
      setPermission(result ? 'granted' : 'denied')
      return result
    } catch (error) {
      console.error('Error requesting permission:', error)
      return false
    }
  }

  /**
   * Opt in to push notifications
   */
  const optIn = async () => {
    if (!window.OneSignal) return false

    try {
      await window.OneSignal.User.PushSubscription.optIn()
      setIsSubscribed(true)
      return true
    } catch (error) {
      console.error('Error opting in:', error)
      return false
    }
  }

  /**
   * Opt out of push notifications
   */
  const optOut = async () => {
    if (!window.OneSignal) return false

    try {
      await window.OneSignal.User.PushSubscription.optOut()
      setIsSubscribed(false)
      return true
    } catch (error) {
      console.error('Error opting out:', error)
      return false
    }
  }

  /**
   * Get current player ID
   */
  const getPlayerId = async () => {
    if (!window.OneSignal) return null

    try {
      const id = await window.OneSignal.User.PushSubscription.id
      setPlayerId(id)
      return id
    } catch (error) {
      console.error('Error getting player ID:', error)
      return null
    }
  }

  return {
    isInitialized,
    isSubscribed,
    playerId,
    permission,
    requestPermission,
    optIn,
    optOut,
    getPlayerId,
  }
}
