/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Contract Safety Layer
 * Provides null-safe transformers and defensive validation
 */

/**
 * Safely get a value with fallback
 */
export function safeValue<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback
}

/**
 * Safely get a string value
 */
export function safeString(value: any, fallback: string = ''): string {
  if (typeof value === 'string') return value
  if (value === null || value === undefined) return fallback
  return String(value)
}

/**
 * Safely get a number value
 */
export function safeNumber(value: any, fallback: number = 0): number {
  if (typeof value === 'number' && !isNaN(value)) return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    if (!isNaN(parsed)) return parsed
  }
  return fallback
}

/**
 * Safely get a boolean value
 */
export function safeBoolean(value: any, fallback: boolean = false): boolean {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 1) return true
  if (value === 0) return false
  return fallback
}

/**
 * Safely get an array value
 */
export function safeArray<T>(value: any, fallback: T[] = []): T[] {
  if (Array.isArray(value)) return value
  return fallback
}

/**
 * Safely get an object value
 */
export function safeObject<T extends object>(value: any, fallback: T): T {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as T
  }
  return fallback
}

/**
 * Safely get a date value
 */
export function safeDate(value: any, fallback?: Date): Date | null {
  if (value instanceof Date && !isNaN(value.getTime())) return value
  
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    if (!isNaN(date.getTime())) return date
  }
  
  return fallback || null
}

/**
 * Transform API response to safe format
 */
export function transformResponse<T>(data: any, transformer: (item: any) => T): T {
  try {
    return transformer(data)
  } catch (error) {
    console.error('[transformResponse] Transformation failed:', error)
    throw new Error('Failed to transform API response')
  }
}

/**
 * Transform API array response to safe format
 */
export function transformArrayResponse<T>(
  data: any,
  transformer: (item: any) => T
): T[] {
  if (!Array.isArray(data)) {
    console.warn('[transformArrayResponse] Expected array, got:', typeof data)
    return []
  }

  return data.map((item, index) => {
    try {
      return transformer(item)
    } catch (error) {
      console.error(`[transformArrayResponse] Failed to transform item ${index}:`, error)
      return null
    }
  }).filter((item): item is T => item !== null)
}

/**
 * Validate required fields in an object
 */
export function validateRequired<T extends object>(
  obj: any,
  requiredFields: (keyof T)[]
): obj is T {
  if (!obj || typeof obj !== 'object') return false

  return requiredFields.every(field => {
    const value = obj[field as string]
    return value !== null && value !== undefined && value !== ''
  })
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * Safe JSON stringify
 */
export function safeJsonStringify(obj: any, fallback: string = '{}'): string {
  try {
    return JSON.stringify(obj)
  } catch {
    return fallback
  }
}

/**
 * Extract error message from various error formats
 */
export function extractErrorMessage(error: any): string {
  if (typeof error === 'string') return error
  
  if (error?.message) return error.message
  
  if (error?.error?.message) return error.error.message
  
  if (error?.data?.message) return error.data.message
  
  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    return error.errors[0].message || error.errors[0]
  }
  
  return 'Terjadi kesalahan yang tidak diketahui'
}

/**
 * Paginated response transformer
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function transformPaginatedResponse<T>(
  response: any,
  transformer: (item: any) => T
): PaginatedResponse<T> {
  const data = safeArray(response?.data)
  const total = safeNumber(response?.total, 0)
  const page = safeNumber(response?.page, 1)
  const pageSize = safeNumber(response?.pageSize || response?.per_page, 10)
  
  return {
    data: transformArrayResponse(data, transformer),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}

/**
 * Create a safe transformer function
 */
export function createTransformer<T>(
  transform: (data: any) => T
): (data: any) => T {
  return (data: any) => {
    try {
      return transform(data)
    } catch (error) {
      console.error('[createTransformer] Transformation failed:', error)
      throw error
    }
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}
