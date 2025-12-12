'use client'

import { useState } from 'react'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { ProductSection } from '@/components/home/product-section'
import { useProducts } from '@/lib/api/hooks/useProducts'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CategoryDetailProps {
  params: {
    id: string
  }
}

const CONDITION_OPTIONS = [
  { value: '', label: 'Semua Kondisi' },
  { value: 'new', label: 'Baru' },
  { value: 'like-new', label: 'Seperti Baru' },
  { value: 'good', label: 'Baik' },
  { value: 'fair', label: 'Cukup Baik' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'price-low', label: 'Harga Terendah' },
  { value: 'price-high', label: 'Harga Tertinggi' },
]

export default function CategoryDetailPage({ params }: CategoryDetailProps) {
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState({
    condition: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  })

  const { data: products, isLoading } = useProducts({
    category: params.id,
    condition: filters.condition || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
  })

  const handleApplyFilter = () => {
    setShowFilter(false)
    // Filters are already applied via React Query
  }

  const handleResetFilter = () => {
    setFilters({
      condition: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    })
  }

  const activeFilterCount = [
    filters.condition,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length

  return (
    <>
      <MobileHeader 
        title="Kategori" 
        showBack
        actions={
          <button
            onClick={() => setShowFilter(true)}
            className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5 text-neutral-700" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        }
      />

      <div className="container-mobile py-6">
        {/* Sort Chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilters(prev => ({ ...prev, sort: option.value }))}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filters.sort === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-primary-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Products */}
        <ProductSection
          title={`Produk (${products?.length || 0})`}
          products={products}
          isLoading={isLoading}
          emptyMessage="Tidak ada produk dalam kategori ini"
        />
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto safe-area-bottom">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">Filter Produk</h3>
              <button
                onClick={() => setShowFilter(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Kondisi
                </label>
                <div className="space-y-2">
                  {CONDITION_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:border-primary-300 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={option.value}
                        checked={filters.condition === option.value}
                        onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm text-neutral-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Rentang Harga
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 py-4 flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleResetFilter}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                size="lg"
                onClick={handleApplyFilter}
                className="flex-1"
              >
                Terapkan Filter
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
