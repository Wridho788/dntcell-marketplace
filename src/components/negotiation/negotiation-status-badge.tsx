'use client'

import { Clock, CheckCircle2, XCircle, TimerOff, ShoppingBag } from 'lucide-react'
import type { NegotiationStatus } from '@/services/negotiation.service'

interface NegotiationStatusBadgeProps {
  status: NegotiationStatus
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function NegotiationStatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true 
}: NegotiationStatusBadgeProps) {
  const config = {
    pending: {
      label: 'Menunggu Review',
      color: 'bg-warning-100 text-warning-800 border-warning-200',
      icon: Clock,
      description: 'Penawaran Anda sedang ditinjau admin'
    },
    approved: {
      label: 'Disetujui',
      color: 'bg-success-100 text-success-800 border-success-200',
      icon: CheckCircle2,
      description: 'Penawaran Anda telah disetujui! Silakan lanjutkan pembelian'
    },
    rejected: {
      label: 'Belum Disetujui',
      color: 'bg-error-100 text-error-800 border-error-200',
      icon: XCircle,
      description: 'Penawaran belum dapat disetujui saat ini'
    },
    expired: {
      label: 'Kadaluarsa',
      color: 'bg-neutral-100 text-neutral-800 border-neutral-200',
      icon: TimerOff,
      description: 'Penawaran sudah melewati batas waktu'
    },
    used: {
      label: 'Telah Digunakan',
      color: 'bg-primary-100 text-primary-800 border-primary-200',
      icon: ShoppingBag,
      description: 'Penawaran telah digunakan untuk pembelian'
    }
  }

  const statusConfig = config[status] || config.pending
  const Icon = statusConfig.icon

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-lg border ${statusConfig.color} ${sizeClasses[size]}`}>
      {showIcon && <Icon className={iconSizes[size]} />}
      {statusConfig.label}
    </span>
  )
}

export function getStatusConfig(status: NegotiationStatus) {
  const configs = {
    pending: {
      label: 'Menunggu Review',
      color: 'warning',
      description: 'Penawaran Anda sedang ditinjau admin',
      actionable: false
    },
    approved: {
      label: 'Disetujui',
      color: 'success',
      description: 'Penawaran Anda telah disetujui! Silakan lanjutkan pembelian',
      actionable: true
    },
    rejected: {
      label: 'Belum Disetujui',
      color: 'error',
      description: 'Penawaran belum dapat disetujui saat ini',
      actionable: true
    },
    expired: {
      label: 'Kadaluarsa',
      color: 'neutral',
      description: 'Penawaran sudah melewati batas waktu',
      actionable: false
    },
    used: {
      label: 'Telah Digunakan',
      color: 'primary',
      description: 'Penawaran telah digunakan untuk pembelian',
      actionable: false
    }
  }

  return configs[status] || configs.pending
}
