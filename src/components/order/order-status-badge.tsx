'use client'

import type { Order } from '@/services/order.service'
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package,
  Truck,
  Home
} from 'lucide-react'

interface OrderStatusBadgeProps {
  status: Order['status']
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

export function getStatusConfig(status: Order['status']) {
  const configs = {
    pending: {
      label: 'Menunggu Konfirmasi',
      colorClass: 'bg-warning-100 text-warning-700',
      icon: Clock,
      description: 'Pesanan sedang menunggu konfirmasi dari admin',
      actionable: false
    },
    confirmed: {
      label: 'Dikonfirmasi',
      colorClass: 'bg-info-100 text-info-700',
      icon: CheckCircle2,
      description: 'Pesanan telah dikonfirmasi dan akan segera diproses',
      actionable: false
    },
    processing: {
      label: 'Diproses',
      colorClass: 'bg-primary-100 text-primary-700',
      icon: Package,
      description: 'Pesanan sedang diproses dan dikemas',
      actionable: false
    },
    shipped: {
      label: 'Dikirim',
      colorClass: 'bg-info-100 text-info-700',
      icon: Truck,
      description: 'Pesanan sedang dalam pengiriman',
      actionable: false
    },
    delivered: {
      label: 'Diterima',
      colorClass: 'bg-success-100 text-success-700',
      icon: Home,
      description: 'Pesanan telah diterima',
      actionable: true
    },
    completed: {
      label: 'Selesai',
      colorClass: 'bg-success-100 text-success-700',
      icon: CheckCircle2,
      description: 'Transaksi telah selesai',
      actionable: false
    },
    cancelled: {
      label: 'Dibatalkan',
      colorClass: 'bg-error-100 text-error-700',
      icon: XCircle,
      description: 'Pesanan telah dibatalkan',
      actionable: false
    }
  }

  return configs[status] || configs.pending
}
