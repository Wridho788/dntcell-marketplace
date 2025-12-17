/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * API Error class for structured error handling
 */
export class APIError extends Error {
  public statusCode: number
  public code: string
  public details?: any

  constructor(message: string, statusCode: number, code: string, details?: any) {
    super(message)
    this.name = 'APIError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

/**
 * Enhanced API Client with interceptors and error handling
 */
class APIClient {
  private client: AxiosInstance
  private onUnauthorized?: () => void
  private onForbidden?: () => void

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || '',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors() {
    // Request interceptor - attach token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          try {
            const authStorage = localStorage.getItem('dntcell-auth-storage')
            if (authStorage) {
              const { state } = JSON.parse(authStorage)
              if (state?.token) {
                config.headers.Authorization = `Bearer ${state.token}`
              }
            }
          } catch (error) {
            console.error('[APIClient] Failed to attach token:', error)
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return this.handleError(error)
      }
    )
  }

  /**
   * Handle API errors with proper error transformation
   */
  private handleError(error: AxiosError): Promise<never> {
    if (!error.response) {
      // Network error
      return Promise.reject(
        new APIError(
          'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
          0,
          'NETWORK_ERROR'
        )
      )
    }

    const { status, data } = error.response
    const errorData = data as any

    switch (status) {
      case 401:
        // Unauthorized - trigger logout
        if (this.onUnauthorized) {
          this.onUnauthorized()
        }
        return Promise.reject(
          new APIError(
            'Sesi Anda telah berakhir. Silakan login kembali.',
            401,
            'UNAUTHORIZED'
          )
        )

      case 403:
        // Forbidden
        if (this.onForbidden) {
          this.onForbidden()
        }
        return Promise.reject(
          new APIError(
            'Anda tidak memiliki akses untuk melakukan tindakan ini.',
            403,
            'FORBIDDEN'
          )
        )

      case 404:
        return Promise.reject(
          new APIError(
            errorData?.message || 'Data tidak ditemukan.',
            404,
            'NOT_FOUND'
          )
        )

      case 422:
        return Promise.reject(
          new APIError(
            errorData?.message || 'Data yang Anda masukkan tidak valid.',
            422,
            'VALIDATION_ERROR',
            errorData?.errors
          )
        )

      case 429:
        return Promise.reject(
          new APIError(
            'Terlalu banyak permintaan. Silakan coba lagi nanti.',
            429,
            'RATE_LIMIT'
          )
        )

      case 500:
      case 502:
      case 503:
      case 504:
        return Promise.reject(
          new APIError(
            'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
            status,
            'SERVER_ERROR'
          )
        )

      default:
        return Promise.reject(
          new APIError(
            errorData?.message || 'Terjadi kesalahan. Silakan coba lagi.',
            status,
            'UNKNOWN_ERROR'
          )
        )
    }
  }

  /**
   * Set callback for unauthorized errors
   */
  public setOnUnauthorized(callback: () => void) {
    this.onUnauthorized = callback
  }

  /**
   * Set callback for forbidden errors
   */
  public setOnForbidden(callback: () => void) {
    this.onForbidden = callback
  }

  /**
   * GET request
   */
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  /**
   * POST request
   */
  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  /**
   * PUT request
   */
  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  /**
   * PATCH request
   */
  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  /**
   * DELETE request
   */
  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  /**
   * Get axios instance for custom usage
   */
  public getInstance(): AxiosInstance {
    return this.client
  }
}

// Export singleton instance
export const apiClient = new APIClient()
export default apiClient
