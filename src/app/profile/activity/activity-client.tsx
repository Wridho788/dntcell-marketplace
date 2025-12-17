'use client'

import { useState, useEffect } from 'react'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { LoadingState } from '@/components/ui/loading-state'
import { EmptyState } from '@/components/ui/empty-state'
import { Activity, ShoppingBag, TrendingDown, Package, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils/date'

interface ActivityItem {
  id: string
  type: 'order_created' | 'order_status_changed' | 'negotiation_approved' | 'negotiation_rejected' | 'negotiation_created'
  title: string
  description: string
  timestamp: string
  icon: React.ReactNode
  color: string
}

export function ActivityClient() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      // TODO: Load actual activity data from API
    }, 1000)
  }, [])

  const getIconForType = (type: string) => {
    switch (type) {
      case 'order_created':
        return <ShoppingBag className="w-5 h-5" />
      case 'order_status_changed':
        return <Package className="w-5 h-5" />
      case 'negotiation_approved':
        return <CheckCircle2 className="w-5 h-5" />
      case 'negotiation_rejected':
        return <XCircle className="w-5 h-5" />
      case 'negotiation_created':
        return <TrendingDown className="w-5 h-5" />
      default:
        return <Activity className="w-5 h-5" />
    }
  }

  const getColorForType = (type: string) => {
    switch (type) {
      case 'order_created':
      case 'negotiation_approved':
        return 'bg-success-100 text-success-600'
      case 'order_status_changed':
        return 'bg-primary-100 text-primary-600'
      case 'negotiation_rejected':
        return 'bg-error-100 text-error-600'
      case 'negotiation_created':
        return 'bg-warning-100 text-warning-600'
      default:
        return 'bg-neutral-100 text-neutral-600'
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <MobileHeader title="Aktivitas & Riwayat" showBack />
        <LoadingState message="Memuat aktivitas..." />
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <MobileHeader title="Aktivitas & Riwayat" showBack />

      <div className="container-mobile py-6">
        {activities.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={<Activity className="w-10 h-10 text-neutral-400" />}
              title="Belum Ada Aktivitas"
              description="Riwayat aktivitas transaksi Anda akan muncul di sini"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id}>
                {/* Date Separator */}
                {(index === 0 || new Date(activity.timestamp).toDateString() !== new Date(activities[index - 1].timestamp).toDateString()) && (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-medium text-neutral-600">
                      {formatDate(activity.timestamp)}
                    </span>
                    <div className="flex-1 h-px bg-neutral-200" />
                  </div>
                )}

                {/* Activity Card */}
                <div className="bg-white rounded-lg border border-neutral-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.color}`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-neutral-900 mb-1">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-neutral-600 mb-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-neutral-500">
                        <Clock className="w-3 h-3" />
                        {new Date(activity.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
