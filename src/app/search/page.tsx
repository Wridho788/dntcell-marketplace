'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { useSearchProducts } from '@/lib/api/hooks/useProducts'
import { useSearchStore } from '@/lib/store/search'
import { Search, Clock, X, TrendingUp } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/useDebounce'

// Dynamic import for ProductCard (search results)
const ProductCard = dynamic(() => import('@/components/product/product-card').then(mod => ({ default: mod.ProductCard })), {
  loading: () => <div className="h-64 bg-neutral-200 rounded-2xl animate-pulse" />,
  ssr: false
})

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 400)
  const { data: products, isLoading } = useSearchProducts(debouncedQuery)
  const { history, addToHistory, clearHistory } = useSearchStore()

  useEffect(() => {
    // Rehydrate persisted store on client
    useSearchStore.persist.rehydrate()
  }, [])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    if (searchQuery.trim()) {
      addToHistory(searchQuery.trim())
    }
  }

  const handleSelectHistory = (item: string) => {
    setQuery(item)
  }

  const handleClearSearch = () => {
    setQuery('')
  }

  const showResults = debouncedQuery.length > 0
  const showHistory = !showResults && history.length > 0

  return (
    <>
      <MobileHeader title="Pencarian" showBack />

      <div className="container-mobile py-6 space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            autoFocus
            className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none transition-colors"
          />
          {query && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          )}
        </div>

        {/* Search History */}
        {showHistory && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pencarian Terakhir
              </h3>
              <button
                onClick={clearHistory}
                className="text-xs text-primary-600 font-semibold hover:text-primary-700"
              >
                Hapus Semua
              </button>
            </div>

            <div className="space-y-2">
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectHistory(item)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left"
                >
                  <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span className="text-sm text-neutral-700 flex-1">{item}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        {!showResults && !showHistory && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Pencarian Populer
            </h3>
            <div className="flex flex-wrap gap-2">
              {['iPhone', 'MacBook', 'Samsung', 'Laptop Gaming', 'iPad'].map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-primary-100 hover:text-primary-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {showResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-900">
                {isLoading 
                  ? 'Mencari...' 
                  : `${products?.length || 0} hasil ditemukan`
                }
              </h3>
            </div>

            {isLoading && (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden border border-neutral-200">
                    <div className="w-full aspect-square bg-neutral-200 animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                      <div className="h-5 bg-neutral-200 rounded animate-pulse w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && products && products.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {!isLoading && (!products || products.length === 0) && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Tidak Ada Hasil
                </h3>
                <p className="text-sm text-neutral-500">
                  Coba gunakan kata kunci lain
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
