'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { OrderStatusBadge, getStatusConfig } from '@/components/order/order-status-badge'
import { OrderTimeline } from '@/components/order/order-timeline'
import { getOrderById, getOrderStatusLogs, cancelOrder } from '@/services/order.service'
import { formatCurrency } from '@/lib/utils/format'
import { formatDate } from '@/lib/utils/date'
import { logUserAction } from '@/lib/utils/logger'
import type { Order, OrderStatusLog } from '@/services/order.service'
import { 
  Package, 
  MapPin, 
  CreditCard, 
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react'

interface OrderDetailClientProps {
  orderId: string
}

export function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [statusLogs, setStatusLogs] = useState<OrderStatusLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const loadOrder = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const [orderData, logs] = await Promise.all([
        getOrderById(orderId),
        getOrderStatusLogs(orderId)
      ])
      
      setOrder(orderData)
      setStatusLogs(logs)

      logUserAction('order_viewed', {
        order_id: orderId,
        status: orderData.status
      })
    } catch (err) {
      console.error('Failed to load order:', err)
      setError('Gagal memuat detail pesanan')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const handleCancelOrder = async () => {
    if (!order) return

    try {
      setIsCancelling(true)
      setShowCancelConfirm(false)

      await cancelOrder(order.id)

      logUserAction('order_cancelled', {
        order_id: order.id,
        product_id: order.product_id
      })

      // Reload order data
      await loadOrder()
    } catch (err: unknown) {
      console.error('Failed to cancel order:', err)
      
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } }
        if (error.response?.data?.message) {
          alert(error.response.data.message)
        } else {
          alert('Gagal membatalkan pesanan. Silakan coba lagi.')
        }
      } else {
        alert('Gagal membatalkan pesanan. Silakan coba lagi.')
      }
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <MobileHeader title="Detail Pesanan" showBack />
        <LoadingState message="Memuat detail pesanan..." />
      </AuthGuard>
    )
  }

  if (error || !order) {
    return (
      <AuthGuard>
        <MobileHeader title="Detail Pesanan" showBack />
        <div className="container-mobile py-12">
          <ErrorState 
            message={error || 'Pesanan tidak ditemukan'}
            onRetry={loadOrder}
          />
        </div>
      </AuthGuard>
    )
  }

  const statusConfig = getStatusConfig(order.status)
  const canCancel = order.status === 'pending'
  const shippingAddress = order.shipping_address as Record<string, string> | undefined

  return (
    <AuthGuard>
      <MobileHeader title="Detail Pesanan" showBack />
      
      <div className="container-mobile py-4 pb-32">
        {/* Order ID & Status */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-neutral-600">ID Pesanan</p>
              <p className="font-mono text-sm font-medium text-neutral-900 mt-0.5">
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="pt-3 border-t border-neutral-200">
            <p className="text-sm text-neutral-600">{statusConfig.description}</p>
          </div>

          {order.status === 'pending' && (
            <div className="mt-3 p-3 bg-warning-50 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-warning-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-warning-700">
                  Menunggu Konfirmasi Admin
                </p>
                <p className="text-xs text-warning-600 mt-1">
                  Pesanan Anda sedang ditinjau oleh admin. Anda akan menerima notifikasi setelah pesanan dikonfirmasi.
                </p>
              </div>
            </div>
          )}

          {order.status === 'confirmed' && (
            <div className="mt-3 p-3 bg-info-50 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-info-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-info-700">
                  Apa yang terjadi selanjutnya?
                </p>
                <p className="text-xs text-info-600 mt-1">
                  Pesanan Anda akan segera diproses dan dikemas untuk pengiriman.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-neutral-600" />
            <h2 className="font-semibold text-neutral-900">Produk</h2>
          </div>

          {order.product ? (
            <Link 
              href={`/products/${order.product.id}`}
              className="flex gap-3 hover:bg-neutral-50 -m-2 p-2 rounded-lg transition-colors"
            >
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-neutral-200">
                <Image
                  src={order.product.image || '/images/placeholder.png'}
                  alt={order.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-neutral-900 mb-1 line-clamp-2">
                  {order.product.name}
                </h3>
                <p className="text-lg font-bold text-primary-600">
                  {formatCurrency(order.final_price)}
                </p>
              </div>
            </Link>
          ) : (
            <div className="text-sm text-neutral-600">
              Informasi produk tidak tersedia
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-neutral-600" />
            <h2 className="font-semibold text-neutral-900">Alamat Pengiriman</h2>
          </div>

          {shippingAddress ? (
            <div className="space-y-1">
              <p className="font-medium text-neutral-900">{shippingAddress.name}</p>
              <p className="text-sm text-neutral-600">{shippingAddress.phone}</p>
              <p className="text-sm text-neutral-600 mt-2">
                {shippingAddress.address}
              </p>
              <p className="text-sm text-neutral-600">
                {shippingAddress.city}
                {shippingAddress.province && `, ${shippingAddress.province}`}
                {shippingAddress.postal_code && ` ${shippingAddress.postal_code}`}
              </p>
            </div>
          ) : (
            <p className="text-sm text-neutral-600">Alamat tidak tersedia</p>
          )}
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-neutral-600" />
            <h2 className="font-semibold text-neutral-900">Pembayaran</h2>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Metode Pembayaran</span>
              <span className="font-medium text-neutral-900">
                {order.payment_method === 'cod' && 'COD (Bayar di Tempat)'}
                {order.payment_method === 'transfer' && 'Transfer Bank'}
                {order.payment_method === 'ewallet' && 'E-Wallet'}
                {!order.payment_method && 'Tidak tersedia'}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Status Pembayaran</span>
              <span className={`font-medium ${
                order.payment_status === 'paid' ? 'text-success-600' :
                order.payment_status === 'pending' ? 'text-warning-600' :
                'text-error-600'
              }`}>
                {order.payment_status === 'paid' && 'Lunas'}
                {order.payment_status === 'pending' && 'Menunggu'}
                {order.payment_status === 'failed' && 'Gagal'}
                {order.payment_status === 'refunded' && 'Dikembalikan'}
              </span>
            </div>

            <div className="border-t border-neutral-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-900">Total</span>
                <span className="font-bold text-primary-600 text-lg">
                  {formatCurrency(order.final_price)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-neutral-600" />
              <h2 className="font-semibold text-neutral-900">Catatan</h2>
            </div>
            <p className="text-sm text-neutral-600">{order.notes}</p>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-neutral-600" />
            <h2 className="font-semibold text-neutral-900">Status Pesanan</h2>
          </div>

          <OrderTimeline order={order} statusLogs={statusLogs} />
        </div>

        {/* Order Info */}
        <div className="bg-neutral-50 rounded-lg p-4">
          <div className="space-y-1 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Dibuat</span>
              <span>{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span>Terakhir Diperbarui</span>
              <span>{formatDate(order.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      {canCancel && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 safe-area-bottom z-40">
          <div className="container-mobile">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-error-500 text-error-600 hover:bg-error-50"
              onClick={() => setShowCancelConfirm(true)}
              disabled={isCancelling}
            >
              Batalkan Pesanan
            </Button>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Batalkan Pesanan?
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCancelConfirm(false)}
                disabled={isCancelling}
              >
                Tidak
              </Button>
              <Button
                className="flex-1 bg-error-500 hover:bg-error-600"
                onClick={handleCancelOrder}
                disabled={isCancelling}
              >
                {isCancelling ? 'Membatalkan...' : 'Ya, Batalkan'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  )
}
