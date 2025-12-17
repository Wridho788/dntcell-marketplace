'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/product/product-card'
import { ProductCardSkeleton } from '@/components/ui/skeleton'
import { EmptyState, FetchError, NoResults } from '@/components/ui/empty-state'
import { FilterSortPanel, ActiveFilters, ProductFilters } from '@/components/product/filter-sort-panel'
import { CategorySelector } from '@/components/category/category-selector'
import { SlowLoadingIndicator } from '@/components/ui/error-boundary'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { sortProducts, filterProducts } from '@/lib/utils/product'
import { filterValidProducts } from '@/lib/utils/product-validation'
import { logUserAction } from '@/lib/utils/logger'

export function ProductListClient() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<ProductFilters>({
    sortBy: searchParams.get('sortBy') || 'newest'
  })

  const { data: products, isLoading, error, refetch } = useProducts()
  const { data: categories } = useCategories()

  // Log page view
  useEffect(() => {
    logUserAction('view_product_list', { filters })
  }, [filters])

  // Filter and sort products with validation
  const validProducts = products ? filterValidProducts(products) : []
  const filteredProducts = filterProducts(validProducts, filters)
  const sortedProducts = sortProducts(filteredProducts, filters.sortBy || 'newest')

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters)
    logUserAction('filter_products', { filters: newFilters })
  }

  const handleRemoveFilter = (key: keyof ProductFilters) => {
    setFilters(prev => {
      const updated = { ...prev }
      if (key === 'minPrice' || key === 'maxPrice') {
        delete updated.minPrice
        delete updated.maxPrice
      } else {
        delete updated[key]
      }
      return updated
    })
  }

  const handleClearFilters = () => {
    setFilters({ sortBy: 'newest' })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <SlowLoadingIndicator isLoading={isLoading} threshold={3000} />
        
        <div className="space-y-2">
          <div className="h-8 w-48 bg-neutral-200 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-neutral-200 rounded animate-pulse" />
        </div>

        <div className="h-12 bg-neutral-200 rounded-lg animate-pulse" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <FetchError onRetry={refetch} />
      </div>
    )
  }

  // Empty state (no products at all)
  if (!products || products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState
          icon="📦"
          title="Belum Ada Produk"
          description="Saat ini belum ada produk yang tersedia. Silakan cek kembali nanti."
        />
      </div>
    )
  }

  // No results after filtering
  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'sortBy' && value !== undefined
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-neutral-900">
          Semua Produk
        </h1>
        <p className="text-neutral-600">
          {sortedProducts.length} produk ditemukan
        </p>
      </div>

      {/* Category Selector */}
      {categories && categories.length > 0 && (
        <CategorySelector categories={categories} />
      )}

      {/* Filter & Sort */}
      <FilterSortPanel
        categories={categories || []}
        onFilterChange={handleFilterChange}
      />

      {/* Active Filters */}
      {hasActiveFilters && (
        <ActiveFilters
          filters={filters}
          categories={categories || []}
          onRemove={handleRemoveFilter}
          onClear={handleClearFilters}
        />
      )}

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="py-12">
          <NoResults searchQuery={filters.search} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              showCarousel={false}
            />
          ))}
        </div>
      )}

      {/* Load More (if implementing pagination) */}
      {/* Future: Add load more button or infinite scroll */}
    </div>
  )
}
