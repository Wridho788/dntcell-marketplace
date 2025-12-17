/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { CONDITION_CONFIG, ProductCondition } from '@/lib/utils/product'

interface FilterSortPanelProps {
  categories?: Array<{ id: string; name: string }>
  onFilterChange?: (filters: ProductFilters) => void
}

export interface ProductFilters {
  category?: string
  condition?: ProductCondition
  minPrice?: number
  maxPrice?: number
  negotiable?: boolean
  sortBy?: string
  search?: string
}

export function FilterSortPanel({ categories = [], onFilterChange }: FilterSortPanelProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || undefined,
    condition: searchParams.get('condition') as ProductCondition || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    negotiable: searchParams.get('negotiable') === 'true' ? true : undefined,
    sortBy: searchParams.get('sortBy') || 'newest',
    search: searchParams.get('search') || undefined
  })

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (filters.category) params.set('category', filters.category)
    if (filters.condition) params.set('condition', filters.condition)
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
    if (filters.negotiable !== undefined) params.set('negotiable', filters.negotiable.toString())
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.search) params.set('search', filters.search)

    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.replace(newUrl, { scroll: false })

    if (onFilterChange) {
      onFilterChange(filters)
    }
  }, [filters, router, onFilterChange])

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      sortBy: 'newest'
    })
    setIsOpen(false)
  }

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'sortBy' && key !== 'search' && value !== undefined
  ).length

  return (
    <div className="space-y-3">
      {/* Sort & Filter Bar */}
      <div className="flex items-center gap-2">
        {/* Sort Dropdown */}
        <div className="flex-1">
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <option value="newest">Terbaru</option>
            <option value="price-asc">Harga Terendah</option>
            <option value="price-desc">Harga Tertinggi</option>
            <option value="name-asc">Nama A-Z</option>
            <option value="name-desc">Nama Z-A</option>
          </select>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative px-4 py-2.5 bg-white border border-neutral-200 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-neutral-50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filter
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-4 shadow-lg">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Kategori
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => updateFilter('category', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Semua Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Condition Filter */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Kondisi
            </label>
            <select
              value={filters.condition || ''}
              onChange={(e) => updateFilter('condition', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Semua Kondisi</option>
              {Object.entries(CONDITION_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Rentang Harga
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Negotiable Filter */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.negotiable === true}
                onChange={(e) => updateFilter('negotiable', e.target.checked ? true : undefined)}
                className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-neutral-700">
                Bisa Nego
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-neutral-200">
            <button
              onClick={resetFilters}
              className="flex-1 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Active Filters Display
 */
interface ActiveFiltersProps {
  filters: ProductFilters
  categories?: Array<{ id: string; name: string }>
  onRemove: (key: keyof ProductFilters) => void
  onClear: () => void
}

export function ActiveFilters({ filters, categories = [], onRemove, onClear }: ActiveFiltersProps) {
  const activeFilters: Array<{ key: keyof ProductFilters; label: string }> = []

  if (filters.category) {
    const category = categories.find(c => c.id === filters.category)
    activeFilters.push({ key: 'category', label: category?.name || 'Kategori' })
  }

  if (filters.condition) {
    const condition = CONDITION_CONFIG[filters.condition]
    activeFilters.push({ key: 'condition', label: condition.label })
  }

  if (filters.minPrice || filters.maxPrice) {
    const label = filters.minPrice && filters.maxPrice
      ? `Rp ${filters.minPrice.toLocaleString()} - Rp ${filters.maxPrice.toLocaleString()}`
      : filters.minPrice
      ? `Min Rp ${filters.minPrice.toLocaleString()}`
      : `Max Rp ${filters.maxPrice!.toLocaleString()}`
    activeFilters.push({ key: 'minPrice', label })
  }

  if (filters.negotiable) {
    activeFilters.push({ key: 'negotiable', label: 'Bisa Nego' })
  }

  if (activeFilters.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-neutral-600 font-medium">Filter:</span>
      {activeFilters.map((filter, index) => (
        <button
          key={index}
          onClick={() => onRemove(filter.key)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
        >
          {filter.label}
          <X className="w-3 h-3" />
        </button>
      ))}
      <button
        onClick={onClear}
        className="text-sm text-neutral-500 hover:text-neutral-700 font-medium"
      >
        Hapus Semua
      </button>
    </div>
  )
}
