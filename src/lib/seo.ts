import type { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  noIndex?: boolean
  canonical?: string
}

const DEFAULT_TITLE = 'Dncell Marketplace'
const DEFAULT_DESCRIPTION = 'Marketplace terpercaya untuk jual beli handphone dan laptop second berkualitas dengan harga terbaik. Transaksi aman dan mudah.'
const DEFAULT_IMAGE = '/images/og-default.jpg'
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dncell-marketplace.vercel.app'

/**
 * Generate metadata for Next.js pages
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    image = DEFAULT_IMAGE,
    url,
    type = 'website',
    noIndex = false,
    canonical,
  } = config

  const fullTitle = title === DEFAULT_TITLE ? title : `${title} - ${DEFAULT_TITLE}`
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`

  const metadata: Metadata = {
    title: fullTitle,
    description: description || DEFAULT_DESCRIPTION,
    keywords: keywords,
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description: description || DEFAULT_DESCRIPTION,
      url: fullUrl,
      siteName: DEFAULT_TITLE,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'id_ID',
      type: type === 'product' ? 'website' : type, // OpenGraph doesn't support 'product' directly
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description || DEFAULT_DESCRIPTION,
      images: [fullImage],
    },

    // Robots
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
          },
        },

    // Alternate languages
    alternates: {
      canonical: canonical || fullUrl,
      languages: {
        'id-ID': fullUrl,
      },
    },

    // Additional meta tags
    other: {
      'google-site-verification': '', // TODO: Add Google Search Console verification
    },
  }

  return metadata
}

/**
 * Generate product structured data (JSON-LD)
 */
export function generateProductSchema(product: {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  condition: string
  category?: string
  seller?: string
  stock?: number
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.name,
    image: product.image?.startsWith('http') 
      ? product.image 
      : `${SITE_URL}${product.image || DEFAULT_IMAGE}`,
    sku: product.id,
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.id}`,
      priceCurrency: 'IDR',
      price: product.price,
      availability: product.stock && product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: getConditionSchema(product.condition),
      seller: {
        '@type': 'Organization',
        name: product.seller || DEFAULT_TITLE,
      },
    },
  }

  return schema
}

/**
 * Generate breadcrumb structured data (JSON-LD)
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }

  return schema
}

/**
 * Generate organization structured data (JSON-LD)
 * For homepage
 */
export function generateOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: DEFAULT_TITLE,
    url: SITE_URL,
    logo: `${SITE_URL}/dntcell-logo.ico`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      // TODO: Add social media links
      // 'https://facebook.com/dncell',
      // 'https://instagram.com/dncell',
      // 'https://twitter.com/dncell',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Indonesian'],
    },
  }

  return schema
}

/**
 * Generate item list structured data (JSON-LD)
 * For category pages
 */
export function generateItemListSchema(items: Array<{
  id: string
  name: string
  price: number
  image?: string
}>) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        image: item.image?.startsWith('http') ? item.image : `${SITE_URL}${item.image || DEFAULT_IMAGE}`,
        url: `${SITE_URL}/products/${item.id}`,
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'IDR',
        },
      },
    })),
  }

  return schema
}

/**
 * Helper: Convert condition to schema.org format
 */
function getConditionSchema(condition: string): string {
  const conditionMap: Record<string, string> = {
    'new': 'https://schema.org/NewCondition',
    'like-new': 'https://schema.org/RefurbishedCondition',
    'good': 'https://schema.org/UsedCondition',
    'fair': 'https://schema.org/UsedCondition',
  }
  
  return conditionMap[condition] || 'https://schema.org/UsedCondition'
}

/**
 * Truncate text for meta descriptions
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text
  
  return text.substring(0, maxLength - 3).trim() + '...'
}

/**
 * Generate keywords from text
 */
export function generateKeywords(text: string, limit: number = 10): string {
  // Simple keyword extraction (can be improved with NLP)
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
  
  const uniqueWords = [...new Set(words)]
  return uniqueWords.slice(0, limit).join(', ')
}
