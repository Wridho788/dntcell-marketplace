'use client'

import { useState, useEffect } from 'react'
import { Wifi, WifiOff } from 'lucide-react'

export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineToast, setShowOfflineToast] = useState(false)

  useEffect(() => {
    // Initialize with current status
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineToast(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineToast(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Auto-hide toast after reconnecting
  useEffect(() => {
    if (isOnline && showOfflineToast) {
      const timer = setTimeout(() => {
        setShowOfflineToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, showOfflineToast])

  if (!showOfflineToast && isOnline) return null

  return (
    <div
      className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        showOfflineToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
          isOnline
            ? 'bg-success-50 border border-success-200 text-success-900'
            : 'bg-error-50 border border-error-200 text-error-900'
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Koneksi kembali</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Tidak ada koneksi</span>
          </>
        )}
      </div>
    </div>
  )
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setWasOffline(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, wasOffline }
}
