'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { OrderStatusBadge } from '@/components/order/order-status-badge'
import { useOrders } from '@/hooks/useOrders'
import { formatCurrency } from '@/lib/utils/format'
import { formatRelativeTime } from '@/lib/utils/date'
import { Package, ArrowRight, ShoppingBag } from 'lucide-react'

type TabType = 'active' | 'completed' | 'cancelled'

export function OrdersListClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('active')
  const { data: orders, isLoading, error, refetch } = useOrders()

  const filterByTab = (tab: TabType) => {
    if (!orders) return []
    
    switch (tab) {
      case 'active':
        return orders.filter(o => ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].includes(o.status))
      case 'completed':
        return orders.filter(o => o.status === 'completed')
      case 'cancelled':
        return orders.filter(o => o.status === 'cancelled')
      default:
        return orders
    }
  }

  const filteredOrders = filterByTab(activeTab)
  const activeCounts = {
    active: orders?.filter(o => ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].includes(o.status)).length || 0,
    completed: orders?.filter(o => o.status === 'completed').length || 0,
    cancelled: orders?.filter(o => o.status === 'cancelled').length || 0
  }

  const renderEmptyState = () => {
    const emptyStates = {
      active: {
        icon: <Package className="w-10 h-10 text-neutral-400" />,
        title: 'Belum Ada Pesanan Aktif',
        description: 'Pesanan aktif Anda akan muncul di sini'
      },
      completed: {
        icon: <Package className="w-10 h-10 text-neutral-400" />,
        title: 'Belum Ada Pesanan Selesai',
        description: 'Riwayat pesanan yang selesai akan muncul di sini'
      },
      cancelled: {
        icon: <Package className="w-10 h-10 text-neutral-400" />,
        title: 'Belum Ada Pesanan Dibatalkan',
        description: 'Pesanan yang dibatalkan akan muncul di sini'
      }
    }

    const state = emptyStates[activeTab]
    
    return (
      <EmptyState
        icon={state.icon}
        title={state.title}
        description={state.description}
        action={{
          label: 'Lihat Produk',
          onClick: () => router.push('/products')
        }}
      />
    )
  }

  if (error) {
    return (
      <AuthGuard>
        <MobileHeader title="Pesanan Saya" showBack />
        <div className="container-mobile py-12">
          <ErrorState 
            message="Gagal memuat daftar pesanan"
            onRetry={refetch}
          />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <MobileHeader title="Pesanan Saya" showBack />

      {/* Tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-neutral-200">
        <div className="container-mobile">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'active'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Aktif {activeCounts.active > 0 && `(${activeCounts.active})`}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'completed'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Selesai {activeCounts.completed > 0 && `(${activeCounts.completed})`}
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'cancelled'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Dibatalkan {activeCounts.cancelled > 0 && `(${activeCounts.cancelled})`}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-mobile py-4">
        {isLoading ? (
          <LoadingState message="Memuat pesanan..." />
        ) : filteredOrders.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white rounded-lg border border-neutral-200 p-4 hover:border-primary-500 hover:shadow-sm transition-all"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-xs text-neutral-600 mb-1">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <OrderStatusBadge status={order.status} size="sm" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 shrink-0" />
                </div>

                {/* Product Info */}
                {order.product ? (
                  <div className="flex gap-3 mb-3">
                    <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-neutral-200">
                      <Image
                        src={order.product.image || '/images/placeholder.png'}
                        alt={order.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-neutral-900 mb-1 line-clamp-2 text-sm">
                        {order.product.name}
                      </h3>
                      <p className="text-base font-bold text-primary-600">
                        {formatCurrency(order.final_price)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-3 text-sm text-neutral-600">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Produk tidak tersedia</span>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                  <p className="text-xs text-neutral-600">
                    {formatRelativeTime(order.updated_at)}
                  </p>
                  {order.payment_method && (
                    <p className="text-xs text-neutral-600">
                      {order.payment_method === 'cod' && 'COD'}
                      {order.payment_method === 'transfer' && 'Transfer'}
                      {order.payment_method === 'ewallet' && 'E-Wallet'}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
