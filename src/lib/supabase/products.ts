import { supabase } from './client'

// Database schema
interface ProductDB {
  id: string
  seller_id: string
  category_id: string
  name: string
  description: string | null
  condition: 'new' | 'like-new' | 'good' | 'fair'
  base_price: number
  selling_price: number
  negotiable: boolean
  status: 'available' | 'unavailable' | 'sold'
  reject_note: string | null
  details: Record<string, unknown> | null
  main_image_url: string | null
  created_at: string
  updated_at: string
  is_active: boolean
  stock: number
}

// Frontend Product interface
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
  min_negotiable_price?: number
  stock?: number
  created_at: string
  updated_at: string
}

// Transform DB product to frontend format
function transformProduct(dbProduct: ProductDB): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    price: dbProduct.selling_price,
    original_price: dbProduct.base_price !== dbProduct.selling_price ? dbProduct.base_price : undefined,
    condition: dbProduct.condition,
    status: dbProduct.status,
    description: dbProduct.description || undefined,
    specifications: dbProduct.details || undefined,
    images: dbProduct.main_image_url ? [dbProduct.main_image_url] : [],
    category_id: dbProduct.category_id,
    created_at: dbProduct.created_at,
    updated_at: dbProduct.updated_at,
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
}

/**
 * Get all products with optional filtering
 */
export async function getProducts(filters?: {
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  status?: string
  search?: string
  limit?: number
  offset?: number
}) {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    if (filters?.category) {
      query = query.eq('category_id', filters.category)
    }

    if (filters?.minPrice) {
      query = query.gte('selling_price', filters.minPrice)
    }

    if (filters?.maxPrice) {
      query = query.lte('selling_price', filters.maxPrice)
    }

    if (filters?.condition) {
      query = query.eq('condition', filters.condition)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return { data: null, error }
    }

    const transformedData = data?.map(transformProduct) || []
    return { data: transformedData, error: null }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { data: null, error }
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return { data: null, error }
    }

    const transformed = data ? transformProduct(data as ProductDB) : null
    return { data: transformed, error: null }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { data: null, error }
  }
}

/**
 * Get all categories
 */
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return { data: null, error }
    }

    return { data: data as Category[], error: null }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { data: null, error }
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(limit)

    if (error) {
      console.error('Error searching products:', error)
      return { data: null, error }
    }

    const transformedData = data?.map(transformProduct) || []
    return { data: transformedData, error: null }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { data: null, error }
  }
}

/**
 * Get featured/recommended products
 */
export async function getFeaturedProducts(limit = 10) {
  return getProducts({ status: 'available', limit })
}
