import { generateMetadata as genMeta, generateOrganizationSchema, generateBreadcrumbSchema } from '@/lib/seo'
import { getProducts } from '@/services/product.service'
import { getCategories } from '@/services/category.service'
import { HomePageClient } from './home-client'

// ISR: Revalidate every 60 seconds
export const revalidate = 60

// Metadata for SEO
export async function generateMetadata() {
  return genMeta({
    title: 'Dncell Marketplace',
    description: 'Marketplace terpercaya untuk jual beli handphone dan laptop second berkualitas dengan harga terbaik. Transaksi aman dan mudah.',
    keywords: 'marketplace indonesia, hp bekas, laptop second, jual beli online, handphone second, laptop bekas',
    url: '/',
    type: 'website',
  })
}

export default async function HomePage() {
  // Fetch data on server
  const [products, categories] = await Promise.all([
    getProducts({ limit: 20, status: 'available' }),
    getCategories(),
  ])

  const featuredProducts = products.slice(0, 10)

  // Generate JSON-LD structured data
  const organizationSchema = generateOrganizationSchema()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
  ])

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Client Component with initial data */}
      <HomePageClient
        initialProducts={products}
        initialCategories={categories}
        initialFeaturedProducts={featuredProducts}
      />
    </>
  )
}
