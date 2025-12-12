'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-neutral-200">
      {/* Image Skeleton */}
      <Skeleton className="w-full aspect-square" />
      
      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        
        {/* Price */}
        <Skeleton className="h-5 w-24 mt-2" />
        
        {/* Location */}
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}
