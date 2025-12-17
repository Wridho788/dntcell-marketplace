'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Package, Tag } from 'lucide-react'
import type { Product } from '@/lib/supabase/products'
import { formatCurrency, formatDiscount } from '@/lib/utils/format'
import { 
  getConditionBadge, 
  getStatusBadge, 
  isProductAvailable,
  getProductImage
} from '@/lib/utils/product'
import { ImageCarousel } from './image-gallery'

interface ProductCardProps {
  product: Product
  showCarousel?: boolean
  className?: string
}

export function ProductCard({ product, showCarousel = false, className = '' }: ProductCardProps) {
  const conditionBadge = getConditionBadge(product.condition)
  const statusBadge = getStatusBadge(product.status)
  const isAvailable = isProductAvailable(product)
  const isClickable = isAvailable || product.status === 'unavailable'

  // Calculate discount if there's original price
  const hasDiscount = product.original_price && product.original_price > product.price
  const discountText = hasDiscount ? formatDiscount(product.original_price!, product.price) : null

  const containerClassName = `bg-white rounded-xl overflow-hidden border border-neutral-200 transition-all duration-200 ${
    isClickable ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : 'opacity-60 cursor-not-allowed'
  } ${className}`

  const content = (
    <>
      {/* Image Section */}
      <div className="relative">
        {showCarousel && product.images.length > 1 ? (
          <ImageCarousel 
            images={product.images} 
            productName={product.name}
            className="rounded-t-xl"
          />
        ) : (
          <div className="relative aspect-square bg-neutral-100">
            {product.images && product.images.length > 0 ? (
              <Image
                src={getProductImage(product.images, 0)}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 25vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-12 h-12 text-neutral-300" />
              </div>
            )}
          </div>
        )}

        {/* Status Badge - Top Right */}
        {product.status !== 'available' && (
          <div className="absolute top-2 right-2 z-10">
            <span className={`px-2.5 py-1 ${statusBadge.bg} ${statusBadge.text} text-xs font-semibold rounded-lg shadow-sm backdrop-blur-sm`}>
              {statusBadge.label}
            </span>
          </div>
        )}

        {/* Discount Badge - Top Left */}
        {hasDiscount && discountText && (
          <div className="absolute top-2 left-2 z-10">
            <span className="px-2.5 py-1 bg-error-600 text-white text-xs font-bold rounded-lg shadow-sm">
              {discountText}
            </span>
          </div>
        )}

        {/* Negotiable Badge - Bottom Left */}
        {product.negotiable && isAvailable && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="flex items-center gap-1 px-2.5 py-1 bg-primary-600 text-white text-xs font-semibold rounded-lg shadow-sm">
              <Tag className="w-3 h-3" />
              Nego
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-2.5">
        {/* Product Name */}
        <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 leading-[1.4] min-h-[2.8rem]">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-bold text-primary-600">
              {formatCurrency(product.price)}
            </p>
            {hasDiscount && (
              <p className="text-xs text-neutral-400 line-through leading-none">
                {formatCurrency(product.original_price!)}
              </p>
            )}
          </div>
        </div>

        {/* Condition Badge */}
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${conditionBadge.bg} ${conditionBadge.text} text-xs font-medium rounded-md`}>
            <span>{conditionBadge.icon}</span>
            {conditionBadge.label}
          </span>
        </div>

        {/* Additional Info (Stock if low) */}
        {isAvailable && product.stock !== undefined && product.stock <= 3 && (
          <p className="text-xs text-warning-600 font-medium">
            Stok tersisa {product.stock}
          </p>
        )}
      </div>
    </>
  )

  if (isClickable) {
    return (
      <Link href={`/products/${product.id}`} className={containerClassName}>
        {content}
      </Link>
    )
  }

  return (
    <div className={containerClassName}>
      {content}
    </div>
  )
}
