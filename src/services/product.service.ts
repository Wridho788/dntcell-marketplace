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
 * Supabase PostgREST format: /products?select=*&category_id=eq.123&limit=10
 */
export const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  try {
    const params: Record<string, string> = {
      select: '*',
      order: 'created_at.desc',
    }

    if (filters?.category) params['category_id'] = `eq.${filters.category}`
    if (filters?.condition) params['condition'] = `eq.${filters.condition}`
    if (filters?.status) params['status'] = `eq.${filters.status}`
    if (filters?.minPrice) params['price'] = `gte.${filters.minPrice}`
    if (filters?.maxPrice) params['price'] = params['price'] ? `${params['price']},lte.${filters.maxPrice}` : `lte.${filters.maxPrice}`
    if (filters?.search) params['name'] = `ilike.*${filters.search}*`
    if (filters?.limit) params['limit'] = filters.limit.toString()
    if (filters?.offset) params['offset'] = filters.offset.toString()

    const response = await axiosClient.get<Product[]>('/products', { params })
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

/**
 * Get single product by ID
 * Supabase PostgREST format: /products?id=eq.123&select=*
 */
export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosClient.get<Product[]>('/products', {
    params: {
      id: `eq.${id}`,
      select: '*',
      limit: 1
    }
  })
  return response.data[0]
}

/**
 * Get product images
 * Supabase PostgREST format: /product_images?product_id=eq.123&select=*
 */
export const getProductImages = async (productId: string): Promise<ProductImage[]> => {
  const response = await axiosClient.get<ProductImage[]>('/product_images', {
    params: {
      product_id: `eq.${productId}`,
      select: '*',
      order: 'order.asc'
    }
  })
  return response.data
}

/**
 * Search products
 * Supabase PostgREST format: /products?or=(name.ilike.*query*,description.ilike.*query*)
 */
export const searchProducts = async (query: string, limit = 20): Promise<Product[]> => {
  try {
    const response = await axiosClient.get<Product[]>('/products', {
      params: {
        or: `(name.ilike.*${query}*,description.ilike.*${query}*)`,
        select: '*',
        limit: limit.toString(),
        order: 'created_at.desc'
      }
    })
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to search products:', error)
    return []
  }
}

/**
 * Get featured products (latest available products)
 * Supabase PostgREST format: /products?status=eq.available&select=*&limit=10
 */
export const getFeaturedProducts = async (limit = 10): Promise<Product[]> => {
  try {
    const response = await axiosClient.get<Product[]>('/products', {
      params: {
        status: 'eq.available',
        select: '*',
        limit: limit.toString(),
        order: 'created_at.desc'
      }
    })
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to fetch featured products:', error)
    return []
  }
}

/**
 * Get products by category
 * Supabase PostgREST format: /products?category_id=eq.123&select=*
 */
export const getProductsByCategory = async (categoryId: string, limit?: number): Promise<Product[]> => {
  try {
    const params: Record<string, string> = {
      category_id: `eq.${categoryId}`,
      select: '*',
      order: 'created_at.desc'
    }
    if (limit) params.limit = limit.toString()

    const response = await axiosClient.get<Product[]>('/products', { params })
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
