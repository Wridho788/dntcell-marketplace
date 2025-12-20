'use client'

import type { OrderStatus } from '@/services/order.service'
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HandshakeIcon,
  DollarSign
} from 'lucide-react'

interface OrderStatusBadgeProps {
  status: OrderStatus
  size?: 'sm' | 'md' | 'lg'
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const config = getStatusConfig(status)

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${config.colorClass} ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      {config.label}
    </span>
  )
}

export function getStatusConfig(status: OrderStatus) {
  const configs: Record<OrderStatus, {
    label: string
    colorClass: string
    icon: React.ComponentType<{ className?: string }>
    description: string
    actionable: boolean
    canCancel: boolean
  }> = {
    created: {
      label: 'Pesanan Dibuat',
      colorClass: 'bg-warning-100 text-warning-700',
      icon: Clock,
      description: 'Pesanan berhasil dibuat, silakan lakukan pembayaran',
      actionable: true,
      canCancel: true
    },
    waiting_meetup: {
      label: 'Menunggu Pertemuan',
      colorClass: 'bg-purple-100 text-purple-700',
      icon: HandshakeIcon,
      description: 'Menunggu jadwal pertemuan untuk transaksi',
      actionable: false,
      canCancel: true
    },
    meeting_done: {
      label: 'Pertemuan Selesai',
      colorClass: 'bg-info-100 text-info-700',
      icon: CheckCircle2,
      description: 'Pertemuan telah dilakukan, menunggu konfirmasi',
      actionable: false,
      canCancel: false
    },
    paid: {
      label: 'Sudah Dibayar',
      colorClass: 'bg-success-100 text-success-700',
      icon: DollarSign,
      description: 'Pembayaran sudah dikonfirmasi',
      actionable: false,
      canCancel: false
    },
    completed: {
      label: 'Selesai',
      colorClass: 'bg-success-100 text-success-700',
      icon: CheckCircle2,
      description: 'Transaksi telah selesai',
      actionable: false,
      canCancel: false
    },
    cancelled: {
      label: 'Dibatalkan',
      colorClass: 'bg-error-100 text-error-700',
      icon: XCircle,
      description: 'Pesanan telah dibatalkan',
      actionable: false,
      canCancel: false
    }
  }

  return configs[status] || configs.created
}
