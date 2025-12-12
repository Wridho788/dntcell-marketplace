'use client'

import { MobileHeader } from '@/components/navigation/mobile-header'
import { CategoryCard } from '@/components/category/category-card'
import { useCategories } from '@/lib/api/hooks/useCategories'
import { Grid, List } from 'lucide-react'
import { useState } from 'react'

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <>
      <MobileHeader 
        title="Semua Kategori" 
        showBack
        actions={
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        }
      />

      <div className="container-mobile py-6">
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-4' : 'space-y-3'}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-neutral-200 rounded-2xl animate-pulse" />
                <div className="w-16 h-3 bg-neutral-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-3 gap-4">
            {categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {categories?.map((category) => (
              <a
                key={category.id}
                href={`/categories/${category.id}`}
                className="flex items-center gap-4 bg-white rounded-xl p-4 border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  {category.icon ? (
                    <span className="text-xl">{category.icon}</span>
                  ) : (
                    <Grid className="w-6 h-6 text-primary-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900">{category.name}</h3>
                </div>
              </a>
            ))}
          </div>
        )}

        {!isLoading && (!categories || categories.length === 0) && (
          <div className="text-center py-12">
            <Grid className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Belum Ada Kategori
            </h3>
            <p className="text-sm text-neutral-500">
              Kategori produk akan ditampilkan di sini
            </p>
          </div>
        )}
      </div>
    </>
  )
}
