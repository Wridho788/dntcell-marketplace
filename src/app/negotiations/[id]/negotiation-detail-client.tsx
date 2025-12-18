'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { NegotiationStatusBadge, getStatusConfig } from '@/components/negotiation/negotiation-status-badge'
import { getNegotiationDetail } from '@/services/negotiation.service'
import { formatCurrency } from '@/lib/utils/format'
import { formatDate } from '@/lib/utils/date'
import { logUserAction } from '@/lib/utils/logger'
import type { Negotiation } from '@/services/negotiation.service'
import { 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShoppingBag,
  Package
} from 'lucide-react'

interface NegotiationDetailClientProps {
  negotiationId: string
}

export function NegotiationDetailClient({ negotiationId }: NegotiationDetailClientProps) {
  const router = useRouter()
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNegotiation = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getNegotiationDetail(negotiationId)
      setNegotiation(data)
      
      logUserAction('negotiation_viewed', {
        negotiation_id: negotiationId,
        status: data.status
      })
    } catch (err) {
      console.error('Failed to load negotiation:', err)
      setError('Gagal memuat detail negosiasi')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNegotiation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [negotiationId])

  const handleContinueToPurchase = async () => {
    if (!negotiation || !negotiation.final_price) return

    logUserAction('nego_approved_purchase_clicked', {
      negotiation_id: negotiation.id,
      final_price: negotiation.final_price
    })

    // Navigate to checkout with negotiation ID
    router.push(`/checkout?product_id=${negotiation.product_id}&negotiation_id=${negotiation.id}`)
  }

  const handleCreateNewNegotiation = () => {
    if (!negotiation?.product) return

    logUserAction('nego_rejected_retry', {
      negotiation_id: negotiation.id,
      product_id: negotiation.product_id
    })

    router.push(`/products/${negotiation.product.id}`)
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <MobileHeader title="Detail Negosiasi" showBack />
        <LoadingState message="Memuat detail negosiasi..." />
      </AuthGuard>
    )
  }

  if (error || !negotiation) {
    return (
      <AuthGuard>
        <MobileHeader title="Detail Negosiasi" showBack />
        <div className="container-mobile py-12">
          <ErrorState 
            message={error || 'Negosiasi tidak ditemukan'}
            onRetry={loadNegotiation}
          />
        </div>
      </AuthGuard>
    )
  }

  const statusConfig = getStatusConfig(negotiation.status)
  const canPurchase = negotiation.status === 'approved' && !negotiation.used

  return (
    <AuthGuard>
      <MobileHeader title="Detail Negosiasi" showBack />

      <div className="container-mobile py-6 space-y-6 pb-24">
        {/* Product Info */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-neutral-600 mb-3">Produk</h2>
          <Link
            href={`/products/${negotiation.product?.id}`}
            className="flex gap-3 hover:bg-neutral-50 rounded-lg p-2 -m-2 transition-colors"
          >
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
              {negotiation.product?.main_image_url ? (
                <Image
                  src={negotiation.product.main_image_url}
                  alt={negotiation.product.name || 'Product'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <Package className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 line-clamp-2 mb-1">
                {negotiation.product?.name || 'Produk'}
              </h3>
              <p className="text-sm text-neutral-600">
                Harga Jual: <span className="font-bold text-neutral-900">
                  {formatCurrency(negotiation.product?.selling_price || 0)}
                </span>
              </p>
            </div>
          </Link>
        </div>

        {/* Status */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-neutral-600 mb-3">Status</h2>
          <div className="space-y-3">
            <NegotiationStatusBadge status={negotiation.status} size="md" />
            <p className="text-sm text-neutral-700">
              {statusConfig.description}
            </p>
          </div>
        </div>

        {/* Price Details */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-neutral-600 mb-3">Detail Harga</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">Harga Awal</span>
              <span className="font-semibold text-neutral-900">
                {formatCurrency(negotiation.product?.selling_price || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">Penawaran Anda</span>
              <span className="font-bold text-primary-600">
                {formatCurrency(negotiation.offer_price)}
              </span>
            </div>
            {negotiation.final_price && (
              <>
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-neutral-900">Harga Final</span>
                    <span className="text-lg font-bold text-success-600">
                      {formatCurrency(negotiation.final_price)}
                    </span>
                  </div>
                </div>
                <div className="bg-success-50 border border-success-200 rounded-lg p-3">
                  <p className="text-sm text-success-800">
                    🎉 Hemat <span className="font-bold">
                      {formatCurrency((negotiation.product?.selling_price || 0) - negotiation.final_price)}
                    </span> dari harga awal!
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        {(negotiation.note || negotiation.admin_note || negotiation.rejection_reason) && (
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-neutral-600 mb-3">Catatan</h2>
            <div className="space-y-3">
              {negotiation.note && (
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs text-neutral-600 mb-1">Catatan Anda:</p>
                  <p className="text-sm text-neutral-900">{negotiation.note}</p>
                </div>
              )}
              {negotiation.admin_note && (
                <div className="bg-info-50 rounded-lg p-3">
                  <p className="text-xs text-info-600 mb-1">Catatan Admin:</p>
                  <p className="text-sm text-info-900">{negotiation.admin_note}</p>
                </div>
              )}
              {negotiation.rejection_reason && (
                <div className="bg-error-50 rounded-lg p-3">
                  <p className="text-xs text-error-600 mb-1">Alasan:</p>
                  <p className="text-sm text-error-900">{negotiation.rejection_reason}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-neutral-600 mb-3">Riwayat</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-primary-600" />
                </div>
                {negotiation.status !== 'pending' && (
                  <div className="w-0.5 h-8 bg-neutral-200" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <p className="font-medium text-neutral-900">Penawaran Dibuat</p>
                <p className="text-sm text-neutral-600">{formatDate(negotiation.created_at)}</p>
              </div>
            </div>

            {negotiation.status === 'pending' && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-warning-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-warning-600 animate-pulse" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">Menunggu Review Admin</p>
                  <p className="text-sm text-neutral-600">Penawaran sedang ditinjau</p>
                </div>
              </div>
            )}

            {negotiation.status === 'approved' && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-success-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">Penawaran Disetujui</p>
                  <p className="text-sm text-neutral-600">{formatDate(negotiation.updated_at)}</p>
                </div>
              </div>
            )}

            {negotiation.status === 'rejected' && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-error-100 flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-error-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">Penawaran Belum Disetujui</p>
                  <p className="text-sm text-neutral-600">{formatDate(negotiation.updated_at)}</p>
                </div>
              </div>
            )}

            {negotiation.status === 'used' && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">Digunakan untuk Pembelian</p>
                  <p className="text-sm text-neutral-600">{formatDate(negotiation.updated_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      {(canPurchase || negotiation.status === 'rejected') && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 safe-area-bottom z-40">
          <div className="container-mobile">
            {canPurchase ? (
              <Button
                size="lg"
                className="w-full"
                onClick={handleContinueToPurchase}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Lanjutkan Pembelian
              </Button>
            ) : negotiation.status === 'rejected' ? (
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={handleCreateNewNegotiation}
              >
                <TrendingDown className="w-5 h-5 mr-2" />
                Ajukan Nego Baru
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </AuthGuard>
  )
}
