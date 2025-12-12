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
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosClient.get<Category[]>('/categories')
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

/**
 * Get single category by ID
 */
export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await axiosClient.get<Category>(`/categories/${id}`)
  return response.data
}

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const response = await axiosClient.get<Category>(`/categories/slug/${slug}`)
  return response.data
}

const categoryService = {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
}

export default categoryService
