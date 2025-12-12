'use client'

import dynamic from 'next/dynamic'
import { useProduct } from '@/lib/api/hooks/useProducts'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/ui/favorite-button'
import { PriceTag } from '@/components/ui/price-tag'
import { useRequireAuth } from '@/lib/hooks/useAuth'
import { 
  MapPin, 
  MessageCircle, 
  Share2,
  ShieldCheck,
  Package,
  Smartphone
} from 'lucide-react'

// Dynamic imports for better code splitting
const ImageCarousel = dynamic(() => import('@/components/product/image-carousel').then(mod => ({ default: mod.ImageCarousel })), {
  loading: () => <div className="w-full aspect-square bg-neutral-200 rounded-2xl animate-pulse" />
})

interface ProductDetailProps {
  params: {
    id: string
  }
}

const CONDITION_LABELS = {
  'new': 'Baru',
  'like-new': 'Seperti Baru',
  'good': 'Baik',
  'fair': 'Cukup Baik'
}

const CONDITION_COLORS = {
  'new': 'bg-success-100 text-success-700',
  'like-new': 'bg-info-100 text-info-700',
  'good': 'bg-warning-100 text-warning-700',
  'fair': 'bg-neutral-100 text-neutral-700'
}

export default function ProductDetailPage({ params }: ProductDetailProps) {
  const { data: product, isLoading } = useProduct(params.id)
  const { requireAuth } = useRequireAuth()

  const handleNegotiate = () => {
    requireAuth(() => {
      // TODO: Open negotiation modal or navigate to negotiation page
      console.log('Start negotiation for product:', params.id)
    })
  }

  const handleChat = () => {
    requireAuth(() => {
      // TODO: Open chat with seller
      console.log('Chat with seller for product:', params.id)
    })
  }

  if (isLoading) {
    return (
      <>
        <MobileHeader title="Detail Produk" showBack />
        <div className="container-mobile py-6 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="w-full aspect-square bg-neutral-200 rounded-2xl" />
            <div className="h-6 bg-neutral-200 rounded w-3/4" />
            <div className="h-8 bg-neutral-200 rounded w-1/2" />
          </div>
        </div>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <MobileHeader title="Detail Produk" showBack />
        <div className="container-mobile py-6">
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Produk Tidak Ditemukan
            </h3>
            <p className="text-sm text-neutral-500">
              Produk yang Anda cari tidak tersedia
            </p>
          </div>
        </div>
      </>
    )
  }

  const isAvailable = product.status === 'available'

  return (
    <>
      <MobileHeader 
        title="Detail Produk" 
        showBack
        actions={
          <div className="flex gap-2">
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-neutral-700" />
            </button>
            <FavoriteButton productId={params.id} size="sm" />
          </div>
        }
      />

      <div className="container-mobile py-6 space-y-6 pb-24">
        {/* Image Carousel */}
        <ImageCarousel images={product.images} productName={product.name} />

        {/* Product Info */}
        <div className="space-y-4">
          {/* Price & Title */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-xl font-bold text-neutral-900 flex-1 leading-[1.4]">
                {product.name}
              </h1>
              {product.status === 'sold' && (
                <span className="px-3 py-1 bg-error-100 text-error-700 text-xs font-semibold rounded-lg shrink-0">
                  TERJUAL
                </span>
              )}
            </div>
            
            <PriceTag 
              price={product.price}
              originalPrice={product.original_price}
              size="lg"
            />
          </div>

          {/* Condition Badge */}
          <div className="flex gap-2">
            <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${CONDITION_COLORS[product.condition]}`}>
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
              Kondisi: {CONDITION_LABELS[product.condition]}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold text-neutral-900 mb-2 text-base leading-[1.4]">Deskripsi</h3>
              <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-[1.6]">
                {product.description}
              </p>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2 text-base leading-[1.4]">
                <Smartphone className="w-4 h-4" />
                Spesifikasi
              </h3>
              <div className="space-y-2.5">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm gap-4">
                    <span className="text-neutral-600 leading-[1.4]">{key}</span>
                    <span className="text-neutral-900 font-medium text-right leading-[1.4]">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seller Info Placeholder */}
          <div className="bg-white rounded-xl p-4 border border-neutral-200">
            <h3 className="font-semibold text-neutral-900 mb-3 text-base leading-[1.4]">Penjual</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-lg">D</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900 leading-[1.4]">DNTCell Store</p>
                <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5 leading-[1.4]">
                  <MapPin className="w-3 h-3" />
                  <span>Jakarta Selatan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Placeholder */}
        <div>
          <h3 className="font-bold text-neutral-900 mb-4">Produk Serupa</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Will be populated with related products */}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 safe-area-bottom z-40">
        <div className="container-mobile flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={!isAvailable}
            onClick={handleChat}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat Penjual
          </Button>
          <Button
            size="lg"
            className="flex-1"
            disabled={!isAvailable}
            onClick={handleNegotiate}
          >
            Nego Harga
          </Button>
        </div>
      </div>
    </>
  )
}
