import { useQuery, useInfiniteQuery, UseQueryOptions } from '@tanstack/react-query'
import productService, { Product, ProductFilters, ProductImage } from '@/services/product.service'

/**
 * Get products with filters
 */
export function useProducts(filters?: ProductFilters, options?: UseQueryOptions<Product[], Error>) {
  return useQuery<Product[], Error>({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

/**
 * Infinite scroll products
 */
export function useInfiniteProducts(filters?: ProductFilters, limit = 10) {
  return useInfiniteQuery<Product[], Error>({
    queryKey: ['products-infinite', filters],
    queryFn: async ({ pageParam }) => {
      const offset = typeof pageParam === 'number' ? pageParam : 0
      return productService.getProducts({ ...filters, limit, offset })
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < limit) return undefined
      return allPages.length * limit
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Get single product by ID
 */
export function useProductDetail(id: string, options?: UseQueryOptions<Product, Error>) {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  })
}

/**
 * Get product images
 */
export function useProductImages(productId: string, options?: UseQueryOptions<ProductImage[], Error>) {
  return useQuery<ProductImage[], Error>({
    queryKey: ['product-images', productId],
    queryFn: () => productService.getProductImages(productId),
    enabled: !!productId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  })
}

/**
 * Search products
 */
export function useSearchProducts(query: string, limit = 20) {
  return useQuery<Product[], Error>({
    queryKey: ['products-search', query, limit],
    queryFn: () => productService.searchProducts(query, limit),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Get featured products
 */
export function useFeaturedProducts(limit = 10, options?: UseQueryOptions<Product[], Error>) {
  return useQuery<Product[], Error>({
    queryKey: ['products-featured', limit],
    queryFn: () => productService.getFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  })
}

/**
 * Get products by category
 */
export function useProductsByCategory(categoryId: string, limit?: number, options?: UseQueryOptions<Product[], Error>) {
  return useQuery<Product[], Error>({
    queryKey: ['products-category', categoryId, limit],
    queryFn: () => productService.getProductsByCategory(categoryId, limit),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
