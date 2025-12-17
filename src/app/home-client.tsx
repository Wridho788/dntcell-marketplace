'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { CategoryCard } from '@/components/category/category-card'
import { ProductSection } from '@/components/home/product-section'
import { useProducts } from '@/hooks/useProducts'
import type { Product } from '@/services/product.service'
import type { Category } from '@/services/category.service'

interface HomePageClientProps {
  initialProducts: Product[]
  initialCategories: Category[]
  initialFeaturedProducts: Product[]
}

export function HomePageClient({
  initialProducts,
  initialCategories,
  initialFeaturedProducts,
}: HomePageClientProps) {
  const router = useRouter()
  const [products] = useState(initialProducts || [])
  const [categories] = useState(initialCategories || [])
  const [featuredProducts] = useState(initialFeaturedProducts || [])

  // Call useProducts hook
  const { data: productsData, isLoading, error, isError } = useProducts()

  useEffect(() => {
    // Debug log to verify data
    console.log('Home Client - Products loaded:', products.length)
    console.log('Home Client - Categories loaded:', categories.length)
  }, [products, categories])

  useEffect(() => {
    // Console log for useProducts hook response
    console.log('=== useProducts Hook Response ===')
    console.log('Data:', productsData)
    console.log('IsLoading:', isLoading)
    console.log('IsError:', isError)
    console.log('Error:', error)
    console.log('Products Count:', productsData?.length || 0)
    console.log('================================')
  }, [productsData, isLoading, isError, error])

  return (
    <>
      <MobileHeader 
        showSearch
        showWishlist
        cartCount={0}
        wishlistCount={0}
      />
      
      <main className="container-mobile py-6 space-y-6">        
        {/* Search Bar */}
        <div 
          onClick={() => router.push('/search')}
          className="relative cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              router.push('/search')
            }
          }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <div className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 text-neutral-400 bg-white hover:border-primary-800 transition-colors">
            Cari HP, Laptop, atau Aksesoris...
          </div>
        </div>

        {/* Categories */}
        <section aria-labelledby="categories-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="categories-heading" className="font-bold text-neutral-900 text-base leading-[1.4]">
              Kategori
            </h2>
            <Link href="/categories" className="text-sm text-primary-800 font-semibold hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {categories.length === 0 ? (
              <p className="text-sm text-neutral-500">Belum ada kategori</p>
            ) : (
              categories.slice(0, 8).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            )}
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section aria-labelledby="featured-heading">
            <ProductSection
              title="Produk Unggulan"
              products={featuredProducts}
              emptyMessage="Belum ada produk unggulan"
            />
          </section>
        )}

        {/* All Products */}
        <section aria-labelledby="all-products-heading">
          <ProductSection
            title="Semua Produk"
            products={products}
            emptyMessage="Belum ada produk tersedia. Silakan cek koneksi internet Anda atau coba lagi nanti."
          />
        </section>
      </main>
    </>
  )
}
