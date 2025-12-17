'use client'

import { formatDate } from '@/lib/utils/date'
import { getStatusConfig } from './order-status-badge'
import type { Order } from '@/services/order.service'
import type { OrderStatusLog } from '@/services/order.service'

interface OrderTimelineProps {
  order: Order
  statusLogs?: OrderStatusLog[]
}

export function OrderTimeline({ order, statusLogs = [] }: OrderTimelineProps) {
  // Define the standard order flow
  const standardFlow: Order['status'][] = [
    'pending',
    'confirmed', 
    'processing',
    'shipped',
    'delivered',
    'completed'
  ]

  // Get current status index
  const currentIndex = standardFlow.indexOf(order.status)
  
  // If cancelled, show cancelled status
  if (order.status === 'cancelled') {
    const cancelLog = statusLogs.find(log => log.status === 'cancelled')
    const config = getStatusConfig('cancelled')
    const Icon = config.icon

    return (
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-error-100`}>
              <Icon className="w-4 h-4 text-error-600" />
            </div>
            <div className="w-0.5 h-full bg-error-200 mt-2" />
          </div>
          <div className="flex-1 pb-6">
            <p className="font-medium text-neutral-900">{config.label}</p>
            <p className="text-sm text-neutral-600 mt-0.5">
              {cancelLog ? formatDate(cancelLog.created_at) : formatDate(order.updated_at)}
            </p>
            {cancelLog?.notes && (
              <p className="text-sm text-neutral-600 mt-2 p-2 bg-neutral-50 rounded">
                {cancelLog.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {standardFlow.map((status, index) => {
        const config = getStatusConfig(status)
        const Icon = config.icon
        const isCompleted = index <= currentIndex
        const isCurrent = index === currentIndex
        const isLast = index === standardFlow.length - 1

        // Find log for this status
        const log = statusLogs.find(l => l.status === status)

        return (
          <div key={status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted 
                    ? isCurrent
                      ? 'bg-primary-500 ring-4 ring-primary-100'
                      : 'bg-success-500'
                    : 'bg-neutral-200'
                }`}
              >
                <Icon 
                  className={`w-4 h-4 ${
                    isCompleted ? 'text-white' : 'text-neutral-500'
                  }`} 
                />
              </div>
              {!isLast && (
                <div 
                  className={`w-0.5 h-12 mt-2 transition-colors ${
                    isCompleted ? 'bg-success-300' : 'bg-neutral-200'
                  }`} 
                />
              )}
            </div>
            <div className="flex-1 pb-6">
              <p className={`font-medium ${
                isCompleted ? 'text-neutral-900' : 'text-neutral-500'
              }`}>
                {config.label}
              </p>
              {log && (
                <p className="text-sm text-neutral-600 mt-0.5">
                  {formatDate(log.created_at)}
                </p>
              )}
              {log?.notes && (
                <p className="text-sm text-neutral-600 mt-2 p-2 bg-neutral-50 rounded">
                  {log.notes}
                </p>
              )}
              {!isCompleted && index === currentIndex + 1 && (
                <p className="text-xs text-neutral-500 mt-1">
                  Menunggu proses selanjutnya
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
