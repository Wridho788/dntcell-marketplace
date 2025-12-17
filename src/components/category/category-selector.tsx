'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Grid3x3, Sparkles } from 'lucide-react'
import type { Category } from '@/services/category.service'
import { cn } from '@/lib/utils'

interface CategorySelectorProps {
  categories: Category[]
  className?: string
}

export function CategorySelector({ categories, className }: CategorySelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategoryId = searchParams.get('category')

  const handleCategoryClick = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (categoryId) {
      params.set('category', categoryId)
    } else {
      params.delete('category')
    }
    
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-2 scrollbar-hide', className)}>
      {/* All Categories Button */}
      <button
        onClick={() => handleCategoryClick(null)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0',
          !currentCategoryId
            ? 'bg-primary-600 text-white shadow-md'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
        )}
      >
        <Grid3x3 className="w-4 h-4" />
        Semua
      </button>

      {/* Category Buttons */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0',
            currentCategoryId === category.id
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          )}
        >
          {category.icon && <span className="text-base">{category.icon}</span>}
          {category.name}
          {category.product_count !== undefined && category.product_count > 0 && (
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded-full',
              currentCategoryId === category.id
                ? 'bg-white/20 text-white'
                : 'bg-neutral-200 text-neutral-600'
            )}>
              {category.product_count}
            </span>
          )}
        </button>
      ))}

      {/* Featured/New Badge */}
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString())
          params.set('sort', 'newest')
          router.push(`/products?${params.toString()}`)
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-linier-to-r from-success-500 to-primary-500 text-white shadow-md shrink-0"
      >
        <Sparkles className="w-4 h-4" />
        Terbaru
      </button>
    </div>
  )
}
