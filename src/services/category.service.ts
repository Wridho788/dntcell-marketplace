import axiosClient from '@/libs/axios/axiosClient'

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  description?: string
  product_count?: number
  created_at?: string
  updated_at?: string
}

/**
 * Get all categories
 * Supabase PostgREST format: /categories?select=*&order=name.asc
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosClient.get<Category[]>('/categories', {
      params: {
        select: '*',
        order: 'name.asc'
      }
    })
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

/**
 * Get single category by ID
 * Supabase PostgREST format: /categories?id=eq.123&select=*
 */
export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await axiosClient.get<Category[]>('/categories', {
    params: {
      id: `eq.${id}`,
      select: '*',
      limit: 1
    }
  })
  return response.data[0]
}

/**
 * Get category by slug
 * Supabase PostgREST format: /categories?slug=eq.electronics&select=*
 */
export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const response = await axiosClient.get<Category[]>('/categories', {
    params: {
      slug: `eq.${slug}`,
      select: '*',
      limit: 1
    }
  })
  return response.data[0]
}

const categoryService = {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
}

export default categoryService
