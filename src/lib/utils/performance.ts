/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

/**
 * Performance Optimization Utilities
 */

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Memoize function results
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = func(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Lazy load component
 * Note: Use dynamic import with next/dynamic instead for better Next.js support
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return React.lazy(importFunc)
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      options
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return isIntersecting
}

/**
 * Prefetch data hook
 */
export function usePrefetch<T>(
  fetchFn: () => Promise<T>,
  condition: boolean = true
): void {
  React.useEffect(() => {
    if (condition) {
      fetchFn()
    }
  }, [fetchFn, condition])
}

/**
 * Image preloader
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Batch image preloader
 */
export async function preloadImages(srcs: string[]): Promise<void> {
  await Promise.all(srcs.map(preloadImage))
}

/**
 * Request idle callback wrapper
 */
export function runWhenIdle(callback: () => void): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback)
  } else {
    setTimeout(callback, 1)
  }
}

/**
 * Get optimal image size based on device
 */
export function getOptimalImageSize(
  baseWidth: number,
  baseHeight: number
): { width: number; height: number } {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  
  return {
    width: Math.round(baseWidth * dpr),
    height: Math.round(baseHeight * dpr)
  }
}

/**
 * Performance measurement
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map()

  start(label: string): void {
    this.marks.set(label, performance.now())
  }

  end(label: string): number | null {
    const startTime = this.marks.get(label)
    if (!startTime) return null

    const duration = performance.now() - startTime
    this.marks.delete(label)

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`)
    }

    return duration
  }

  measure(label: string, fn: () => void): number {
    this.start(label)
    fn()
    return this.end(label) || 0
  }

  async measureAsync(label: string, fn: () => Promise<void>): Promise<number> {
    this.start(label)
    await fn()
    return this.end(label) || 0
  }
}

export const performanceMonitor = new PerformanceMonitor()

/**
 * Check if code is running on client
 */
export const isClient = typeof window !== 'undefined'

/**
 * Check if code is running on server
 */
export const isServer = typeof window === 'undefined'

/**
 * Get viewport dimensions
 */
export function getViewport(): { width: number; height: number } {
  if (isServer) return { width: 0, height: 0 }

  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (isServer) return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Get connection type
 */
export function getConnectionType(): string {
  if (isServer) return 'unknown'

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  
  return connection?.effectiveType || 'unknown'
}

/**
 * Check if connection is slow
 */
export function isSlowConnection(): boolean {
  const type = getConnectionType()
  return type === 'slow-2g' || type === '2g'
}
