import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

// Base API configuration
// In production, this MUST be set via environment variable
// For now, return empty to prevent localhost calls in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '')
const API_TIMEOUT = 30000 // 30 seconds

if (!process.env.NEXT_PUBLIC_API_URL && typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  console.warn('⚠️ NEXT_PUBLIC_API_URL is not set. API calls will fail. Please configure your backend API URL in Vercel environment variables.')
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
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
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
      config.headers.Authorization = `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
    }

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
    return response
  },
  (error: AxiosError) => {
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
