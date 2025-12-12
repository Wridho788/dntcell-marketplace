'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useRequireAuth } from '@/lib/hooks/useAuth'

interface FavoriteButtonProps {
  productId: string
  initialFavorited?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function FavoriteButton({ 
  initialFavorited = false,
  size = 'md' 
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [isAnimating, setIsAnimating] = useState(false)
  const { requireAuth } = useRequireAuth()

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Check authentication before toggling favorite
    requireAuth(() => {
      setFavorited(!favorited)
      setIsAnimating(true)
      
      // TODO: Call API to save/remove favorite
      // Example: saveFavorite(productId, !favorited)
      
      setTimeout(() => setIsAnimating(false), 300)
    })
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses[size]} rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200 flex items-center justify-center hover:bg-white transition-all ${
        isAnimating ? 'scale-110' : 'scale-100'
      }`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={`${iconSizes[size]} transition-all ${
          favorited 
            ? 'fill-error-500 text-error-500' 
            : 'text-neutral-600'
        }`}
      />
    </button>
  )
}
