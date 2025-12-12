'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { ApiConfigWarning } from '@/components/ui/api-config-warning'
import { CategoryCard } from '@/components/category/category-card'
import { ProductSection } from '@/components/home/product-section'
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
  const [products] = useState(initialProducts)
  const [categories] = useState(initialCategories)
  const [featuredProducts] = useState(initialFeaturedProducts)

  return (
    <>
      <MobileHeader 
        showSearch
        showWishlist
        cartCount={0}
        wishlistCount={0}
      />
      
      <main className="container-mobile py-6 space-y-6">
        {/* API Configuration Warning */}
        <ApiConfigWarning />
        
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
          <div className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 text-neutral-400">
            Cari HP, Laptop, atau Aksesoris...
          </div>
        </div>

        {/* Categories */}
        <section aria-labelledby="categories-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="categories-heading" className="font-bold text-neutral-900 text-base leading-[1.4]">
              Kategori
            </h2>
            <Link href="/categories" className="text-sm text-primary-600 font-semibold hover:underline">
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
            emptyMessage="Belum ada produk tersedia"
          />
        </section>
      </main>
    </>
  )
}
