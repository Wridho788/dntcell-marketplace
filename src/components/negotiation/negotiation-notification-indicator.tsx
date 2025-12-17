'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { getNotifications } from '@/services/notification.service'

export function NegotiationNotificationIndicator() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadUnreadCount()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const loadUnreadCount = async () => {
    try {
      const notifications = await getNotifications()
      const unreadNegotiations = notifications.filter(
        n => !n.is_read && n.type === 'negotiation'
      )
      setUnreadCount(unreadNegotiations.length)
    } catch (error) {
      console.error('Failed to load notification count:', error)
    }
  }

  if (unreadCount === 0) return null

  return (
    <div className="relative inline-block">
      <Bell className="w-5 h-5 text-neutral-600" />
      <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    </div>
  )
}
