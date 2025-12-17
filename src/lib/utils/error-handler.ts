/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIError } from '@/lib/api/api-client'

/**
 * Error Handler
 * Centralized error handling and user-friendly message mapping
 */

export interface ErrorInfo {
  message: string
  code: string
  canRetry: boolean
  shouldLogout: boolean
}

/**
 * Error code to user message mapping
 */
const ERROR_MESSAGES: Record<string, string> = {
  // Network errors
  NETWORK_ERROR: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
  TIMEOUT_ERROR: 'Permintaan timeout. Silakan coba lagi.',
  
  // Auth errors
  UNAUTHORIZED: 'Sesi Anda telah berakhir. Silakan login kembali.',
  FORBIDDEN: 'Anda tidak memiliki akses untuk melakukan tindakan ini.',
  INVALID_CREDENTIALS: 'Email atau password salah.',
  SESSION_EXPIRED: 'Sesi Anda telah berakhir. Silakan login kembali.',
  
  // Data errors
  NOT_FOUND: 'Data tidak ditemukan.',
  VALIDATION_ERROR: 'Data yang Anda masukkan tidak valid.',
  DUPLICATE_ERROR: 'Data sudah ada.',
  
  // Server errors
  SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
  SERVICE_UNAVAILABLE: 'Layanan sedang tidak tersedia. Silakan coba lagi nanti.',
  RATE_LIMIT: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
  
  // Generic
  UNKNOWN_ERROR: 'Terjadi kesalahan. Silakan coba lagi.'
}

/**
 * Parse error and return structured error info
 */
export function parseError(error: any): ErrorInfo {
  // Handle APIError
  if (error instanceof APIError) {
    return {
      message: error.message,
      code: error.code,
      canRetry: isRetryableError(error.code),
      shouldLogout: error.code === 'UNAUTHORIZED' || error.code === 'SESSION_EXPIRED'
    }
  }

  // Handle network errors
  if (error?.code === 'ERR_NETWORK' || !error?.response) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      code: 'NETWORK_ERROR',
      canRetry: true,
      shouldLogout: false
    }
  }

  // Handle timeout
  if (error?.code === 'ECONNABORTED') {
    return {
      message: ERROR_MESSAGES.TIMEOUT_ERROR,
      code: 'TIMEOUT_ERROR',
      canRetry: true,
      shouldLogout: false
    }
  }

  // Handle standard Error
  if (error instanceof Error) {
    return {
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      code: 'UNKNOWN_ERROR',
      canRetry: false,
      shouldLogout: false
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      code: 'UNKNOWN_ERROR',
      canRetry: false,
      shouldLogout: false
    }
  }

  // Default fallback
  return {
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
    code: 'UNKNOWN_ERROR',
    canRetry: false,
    shouldLogout: false
  }
}

/**
 * Check if error is retryable
 */
export function isRetryableError(code: string): boolean {
  const retryableCodes = [
    'NETWORK_ERROR',
    'TIMEOUT_ERROR',
    'SERVER_ERROR',
    'SERVICE_UNAVAILABLE'
  ]
  
  return retryableCodes.includes(code)
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: any): string {
  const errorInfo = parseError(error)
  return errorInfo.message
}

/**
 * Log error for debugging/telemetry
 */
export function logError(error: any, context?: {
  feature?: string
  route?: string
  action?: string
  userId?: string
}): void {
  const errorInfo = parseError(error)
  
  const logData = {
    timestamp: new Date().toISOString(),
    code: errorInfo.code,
    message: errorInfo.message,
    context,
    stack: error?.stack,
    raw: error
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', logData)
  }

  // TODO: Send to external logging service in production
  if (process.env.NODE_ENV === 'production') {
    // Send to logging service (Sentry, LogRocket, etc.)
  }
}

/**
 * Global error handler for uncaught errors
 */
export function setupGlobalErrorHandler(): void {
  if (typeof window === 'undefined') return

  // Handle uncaught promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault()
    logError(event.reason, {
      feature: 'global',
      route: window.location.pathname
    })
  })

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    event.preventDefault()
    logError(event.error, {
      feature: 'global',
      route: window.location.pathname
    })
  })
}

/**
 * Create an error boundary handler
 */
export function createErrorHandler(feature: string) {
  return (error: any, action?: string) => {
    logError(error, {
      feature,
      route: typeof window !== 'undefined' ? window.location.pathname : undefined,
      action
    })
    
    return parseError(error)
  }
}

/**
 * Validation error helper
 */
export function formatValidationErrors(errors: Record<string, string[]>): string {
  const messages = Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n')
  
  return messages || 'Data yang Anda masukkan tidak valid.'
}
