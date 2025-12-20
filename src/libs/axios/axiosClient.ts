import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

// Base API configuration - Supabase REST API
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Construct Supabase REST API URL
const SUPABASE_API_URL = SUPABASE_URL ? `${SUPABASE_URL}/rest/v1` : ''
const API_TIMEOUT = 30000 // 30 seconds

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase configuration is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.')
} else {
  console.log('✅ Axios Client configured with Supabase REST API:', SUPABASE_API_URL)
}

/**
 * Create axios instance with default configuration
 * Supports both Next.js API routes (/api/*) and Supabase PostgREST
 */
const axiosClient: AxiosInstance = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

/**
 * Request interceptor - Add authentication token
 * Handles both Next.js API routes (/api/*) and Supabase PostgREST
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Determine if this is an API route or Supabase REST call
    const isApiRoute = config.url?.startsWith('/api/')
    
    // Set base URL based on request type
    if (isApiRoute) {
      // API routes are relative to the app (no baseURL needed)
      config.baseURL = ''
    } else {
      // Supabase REST API
      config.baseURL = SUPABASE_API_URL
      if (config.headers) {
        config.headers['apikey'] = SUPABASE_ANON_KEY
        config.headers['Prefer'] = config.headers['Prefer'] || 'return=representation'
      }
    }
    
    // Get token from Zustand auth store in localStorage
    let token: string | null = null
    
    if (typeof window !== 'undefined') {
      try {
        const authStorage = localStorage.getItem('dntcell-auth-storage')
        if (authStorage) {
          const parsed = JSON.parse(authStorage)
          token = parsed?.state?.token || null
        }
      } catch (e) {
        console.error('[Axios] Failed to parse auth storage:', e)
      }
    }
    
    // Add Authorization header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    } else if (!isApiRoute && config.headers) {
      // Fallback to anon key for Supabase if no user token
      config.headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`
    }

    // Log request for debugging
    const fullUrl = isApiRoute ? config.url : `${config.baseURL}${config.url}`
    console.log(`[Axios] ${config.method?.toUpperCase()} ${fullUrl}`, config.params)

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor - Normalize errors and handle common cases
 */
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[Axios] Response received:`, response.status, response.data?.length || 'N/A')
    return response
  },
  (error: AxiosError) => {
    console.error('[Axios] Request failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    })
    
    // Normalize error structure
    const normalizedError = {
      message: 'An error occurred',
      status: error.response?.status || 500,
      data: error.response?.data || null,
    }

    // Handle specific error codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          normalizedError.message = 'Unauthorized. Please log in again.'
          // Optional: Trigger logout or redirect to login
          if (typeof window !== 'undefined') {
            // Clear auth storage
            localStorage.removeItem('dntcell-auth-storage')
            // Optionally redirect to login
            // window.location.href = '/login'
          }
          break
        case 403:
          normalizedError.message = 'Access forbidden.'
          break
        case 404:
          normalizedError.message = 'Resource not found.'
          break
        case 422:
          normalizedError.message = 'Validation error.'
          break
        case 500:
          normalizedError.message = 'Server error. Please try again later.'
          break
        default:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          normalizedError.message = (error.response.data as any)?.message || 'An error occurred'
      }
    } else if (error.request) {
      normalizedError.message = 'No response from server. Check your connection.'
    } else {
      normalizedError.message = error.message || 'Request setup failed.'
    }

    return Promise.reject(normalizedError)
  }
)

export default axiosClient
