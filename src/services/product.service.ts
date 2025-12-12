import axiosClient from '@/libs/axios/axiosClient'

// Product types
export interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  condition: 'new' | 'like-new' | 'good' | 'fair'
  status: 'available' | 'unavailable' | 'sold'
  description?: string
  specifications?: Record<string, unknown>
  images: string[]
  category_id: string
  seller_id?: string
  negotiable?: boolean
  stock?: number
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  is_primary: boolean
  order: number
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  status?: string
  search?: string
  limit?: number
  offset?: number
}

/**
 * Get all products with optional filtering
 */
export const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  try {
    const response = await axiosClient.get<Product[]>('/products', { 
      params: filters 
    })
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to fetch products:', error)
    // Return empty array on error to prevent crashes
    return []
  }
}

/**
 * Get single product by ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosClient.get<Product>(`/products/${id}`)
  return response.data
}

/**
 * Get product images
 */
export const getProductImages = async (productId: string): Promise<ProductImage[]> => {
  const response = await axiosClient.get<ProductImage[]>(`/products/${productId}/images`)
  return response.data
}

/**
 * Search products
 */
export const searchProducts = async (query: string, limit = 20): Promise<Product[]> => {
  try {
    const response = await axiosClient.get<Product[]>('/products/search', {
      params: { q: query, limit }
    })
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to search products:', error)
    return []
  }
}

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit = 10): Promise<Product[]> => {
  try {
    const response = await axiosClient.get<Product[]>('/products/featured', {
      params: { limit }
    })
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to fetch featured products:', error)
    return []
  }
}

/**
 * Get products by category
 */
export const getProductsByCategory = async (categoryId: string, limit?: number): Promise<Product[]> => {
  try {
    const response = await axiosClient.get<Product[]>('/products', {
      params: { category: categoryId, limit }
    })
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to fetch products by category:', error)
    return []
  }
}

const productService = {
  getProducts,
  getProductById,
  getProductImages,
  searchProducts,
  getFeaturedProducts,
  getProductsByCategory,
}

export default productService
