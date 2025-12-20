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
import { CancelOrderModal } from '@/components/order/cancel-order-modal'
import { 
  getOrderById, 
  getOrderStatusLogs, 
  cancelOrder, 
  getPaymentProofs,
  uploadPaymentProof
} from '@/services/order.service'
import { formatCurrency } from '@/lib/utils/format'
import { formatDate } from '@/lib/utils/date'
import { logUserAction } from '@/lib/utils/logger'
import type { Order, OrderStatusLog, PaymentProof, CancelOrderPayload } from '@/services/order.service'
import { 
  Package, 
  MapPin, 
  CreditCard, 
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  Upload,
  HandshakeIcon,
  Calendar
} from 'lucide-react'

interface OrderDetailClientProps {
  orderId: string
}

export function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [statusLogs, setStatusLogs] = useState<OrderStatusLog[]>([])
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isUploadingProof, setIsUploadingProof] = useState(false)

  const loadOrder = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const [orderData, logs, proofs] = await Promise.all([
        getOrderById(orderId),
        getOrderStatusLogs(orderId),
        getPaymentProofs(orderId).catch(() => [])
      ])
      
      setOrder(orderData)
      setStatusLogs(logs)
      setPaymentProofs(proofs)

      logUserAction('order_viewed', {
        order_id: orderId,
        status: orderData.order_status
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

  const handleCancelOrder = async (reason: string) => {
    if (!order) return

    try {
      setIsCancelling(true)
      setShowCancelModal(false)

      const payload: CancelOrderPayload = { cancel_reason: reason }
      await cancelOrder(order.id, payload)

      logUserAction('order_cancelled', {
        order_id: order.id,
        product_id: order.product_id,
        reason
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

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!order || !e.target.files || !e.target.files[0]) return

    try {
      setIsUploadingProof(true)
      
      // In real implementation, upload to cloud storage first
      // For now, we'll use a placeholder
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file) // Temporary - replace with actual upload
      
      await uploadPaymentProof(order.id, imageUrl)
      
      logUserAction('payment_proof_uploaded', {
        order_id: order.id
      })

      // Reload payment proofs
      const proofs = await getPaymentProofs(order.id)
      setPaymentProofs(proofs)
      
      alert('Bukti pembayaran berhasil diupload')
    } catch (err) {
      console.error('Failed to upload payment proof:', err)
      alert('Gagal mengupload bukti pembayaran. Silakan coba lagi.')
    } finally {
      setIsUploadingProof(false)
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

  const statusConfig = getStatusConfig(order.order_status)
  const canCancel = statusConfig.canCancel

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
            <OrderStatusBadge status={order.order_status} />
          </div>

          <div className="pt-3 border-t border-neutral-200">
            <p className="text-sm text-neutral-600">{statusConfig.description}</p>
          </div>

          {/* Status-specific info */}
          {order.order_status === 'created' && (
            <div className="mt-3 p-3 bg-warning-50 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-warning-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-warning-700">
                  Menunggu Konfirmasi Penjual
                </p>
                <p className="text-xs text-warning-600 mt-1">
                  Pesanan Anda sedang ditinjau oleh penjual. Anda akan menerima notifikasi setelah pesanan dikonfirmasi.
                </p>
              </div>
            </div>
          )}

          {order.order_status === 'waiting_meetup' && (
            <div className="mt-3 p-3 bg-info-50 rounded-lg flex items-start gap-2">
              <Clock className="w-4 h-4 text-info-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-info-700">
                  Segera Lakukan Pembayaran
                </p>
                <p className="text-xs text-info-600 mt-1">
                  Silakan transfer sesuai nominal dan upload bukti pembayaran.
                </p>
              </div>
            </div>
          )}

          {order.order_status === 'waiting_meetup' && (
            <div className="mt-3 p-3 bg-purple-50 rounded-lg flex items-start gap-2">
              <HandshakeIcon className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-purple-700">
                  Siapkan Janji Temu
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Hubungi penjual untuk mengatur waktu dan lokasi pertemuan.
                </p>
              </div>
            </div>
          )}

          {order.order_status === 'paid' && (
            <div className="mt-3 p-3 bg-success-50 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-success-700">
                  Pembayaran Terverifikasi
                </p>
                <p className="text-xs text-success-600 mt-1">
                  Pesanan Anda sedang diproses oleh admin.
                </p>
              </div>
            </div>
          )}

          {order.cancel_reason && (
            <div className="mt-3 p-3 bg-error-50 rounded-lg">
              <p className="text-xs font-medium text-error-700 mb-1">
                Alasan Pembatalan:
              </p>
              <p className="text-xs text-error-600">
                {order.cancel_reason}
              </p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-neutral-600" />
            <h2 className="font-semibold text-neutral-900">Produk</h2>
          </div>

          {order.product && (
            <Link 
              href={`/products/${order.product.id}`}
              className="flex gap-3 hover:bg-neutral-50 -m-2 p-2 rounded-lg transition-colors"
            >
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-neutral-200">
                <Image
                  src={order.product.main_image_url || '/images/placeholder.png'}
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
                {order.payment_method === 'transfer' ? 'Transfer Bank' : 
                 order.payment_method === 'meetup' ? 'COD / Meetup' :
                 order.payment_method === 'cod' ? 'Cash on Delivery' : 'Tidak diketahui'}
              </span>
            </div>

            {order.delivery_type && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Jenis Pengiriman</span>
                <span className="font-medium text-neutral-900">
                  {order.delivery_type === 'meetup' ? 'Meetup' : 'Pengiriman'}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Status Pembayaran</span>
              <span className={`font-medium ${
                order.payment_status === 'paid' ? 'text-success-600' : 'text-warning-600'
              }`}>
                {order.payment_status === 'paid' ? 'Lunas' :
                 order.payment_status === 'unpaid' ? 'Belum Lunas' :
                 order.payment_status === 'failed' ? 'Gagal' : 'Dikembalikan'}
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-200">
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-900">Total</span>
                <span className="text-lg font-bold text-primary-600">
                  {formatCurrency(order.final_price)}
                </span>
              </div>
            </div>
          </div>

          {/* Upload Payment Proof */}
          {order.payment_status === 'unpaid' && order.payment_method === 'transfer' && (
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                Bukti Pembayaran
              </h3>
              
              {paymentProofs.length > 0 ? (
                <div className="space-y-2">
                  {paymentProofs.map((proof) => (
                    <div key={proof.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-success-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900">
                          Bukti sudah diupload
                        </p>
                        <p className="text-xs text-neutral-600">
                          {formatDate(proof.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-neutral-600 mt-2">
                    Menunggu verifikasi dari admin
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadProof}
                      disabled={isUploadingProof}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer">
                      <Upload className="w-5 h-5 text-neutral-600" />
                      <span className="text-sm font-medium text-neutral-700">
                        {isUploadingProof ? 'Mengupload...' : 'Upload Bukti Transfer'}
                      </span>
                    </div>
                  </label>
                  <p className="text-xs text-neutral-600 mt-2">
                    Upload foto/screenshot bukti transfer Anda (JPG, PNG, max 5MB)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Meetup Details */}
        {order.meetup_location && (
          <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-neutral-600" />
              <h2 className="font-semibold text-neutral-900">Lokasi Meetup</h2>
            </div>

            <div className="space-y-2">
              {order.meetup_at && (
                <div className="flex gap-2">
                  <Calendar className="w-4 h-4 text-neutral-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-600">Waktu</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {formatDate(order.meetup_at)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-neutral-600 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-600">Lokasi</p>
                  <p className="text-sm font-medium text-neutral-900">
                    {order.meetup_location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-neutral-600" />
            <h2 className="font-semibold text-neutral-900">Riwayat Status</h2>
          </div>

          <OrderTimeline logs={statusLogs} />
        </div>

        {/* Order Dates */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Tanggal Pesanan</span>
              <span className="text-neutral-900">{formatDate(order.created_at)}</span>
            </div>
            {order.updated_at !== order.created_at && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Terakhir Diupdate</span>
                <span className="text-neutral-900">{formatDate(order.updated_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      {canCancel && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 safe-area-bottom z-40">
          <div className="container-mobile">
            <Button
              variant="destructive"
              size="lg"
              className="w-full"
              onClick={() => setShowCancelModal(true)}
              disabled={isCancelling}
            >
              {isCancelling ? 'Membatalkan...' : 'Batalkan Pesanan'}
            </Button>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
        isLoading={isCancelling}
      />
    </AuthGuard>
  )
}
