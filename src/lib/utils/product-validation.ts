/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Product Data Validation & Sanitization
 * Handles edge cases like missing data, inactive products, partial data
 */

import type { Product } from '@/services/product.service'

/**
 * Validates if a product has all required fields
 */
export function isValidProduct(product: Partial<Product>): product is Product {
  return !!(
    product.id &&
    product.name &&
    product.price !== undefined &&
    product.status &&
    product.condition
  )
}

/**
 * Sanitizes product data with fallbacks for missing fields
 */
export function sanitizeProduct(product: Partial<Product>): Product | null {
  if (!isValidProduct(product)) {
    console.warn('Invalid product data:', product)
    return null
  }

  return {
    ...product,
    images: product.images && product.images.length > 0 
      ? product.images 
      : ['/images/placeholder-product.png'],
    description: product.description || '',
    specifications: product.specifications || {},
    stock: product.stock ?? 0,
    negotiable: product.negotiable ?? false,
    min_negotiable_price: product.min_negotiable_price ?? undefined,
    original_price: product.original_price ?? undefined,
    seller_id: product.seller_id ?? '',
    created_at: product.created_at ?? new Date().toISOString(),
    updated_at: product.updated_at ?? new Date().toISOString(),
  }
}

/**
 * Filters out invalid/deleted/inactive products
 */
export function filterValidProducts(products: Partial<Product>[]): Product[] {
  return products
    .map(sanitizeProduct)
    .filter((product): product is Product => product !== null)
}

/**
 * Checks if product data is stale (needs refetch)
 */
export function isProductDataStale(updatedAt: string, thresholdMinutes = 5): boolean {
  const updated = new Date(updatedAt)
  const now = new Date()
  const diffMinutes = (now.getTime() - updated.getTime()) / (1000 * 60)
  return diffMinutes > thresholdMinutes
}

/**
 * Safely access nested product properties
 */
export function getProductProperty<T>(
  product: Partial<Product>,
  path: string,
  defaultValue: T
): T {
  const keys = path.split('.')
  let value: any = product

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      return defaultValue
    }
  }

  return value ?? defaultValue
}

/**
 * Validates product images are accessible
 */
export function validateProductImages(images: string[]): string[] {
  if (!images || images.length === 0) {
    return ['/images/placeholder-product.png']
  }

  return images.filter(img => {
    // Basic validation
    if (!img || typeof img !== 'string') return false
    
    // Check if it's a valid URL or path
    try {
      const url = new URL(img, window.location.origin)
      return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'data:'
    } catch {
      // Relative path
      return img.startsWith('/') || img.startsWith('data:')
    }
  })
}

/**
 * Handles partial product data for preview/skeleton states
 */
export function createProductPreview(partial: Partial<Product>): Partial<Product> {
  return {
    id: partial.id || 'preview',
    name: partial.name || 'Loading...',
    price: partial.price ?? 0,
    images: partial.images || [],
    condition: partial.condition || 'good',
    status: partial.status || 'available',
  }
}

/**
 * Detects if product is in error state
 */
export function isProductError(product: any): boolean {
  return (
    !product ||
    product.error === true ||
    product.status === 'error' ||
    product.status === 'deleted'
  )
}
