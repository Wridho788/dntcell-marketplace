/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Product Utilities
 * Helper functions for product display, filtering, and formatting
 */

export type ProductCondition = 'new' | 'like-new' | 'good' | 'fair'
export type ProductStatus = 'available' | 'unavailable' | 'sold'

/**
 * Condition labels and descriptions
 */
export const CONDITION_CONFIG = {
  'new': {
    label: 'Baru',
    description: 'Produk baru, belum pernah digunakan, masih tersegel',
    color: 'success',
    icon: '🆕'
  },
  'like-new': {
    label: 'Seperti Baru',
    description: 'Produk seperti baru, mungkin pernah digunakan beberapa kali',
    color: 'success',
    icon: '✨'
  },
  'good': {
    label: 'Baik',
    description: 'Produk berfungsi dengan baik, mungkin ada sedikit tanda pemakaian',
    color: 'warning',
    icon: '👍'
  },
  'fair': {
    label: 'Cukup Baik',
    description: 'Produk berfungsi normal, ada tanda-tanda pemakaian yang terlihat',
    color: 'neutral',
    icon: '📦'
  }
} as const

/**
 * Status labels and descriptions
 */
export const STATUS_CONFIG = {
  'available': {
    label: 'Tersedia',
    description: 'Produk tersedia untuk dibeli',
    color: 'success'
  },
  'unavailable': {
    label: 'Tidak Tersedia',
    description: 'Produk sementara tidak tersedia',
    color: 'neutral'
  },
  'sold': {
    label: 'Terjual',
    description: 'Produk telah terjual',
    color: 'error'
  }
} as const

/**
 * Get condition badge configuration
 */
export function getConditionBadge(condition: ProductCondition) {
  const config = CONDITION_CONFIG[condition] || CONDITION_CONFIG.good
  
  const colorMap = {
    success: { bg: 'bg-success-100', text: 'text-success-700', border: 'border-success-200' },
    warning: { bg: 'bg-warning-100', text: 'text-warning-700', border: 'border-warning-200' },
    neutral: { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200' },
    error: { bg: 'bg-error-100', text: 'text-error-700', border: 'border-error-200' }
  }

  return {
    ...config,
    ...colorMap[config.color as keyof typeof colorMap]
  }
}

/**
 * Get status badge configuration
 */
export function getStatusBadge(status: ProductStatus) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.available
  
  const colorMap = {
    success: { bg: 'bg-success-100', text: 'text-success-700', border: 'border-success-200' },
    neutral: { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200' },
    error: { bg: 'bg-error-100', text: 'text-error-700', border: 'border-error-200' }
  }

  return {
    ...config,
    ...colorMap[config.color as keyof typeof colorMap]
  }
}

/**
 * Check if product is available for purchase
 */
export function isProductAvailable(product: any): boolean {
  return product?.status === 'available' && product?.stock > 0
}

/**
 * Check if product is sold
 */
export function isProductSold(product: any): boolean {
  return product?.status === 'sold'
}

/**
 * Check if product is negotiable
 */
export function isProductNegotiable(product: any): boolean {
  return product?.negotiable === true && isProductAvailable(product)
}

/**
 * Get product action label
 */
export function getProductActionLabel(product: any): string {
  if (!isProductAvailable(product)) {
    return 'Tidak Tersedia'
  }

  if (isProductNegotiable(product)) {
    return 'Ajukan Nego'
  }

  return 'Beli Sekarang'
}

/**
 * Get negotiation range hint (if applicable)
 */
export function getNegoRangeHint(basePrice: number, sellingPrice: number): string | null {
  if (basePrice <= sellingPrice) return null

  const discount = Math.round(((basePrice - sellingPrice) / basePrice) * 100)
  
  if (discount < 10) return 'Nego terbatas'
  if (discount < 20) return 'Bisa nego tipis'
  if (discount < 30) return 'Bisa nego lumayan'
  
  return 'Nego fleksibel'
}

/**
 * Format product specifications for display
 */
export function formatSpecifications(specs: Record<string, any>): Array<{ label: string; value: string }> {
  if (!specs || typeof specs !== 'object') return []

  const formatted: Array<{ label: string; value: string }> = []

  // Common spec keys mapping
  const keyMapping: Record<string, string> = {
    brand: 'Merek',
    model: 'Model',
    color: 'Warna',
    storage: 'Penyimpanan',
    ram: 'RAM',
    processor: 'Prosesor',
    screen_size: 'Ukuran Layar',
    battery: 'Baterai',
    camera: 'Kamera',
    year: 'Tahun',
    warranty: 'Garansi'
  }

  Object.entries(specs).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formatted.push({
        label: keyMapping[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        value: String(value)
      })
    }
  })

  return formatted
}

/**
 * Get default product image
 */
export function getDefaultProductImage(): string {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ob2ltYWdlPC90ZXh0Pjwvc3ZnPg=='
}

/**
 * Get product image with fallback
 */
export function getProductImage(images: string[] | undefined, index: number = 0): string {
  if (!images || images.length === 0) return getDefaultProductImage()
  return images[index] || images[0] || getDefaultProductImage()
}

/**
 * Validate product images array
 */
export function validateProductImages(images: any): string[] {
  if (!Array.isArray(images)) return []
  return images.filter((img: any) => typeof img === 'string' && img.trim().length > 0)
}

/**
 * Generate product share text
 */
export function generateShareText(product: any): string {
  const condition = CONDITION_CONFIG[product.condition as ProductCondition]?.label || 'Kondisi Baik'
  const price = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(product.price)

  return `${product.name} - ${condition} - ${price}`
}

/**
 * Sort products by different criteria
 */
export function sortProducts(products: any[], sortBy: string): any[] {
  const sorted = [...products]

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
    
    case 'price-desc':
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
    
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    
    case 'newest':
    default:
      return sorted.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return dateB - dateA
      })
  }
}

/**
 * Filter products by criteria
 */
export function filterProducts(products: any[], filters: {
  category?: string
  condition?: ProductCondition
  minPrice?: number
  maxPrice?: number
  negotiable?: boolean
  status?: ProductStatus
  search?: string
}): any[] {
  let filtered = [...products]

  if (filters.category) {
    filtered = filtered.filter(p => p.category_id === filters.category)
  }

  if (filters.condition) {
    filtered = filtered.filter(p => p.condition === filters.condition)
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => (p.price || 0) >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => (p.price || 0) <= filters.maxPrice!)
  }

  if (filters.negotiable !== undefined) {
    filtered = filtered.filter(p => p.negotiable === filters.negotiable)
  }

  if (filters.status) {
    filtered = filtered.filter(p => p.status === filters.status)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower)
    )
  }

  return filtered
}
