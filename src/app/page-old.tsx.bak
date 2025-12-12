'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { ApiConfigWarning } from '@/components/ui/api-config-warning'
import { Search } from 'lucide-react'
import { useCategories } from '@/lib/api/hooks/useCategories'
import { useInfiniteProducts, useFeaturedProducts } from '@/lib/api/hooks/useProducts'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Dynamic imports for better code splitting
const CategoryCard = dynamic(() => import('@/components/category/category-card').then(mod => ({ default: mod.CategoryCard })), {
  ssr: false
})
const ProductSection = dynamic(() => import('@/components/home/product-section').then(mod => ({ default: mod.ProductSection })), {
  loading: () => <div className="space-y-3">
    <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse" />
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-64 bg-neutral-200 rounded-2xl animate-pulse" />
      ))}
    </div>
  </div>
})

export default function HomePage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { 
    data: productsData, 
    isLoading: productsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteProducts()
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts()

  const allProducts = productsData?.pages.flatMap(page => page) ?? []

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <>
        <MobileHeader 
          showSearch
          showWishlist
          cartCount={0}
          wishlistCount={0}
        />
        <div className="container-mobile py-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <div className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 text-neutral-400">
              Cari HP, Laptop, atau Aksesoris...
            </div>
          </div>
          <div className="w-full h-48 bg-neutral-200 rounded-2xl animate-pulse" />
          <div className="space-y-3">
            <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 bg-neutral-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <MobileHeader 
        showSearch
        showWishlist
        cartCount={0}
        wishlistCount={0}
      />
      
      <div className="container-mobile py-6 space-y-6">
        {/* API Configuration Warning */}
        <ApiConfigWarning />
        
        {/* Search Bar */}
        <div 
          onClick={() => router.push('/search')}
          className="relative cursor-pointer"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <div className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 text-neutral-400">
            Cari HP, Laptop, atau Aksesoris...
          </div>
        </div>

        {/* Banner */}
        {/* <HomeBanner banners={BANNERS} /> */}

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-neutral-900 text-base leading-[1.4]">Kategori</h3>
            <Link href="/categories" className="text-sm text-primary-600 font-semibold">
              Lihat Semua
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {categoriesLoading ? (
              <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 min-w-20">
                    <div className="w-16 h-16 bg-neutral-200 rounded-2xl animate-pulse" />
                    <div className="w-16 h-3 bg-neutral-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              categories?.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            )}
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts && featuredProducts.length > 0 && (
          <ProductSection
            title="Produk Unggulan"
            products={featuredProducts}
            isLoading={featuredLoading}
            emptyMessage="Belum ada produk unggulan"
          />
        )}

        {/* All Products with Infinite Scroll */}
        <ProductSection
          title="Semua Produk"
          products={allProducts}
          isLoading={productsLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onLoadMore={() => fetchNextPage()}
          emptyMessage="Belum ada produk tersedia"
        />
      </div>
    </>
  )
}
