'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead,
  deleteNotification 
} from '@/services/notification.service'
import { formatRelativeTime } from '@/lib/utils/date'
import type { Notification } from '@/services/notification.service'
import { 
  Bell, 
  Package, 
  TrendingDown, 
  ShoppingBag,
  AlertCircle,
  Trash2
} from 'lucide-react'

export function NotificationsClient() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getNotifications()
      setNotifications(data)
    } catch (err) {
      console.error('Failed to load notifications:', err)
      setError('Gagal memuat notifikasi')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      try {
        await markAsRead(notification.id)
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
        )
      } catch (err) {
        console.error('Failed to mark as read:', err)
      }
    }

    // Handle deep linking based on notification type
    if (notification.data) {
      const data = notification.data as Record<string, unknown>

      switch (notification.type) {
        case 'order':
          if (data.order_id) {
            router.push(`/orders/${data.order_id}`)
          }
          break
        case 'negotiation':
          if (data.negotiation_id) {
            router.push(`/negotiations/${data.negotiation_id}`)
          }
          break
        case 'product':
          if (data.product_id) {
            router.push(`/products/${data.product_id}`)
          }
          break
        default:
          // No action for system notifications
          break
      }
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch (err) {
      console.error('Failed to mark all as read:', err)
      alert('Gagal menandai semua sebagai dibaca')
    }
  }

  const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm('Hapus notifikasi ini?')) return

    try {
      await deleteNotification(notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    } catch (err) {
      console.error('Failed to delete notification:', err)
      alert('Gagal menghapus notifikasi')
    }
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-primary-600" />
      case 'negotiation':
        return <TrendingDown className="w-5 h-5 text-warning-600" />
      case 'product':
        return <ShoppingBag className="w-5 h-5 text-success-600" />
      case 'system':
        return <AlertCircle className="w-5 h-5 text-info-600" />
      default:
        return <Bell className="w-5 h-5 text-neutral-600" />
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  if (error) {
    return (
      <AuthGuard>
        <MobileHeader title="Notifikasi" showBack />
        <div className="container-mobile py-12">
          <ErrorState 
            message={error}
            onRetry={loadNotifications}
          />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <MobileHeader 
        title="Notifikasi" 
        showBack
        actions={
          unreadCount > 0 ? (
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Tandai Semua
            </button>
          ) : undefined
        }
      />

      <div className="container-mobile py-4">
        {isLoading ? (
          <LoadingState message="Memuat notifikasi..." />
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-10 h-10 text-neutral-400" />}
            title="Belum Ada Notifikasi"
            description="Notifikasi tentang pesanan dan negosiasi akan muncul di sini"
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white border rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-all ${
                  notification.is_read ? 'border-neutral-200' : 'border-primary-200 bg-primary-50/30'
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium text-neutral-900">
                        {notification.title}
                      </h3>
                      {!notification.is_read && (
                        <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    
                    <p className="text-sm text-neutral-600 mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-neutral-500">
                        {formatRelativeTime(notification.created_at)}
                      </p>
                      
                      <button
                        onClick={(e) => handleDelete(notification.id, e)}
                        className="p-1 hover:bg-neutral-100 rounded transition-colors"
                        aria-label="Hapus notifikasi"
                      >
                        <Trash2 className="w-4 h-4 text-neutral-500" />
                      </button>
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
