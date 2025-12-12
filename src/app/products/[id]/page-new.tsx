import { notFound } from 'next/navigation'
import { generateMetadata as genMeta, generateProductSchema, generateBreadcrumbSchema, truncateText } from '@/lib/seo'
import { getProductById } from '@/services/product.service'
import { ProductDetailClient } from './product-detail-client'

// ISR: Revalidate every 2 minutes
export const revalidate = 120

// Generate static params for popular products (can be expanded)
export async function generateStaticParams() {
  // TODO: Fetch top 100 most viewed products for pre-rendering
  // For now, return empty array (all products will be rendered on-demand)
  return []
}

// Metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const product = await getProductById(params.id)
    
    if (!product) {
      return genMeta({
        title: 'Produk Tidak Ditemukan',
        description: 'Produk yang Anda cari tidak tersedia',
        noIndex: true,
      })
    }

    const description = product.description 
      ? truncateText(product.description, 160)
      : `${product.name} - ${CONDITION_LABELS[product.condition]} - Rp ${product.price.toLocaleString('id-ID')}`

    return genMeta({
      title: product.name,
      description,
      keywords: `${product.name}, ${CONDITION_LABELS[product.condition]}, hp bekas, laptop second`,
      image: product.images[0],
      url: `/products/${product.id}`,
      type: 'product',
    })
  } catch (error) {
    console.error('Error generating metadata:', error)
    return genMeta({
      title: 'Produk Tidak Ditemukan',
      description: 'Produk yang Anda cari tidak tersedia',
      noIndex: true,
    })
  }
}

const CONDITION_LABELS: Record<string, string> = {
  'new': 'Baru',
  'like-new': 'Seperti Baru',
  'good': 'Baik',
  'fair': 'Cukup Baik'
}

interface ProductDetailProps {
  params: {
    id: string
  }
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  let product
  
  try {
    product = await getProductById(params.id)
  } catch (error) {
    console.error('Error fetching product:', error)
    notFound()
  }

  if (!product) {
    notFound()
  }

  // Generate JSON-LD structured data
  const productSchema = generateProductSchema({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.images[0],
    condition: product.condition,
    stock: product.stock,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Produk', url: '/products' },
    { name: product.name, url: `/products/${product.id}` },
  ])

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Client Component with product data */}
      <ProductDetailClient product={product} />
    </>
  )
}
