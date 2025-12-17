/* eslint-disable @next/next/no-img-element */
'use client'

import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react'
import { Button } from './button'
import { useState, useEffect } from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProductErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (hasError) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <AlertCircle className="w-16 h-16 text-error-500 mb-4" />
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          Terjadi Kesalahan
        </h2>
        <p className="text-neutral-600 text-center mb-4">
          Maaf, ada yang salah. Silakan coba lagi.
        </p>
        <Button onClick={() => {
          setHasError(false)
          window.location.reload()
        }}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Muat Ulang
        </Button>
      </div>
    )
  }

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <WifiOff className="w-16 h-16 text-warning-500 mb-4" />
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          Tidak Ada Koneksi
        </h2>
        <p className="text-neutral-600 text-center mb-4">
          Periksa koneksi internet Anda dan coba lagi.
        </p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Coba Lagi
        </Button>
      </div>
    )
  }

  return <>{children}</>
}

interface SlowLoadingIndicatorProps {
  isLoading: boolean
  threshold?: number // milliseconds
}

export function SlowLoadingIndicator({ 
  isLoading, 
  threshold = 3000 
}: SlowLoadingIndicatorProps) {
  const [showSlowWarning, setShowSlowWarning] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setShowSlowWarning(false)
      return
    }

    const timer = setTimeout(() => {
      setShowSlowWarning(true)
    }, threshold)

    return () => clearTimeout(timer)
  }, [isLoading, threshold])

  if (!showSlowWarning) return null

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-warning-50 border border-warning-200 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <div className="flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-warning-600 animate-pulse" />
        <div>
          <p className="text-sm font-medium text-warning-900">
            Koneksi Lambat
          </p>
          <p className="text-xs text-warning-700">
            Memuat data memakan waktu lebih lama dari biasanya...
          </p>
        </div>
      </div>
    </div>
  )
}

interface ImageFallbackProps {
  src?: string
  alt: string
  className?: string
  fallbackIcon?: React.ReactNode
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className = '',
  fallbackIcon 
}: ImageFallbackProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  if (!src || error) {
    return (
      <div className={`bg-neutral-100 flex items-center justify-center ${className}`}>
        {fallbackIcon || (
          <div className="text-neutral-400">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {loading && (
        <div className={`bg-neutral-200 animate-pulse ${className}`} />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true)
          setLoading(false)
        }}
        style={{ display: loading ? 'none' : 'block' }}
      />
    </>
  )
}
