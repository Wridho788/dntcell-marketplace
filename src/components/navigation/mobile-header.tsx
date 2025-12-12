'use client'

import { ArrowLeft, Search as SearchIcon, ShoppingCart, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface MobileHeaderProps {
  title?: string
  showBack?: boolean
  showSearch?: boolean
  showCart?: boolean
  showWishlist?: boolean
  onBack?: () => void
  cartCount?: number
  wishlistCount?: number
  transparent?: boolean
  className?: string
  actions?: React.ReactNode
}

export function MobileHeader({
  title,
  showBack = false,
  showSearch = false,
  showCart = false,
  showWishlist = false,
  onBack,
  cartCount = 0,
  wishlistCount = 0,
  transparent = false,
  className,
  actions,
}: MobileHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b safe-area-inset-top',
        transparent
          ? 'bg-transparent border-transparent'
          : 'bg-white border-neutral-200',
        className
      )}
    >
      <div className="container-mobile">
        <div className="flex items-center justify-between h-14">
          {/* Left section */}
          <div className="flex items-center gap-2">
            {showBack && (
              <button
                onClick={handleBack}
                className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-700" />
              </button>
            )}
            
            {!showBack && !title && (
              <Image
                src="/dntcell-logo.jpeg"
                alt="DNTCell Logo"
                width={32}
                height={32}
                className="rounded-lg"
                priority
              />
            )}
            
            {title && (
              <h1 className="text-lg font-bold text-neutral-900 truncate">
                {title}
              </h1>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-1">
            {actions}
            
            {showSearch && (
              <button
                onClick={() => router.push('/search')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors relative"
                aria-label="Search"
              >
                <SearchIcon className="w-5 h-5 text-neutral-700" />
              </button>
            )}

            {showWishlist && (
              <button
                onClick={() => router.push('/wishlist')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-neutral-700" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-error-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </button>
            )}

            {showCart && (
              <button
                onClick={() => router.push('/cart')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-neutral-700" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-error-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
