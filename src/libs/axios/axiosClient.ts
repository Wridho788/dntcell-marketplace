import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

// Base API configuration - Supabase REST API
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Construct Supabase REST API URL
const API_BASE_URL = SUPABASE_URL ? `${SUPABASE_URL}/rest/v1` : ''
const API_TIMEOUT = 30000 // 30 seconds

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase configuration is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.')
} else {
  console.log('✅ Axios Client configured with Supabase REST API:', API_BASE_URL)
}

/**
 * Create axios instance with default configuration
 * For Supabase PostgREST, we need apikey header
 */
const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Prefer': 'return=representation', // Supabase: return updated data
  },
})

/**
 * Request interceptor - Add authentication token
 * For Supabase PostgREST: use Bearer token in Authorization header
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (Supabase auth token)
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    } else if (config.headers) {
      // Fallback to anon key if no user token
      config.headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`
    }

    // Log request for debugging
    console.log(`[Axios] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params)

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
    console.error('[Axios] Request failed:', error.message, error.response?.status)
    
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
            // Clear auth token
            localStorage.removeItem('auth_token')
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
