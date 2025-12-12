'use client'

import { MobileHeader } from '@/components/navigation/mobile-header'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/ui/favorite-button'
import { PriceTag } from '@/components/ui/price-tag'
import { ImageCarousel } from '@/components/product/image-carousel'
import { useRequireAuth } from '@/lib/hooks/useAuth'
import type { Product } from '@/services/product.service'
import { 
  MapPin, 
  MessageCircle, 
  Share2,
  ShieldCheck,
  Smartphone
} from 'lucide-react'

const CONDITION_LABELS: Record<string, string> = {
  'new': 'Baru',
  'like-new': 'Seperti Baru',
  'good': 'Baik',
  'fair': 'Cukup Baik'
}

const CONDITION_COLORS: Record<string, string> = {
  'new': 'bg-success-100 text-success-700',
  'like-new': 'bg-info-100 text-info-700',
  'good': 'bg-warning-100 text-warning-700',
  'fair': 'bg-neutral-100 text-neutral-700'
}

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { requireAuth } = useRequireAuth()

  const handleNegotiate = () => {
    requireAuth(() => {
      // TODO: Open negotiation modal or navigate to negotiation page
      console.log('Start negotiation for product:', product.id)
    })
  }

  const handleChat = () => {
    requireAuth(() => {
      // TODO: Open chat with seller
      console.log('Chat with seller for product:', product.id)
    })
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/products/${product.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `${product.name} - Rp ${product.price.toLocaleString('id-ID')}`,
          url: url,
        })
      } catch (error) {
        console.log('Share cancelled:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url)
      alert('Link produk disalin ke clipboard!')
    }
  }

  const isAvailable = product.status === 'available'

  return (
    <>
      <MobileHeader 
        title="Detail Produk" 
        showBack
        actions={
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Bagikan produk"
            >
              <Share2 className="w-5 h-5 text-neutral-700" />
            </button>
            <FavoriteButton productId={product.id} size="sm" />
          </div>
        }
      />

      <main className="container-mobile py-6 space-y-6 pb-24">
        {/* Image Carousel */}
        <ImageCarousel images={product.images} productName={product.name} />

        {/* Product Info */}
        <article className="space-y-4">
          {/* Price & Title */}
          <header>
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
          </header>

          {/* Condition Badge */}
          <div className="flex gap-2">
            <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${CONDITION_COLORS[product.condition]}`}>
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
              Kondisi: {CONDITION_LABELS[product.condition]}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <section className="bg-neutral-50 rounded-xl p-4">
              <h2 className="font-semibold text-neutral-900 mb-2 text-base leading-[1.4]">
                Deskripsi
              </h2>
              <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-[1.6]">
                {product.description}
              </p>
            </section>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <section className="bg-neutral-50 rounded-xl p-4">
              <h2 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2 text-base leading-[1.4]">
                <Smartphone className="w-4 h-4" />
                Spesifikasi
              </h2>
              <dl className="space-y-2.5">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm gap-4">
                    <dt className="text-neutral-600 leading-[1.4]">{key}</dt>
                    <dd className="text-neutral-900 font-medium text-right leading-[1.4]">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Seller Info Placeholder */}
          <section className="bg-white rounded-xl p-4 border border-neutral-200">
            <h2 className="font-semibold text-neutral-900 mb-3 text-base leading-[1.4]">
              Penjual
            </h2>
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
          </section>
        </article>
      </main>

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
