'use client'

import { formatDate } from '@/lib/utils/date'
import { getStatusConfig } from './order-status-badge'
import type { OrderStatus } from '@/services/order.service'
import type { OrderStatusLog } from '@/services/order.service'

interface OrderTimelineProps {
  logs: OrderStatusLog[]
}

export function OrderTimeline({ logs = [] }: OrderTimelineProps) {
  if (logs.length === 0) {
    return (
      <div className="text-sm text-neutral-600 text-center py-4">
        Belum ada riwayat status
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {logs.map((log, index) => {
        const config = getStatusConfig(log.to_status as OrderStatus)
        const Icon = config.icon
        const isLast = index === logs.length - 1

        return (
          <div key={log.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-100">
                <Icon className="w-4 h-4 text-primary-600" />
              </div>
              {!isLast && (
                <div className="w-0.5 h-12 mt-2 bg-neutral-200" />
              )}
            </div>
            <div className="flex-1 pb-6">
              <p className="font-medium text-neutral-900">
                {config.label}
              </p>
              <p className="text-sm text-neutral-600 mt-0.5">
                {formatDate(log.created_at)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
