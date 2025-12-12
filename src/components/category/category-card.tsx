'use client'

import Link from 'next/link'
import { Package } from 'lucide-react'
import type { Category } from '@/lib/supabase/products'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link 
      href={`/categories/${category.id}`}
      className="flex flex-col items-center gap-2 min-w-20 group"
    >
      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
        {category.icon ? (
          <span className="text-2xl">{category.icon}</span>
        ) : (
          <Package className="w-8 h-8 text-primary-600" />
        )}
      </div>
      <span className="text-xs text-neutral-700 text-center font-medium line-clamp-2 w-full">
        {category.name}
      </span>
    </Link>
  )
}
