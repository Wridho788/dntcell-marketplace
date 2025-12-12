import { formatCurrency } from '@/lib/utils/format'

interface PriceTagProps {
  price: number
  originalPrice?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function PriceTag({ 
  price, 
  originalPrice, 
  size = 'md',
  showLabel = false 
}: PriceTagProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  }

  const originalSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <div className="flex items-baseline gap-2">
        <p className={`${sizeClasses[size]} font-bold text-primary-800 leading-none`}>
          {formatCurrency(price)}
        </p>
        
        {hasDiscount && (
          <>
            <p className={`${originalSizeClasses[size]} text-neutral-400 line-through leading-none`}>
              {formatCurrency(originalPrice)}
            </p>
            <span className="px-2 py-0.5 bg-accent-100 text-accent-800 text-xs font-semibold rounded">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>
      
      {showLabel && (
        <span className="text-xs text-neutral-500">per unit</span>
      )}
    </div>
  )
}
