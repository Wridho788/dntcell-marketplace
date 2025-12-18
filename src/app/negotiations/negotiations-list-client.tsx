'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { NegotiationStatusBadge } from '@/components/negotiation/negotiation-status-badge'
import { useNegotiations } from '@/hooks/useNegotiations'
import { formatCurrency } from '@/lib/utils/format'
import { formatRelativeTime } from '@/lib/utils/date'
import { MessageSquare, TrendingDown, ArrowRight } from 'lucide-react'

type TabType = 'active' | 'approved' | 'rejected'

export function NegotiationsListClient() {
  const [activeTab, setActiveTab] = useState<TabType>('active')
  const { data: negotiations, isLoading, error, refetch } = useNegotiations()

  const filterByTab = (tab: TabType) => {
    if (!negotiations) return []
    
    switch (tab) {
      case 'active':
        return negotiations.filter(n => n.status === 'pending')
      case 'approved':
        return negotiations.filter(n => n.status === 'approved' || n.status === 'used')
      case 'rejected':
        return negotiations.filter(n => n.status === 'rejected' || n.status === 'expired')
      default:
        return negotiations
    }
  }

  const filteredNegotiations = filterByTab(activeTab)
  const pendingCount = negotiations?.filter(n => n.status === 'pending').length || 0
  const approvedCount = negotiations?.filter(n => ['approved', 'used'].includes(n.status)).length || 0
  const rejectedCount = negotiations?.filter(n => ['rejected', 'expired'].includes(n.status)).length || 0

  return (
    <AuthGuard>
      <MobileHeader title="Negosiasi Saya" />

      <div className="container-mobile pb-20">
        {/* Tabs */}
        <div className="sticky top-0 bg-white z-10 border-b border-neutral-200 -mx-4 px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'active'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600'
              }`}
            >
              Aktif {pendingCount > 0 && <span className="ml-1 text-xs">({pendingCount})</span>}
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'approved'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600'
              }`}
            >
              Disetujui {approvedCount > 0 && <span className="ml-1 text-xs">({approvedCount})</span>}
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'rejected'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600'
              }`}
            >
              Lainnya {rejectedCount > 0 && <span className="ml-1 text-xs">({rejectedCount})</span>}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="py-4">
          {isLoading ? (
            <LoadingState message="Memuat negosiasi..." />
          ) : error ? (
            <ErrorState 
              message="Gagal memuat negosiasi"
              onRetry={refetch}
            />
          ) : filteredNegotiations.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={<MessageSquare className="w-12 h-12" />}
                title={
                  activeTab === 'active' 
                    ? 'Belum ada negosiasi aktif'
                    : activeTab === 'approved'
                    ? 'Belum ada negosiasi disetujui'
                    : 'Belum ada negosiasi lainnya'
                }
                description={
                  activeTab === 'active'
                    ? 'Mulai negosiasi harga produk yang Anda minati'
                    : activeTab === 'approved'
                    ? 'Negosiasi yang disetujui akan muncul di sini'
                    : 'Negosiasi yang ditolak atau kadaluarsa akan muncul di sini'
                }
              />
              
              {activeTab === 'active' && (
                <div className="mt-6 bg-primary-50 rounded-2xl p-4 border border-primary-200">
                  <h4 className="font-semibold text-primary-900 mb-2">
                    Cara Negosiasi
                  </h4>
                  <ol className="text-sm text-primary-800 space-y-1 list-decimal list-inside">
                    <li>Pilih produk yang Anda inginkan</li>
                    <li>Klik tombol &ldquo;Ajukan Nego&rdquo;</li>
                    <li>Masukkan harga penawaran Anda</li>
                    <li>Tunggu konfirmasi dari admin</li>
                  </ol>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNegotiations.map((negotiation) => (
                <Link
                  key={negotiation.id}
                  href={`/negotiations/${negotiation.id}`}
                  className="block bg-white border border-neutral-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <div className="flex gap-3">
                    {/* Product Image */}
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
                          <TrendingDown className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-900 line-clamp-2 mb-2">
                        {negotiation.product?.name || 'Produk'}
                      </h3>

                      <div className="space-y-1 mb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-neutral-600">Harga Jual:</span>
                          <span className="text-sm font-medium text-neutral-900">
                            {formatCurrency(negotiation.product?.selling_price || 0)}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-neutral-600">Penawaran:</span>
                          <span className="text-sm font-bold text-primary-600">
                            {formatCurrency(negotiation.offer_price)}
                          </span>
                        </div>
                        {negotiation.final_price && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs text-neutral-600">Harga Final:</span>
                            <span className="text-sm font-bold text-success-600">
                              {formatCurrency(negotiation.final_price)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <NegotiationStatusBadge status={negotiation.status} size="sm" />
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <span>{formatRelativeTime(negotiation.updated_at)}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
