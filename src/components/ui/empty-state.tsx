'use client'

import { AlertCircle, WifiOff, Package, Frown } from 'lucide-react'
import { Button } from './button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        {icon || <Package className="w-10 h-10 text-neutral-400" />}
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2 leading-[1.4]">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-600 mb-6 max-w-sm leading-[1.6]">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}

export function EmptyList() {
  return (
    <EmptyState
      icon={<Package className="w-10 h-10 text-neutral-400" />}
      title="Belum ada produk"
      description="Produk akan muncul di sini setelah ditambahkan"
    />
  )
}

export function FetchError({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<AlertCircle className="w-10 h-10 text-error-500" />}
      title="Terjadi kesalahan"
      description="Gagal memuat data. Silakan coba lagi."
      action={
        onRetry
          ? {
              label: 'Coba Lagi',
              onClick: onRetry,
            }
          : undefined
      }
    />
  )
}

export function NoInternet({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<WifiOff className="w-10 h-10 text-warning-500" />}
      title="Tidak ada koneksi internet"
      description="Periksa koneksi internet Anda dan coba lagi."
      action={
        onRetry
          ? {
              label: 'Coba Lagi',
              onClick: onRetry,
            }
          : undefined
      }
    />
  )
}

export function NoResults({ searchQuery }: { searchQuery?: string }) {
  return (
    <EmptyState
      icon={<Frown className="w-10 h-10 text-neutral-400" />}
      title="Tidak ada hasil"
      description={
        searchQuery
          ? `Tidak menemukan hasil untuk "${searchQuery}"`
          : 'Tidak ada produk yang sesuai dengan filter Anda'
      }
    />
  )
}
