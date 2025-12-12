import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import categoryService, { Category } from '@/services/category.service'

/**
 * Get all categories
 */
export function useCategories(options?: UseQueryOptions<Category[], Error>) {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  })
}

/**
 * Get single category by ID
 */
export function useCategoryById(id: string, options?: UseQueryOptions<Category, Error>) {
  return useQuery<Category, Error>({
    queryKey: ['category', id],
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
    ...options,
  })
}

/**
 * Get category by slug
 */
export function useCategoryBySlug(slug: string, options?: UseQueryOptions<Category, Error>) {
  return useQuery<Category, Error>({
    queryKey: ['category-slug', slug],
    queryFn: () => categoryService.getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 30 * 60 * 1000,
    ...options,
  })
}
