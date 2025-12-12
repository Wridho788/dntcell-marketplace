'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Package } from 'lucide-react'
import type { Product } from '@/lib/supabase/products'
import { formatCurrency } from '@/lib/utils/format'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const getConditionBadge = (condition: string) => {
    const badges = {
      'new': { bg: 'bg-success-100', text: 'text-success-700', label: 'Baru' },
      'like-new': { bg: 'bg-success-100', text: 'text-success-700', label: 'Seperti Baru' },
      'good': { bg: 'bg-warning-100', text: 'text-warning-700', label: 'Baik' },
      'fair': { bg: 'bg-neutral-100', text: 'text-neutral-700', label: 'Cukup Baik' },
    }
    return badges[condition as keyof typeof badges] || badges.good
  }

  const getStatusBadge = (status: string) => {
    if (status === 'sold') return { bg: 'bg-error-100', text: 'text-error-700', label: 'Terjual' }
    if (status === 'unavailable') return { bg: 'bg-neutral-100', text: 'text-neutral-700', label: 'Tidak Tersedia' }
    return null
  }

  const conditionBadge = getConditionBadge(product.condition)
  const statusBadge = getStatusBadge(product.status)
  const isAvailable = product.status === 'available'

  return (
    <Link 
      href={`/products/${product.id}`}
      className={`bg-white rounded-[14px] overflow-hidden border border-neutral-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${!isAvailable && 'opacity-60'}`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-neutral-100">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 480px) 50vw, 200px"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-neutral-300" />
          </div>
        )}
        
        {/* Status Badge */}
        {statusBadge && (
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 ${statusBadge.bg} ${statusBadge.text} text-[10px] font-semibold rounded-lg`}>
              {statusBadge.label}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <p className="text-sm text-neutral-800 font-medium line-clamp-2 leading-[1.4]">
          {product.name}
        </p>
        
        <div className="flex items-baseline gap-2">
          <p className="text-lg font-bold text-primary-600">
            {formatCurrency(product.price)}
          </p>
          {product.original_price && product.original_price > product.price && (
            <p className="text-xs text-neutral-400 line-through leading-none">
              {formatCurrency(product.original_price)}
            </p>
          )}
        </div>

        {/* Condition Badge */}
        <div className="flex gap-1.5">
          <span className={`px-2.5 py-1 ${conditionBadge.bg} ${conditionBadge.text} text-[11px] font-semibold rounded-md`}>
            {conditionBadge.label}
          </span>
        </div>
      </div>
    </Link>
  )
}
