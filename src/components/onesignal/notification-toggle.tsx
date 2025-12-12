'use client'

import { useState } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOneSignal } from '@/hooks/useOneSignal'

interface NotificationToggleProps {
  className?: string
  showLabel?: boolean
}

/**
 * Component to toggle push notifications on/off
 * Can be used in settings page or navbar
 */
export function NotificationToggle({ className = '', showLabel = true }: NotificationToggleProps) {
  const { isInitialized, isSubscribed, permission, requestPermission, optIn, optOut } = useOneSignal()
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)

    try {
      if (!isSubscribed) {
        // Not subscribed - request permission and opt in
        if (permission === 'default') {
          const granted = await requestPermission()
          if (!granted) {
            alert('Izin notifikasi ditolak. Silakan aktifkan di pengaturan browser Anda.')
            return
          }
        }

        await optIn()
      } else {
        // Already subscribed - opt out
        await optOut()
      }
    } catch (error) {
      console.error('Error toggling notifications:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isInitialized) {
    return null
  }

  return (
    <Button
      variant={isSubscribed ? 'primary' : 'outline'}
      onClick={handleToggle}
      disabled={isLoading || permission === 'denied'}
      className={className}
    >
      {isSubscribed ? (
        <Bell className="w-4 h-4" />
      ) : (
        <BellOff className="w-4 h-4" />
      )}
      {showLabel && (
        <span className="ml-2">
          {isLoading
            ? 'Loading...'
            : isSubscribed
            ? 'Notifikasi Aktif'
            : 'Aktifkan Notifikasi'}
        </span>
      )}
    </Button>
  )
}

/**
 * Simple notification status indicator
 */
export function NotificationStatus() {
  const { isSubscribed, permission } = useOneSignal()

  if (permission === 'denied') {
    return (
      <div className="text-sm text-red-600">
        ❌ Notifikasi diblokir
      </div>
    )
  }

  return (
    <div className={`text-sm ${isSubscribed ? 'text-green-600' : 'text-gray-600'}`}>
      {isSubscribed ? '✅ Notifikasi aktif' : '🔕 Notifikasi nonaktif'}
    </div>
  )
}
