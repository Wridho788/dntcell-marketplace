import { MetadataRoute } from 'next'
import { getProducts } from '@/services/product.service'
import { getCategories } from '@/services/category.service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dncell-marketplace.vercel.app'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5,
    },
  ]

  // Dynamic product routes
  try {
    const products = await getProducts({ limit: 100, status: 'available' })
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: 'weekly',
      priority: 0.9,
    }))

    // Dynamic category routes
    const categories = await getCategories()
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/categories/${category.id}`,
      lastModified: category.updated_at ? new Date(category.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticRoutes, ...productRoutes, ...categoryRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticRoutes
  }
}

export const revalidate = 3600 // Revalidate sitemap every hour
