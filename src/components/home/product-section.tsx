'use client'

import { useEffect, useRef } from 'react'
import { ProductCard } from '@/components/product/product-card'
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton'
import type { Product } from '@/types/database'

interface ProductSectionProps {
  title: string
  products?: Product[]
  isLoading?: boolean
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  onLoadMore?: () => void
  emptyMessage?: string
}

export function ProductSection({
  title,
  products = [],
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onLoadMore,
  emptyMessage = 'Tidak ada produk'
}: ProductSectionProps) {
  const observerTarget = useRef<HTMLDivElement>(null)

  // Infinite scroll observer
  useEffect(() => {
    if (!onLoadMore || !hasNextPage || isFetchingNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { threshold: 0, rootMargin: '200px' }
    )

    const target = observerTarget.current
    if (target) observer.observe(target)

    return () => {
      if (target) observer.unobserve(target)
    }
  }, [onLoadMore, hasNextPage, isFetchingNextPage])

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-neutral-900">{title}</h2>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-neutral-500">{emptyMessage}</p>
        </div>
      )}

      {/* Load More Trigger */}
      {onLoadMore && hasNextPage && (
        <div ref={observerTarget} className="py-4">
          {isFetchingNextPage && (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
