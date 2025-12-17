/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Telemetry & Logging System
 * Centralized logging for errors and events
 */

interface LogContext {
  feature?: string
  route?: string
  action?: string
  userId?: string
  metadata?: Record<string, any>
  timestamp?: string
  userAgent?: string
  viewport?: {
    width: number
    height: number
  }
}

interface LogEvent {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  context?: LogContext
  error?: any
}

class Logger {
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  /**
   * Log error message
   */
  error(message: string, error?: any, context?: LogContext): void {
    this.log('error', message, context, error)
  }

  /**
   * Log debug message (dev only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log('debug', message, context)
    }
  }

  /**
   * Core logging function
   */
  private log(
    level: LogEvent['level'],
    message: string,
    context?: LogContext,
    error?: any
  ): void {
    const logEvent: LogEvent = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.enrichContext(context),
      error: this.sanitizeError(error)
    }

    // Console output in development
    if (this.isDevelopment) {
      this.consoleLog(logEvent)
    }

    // Send to external service in production
    if (!this.isDevelopment && level === 'error') {
      this.sendToExternalService(logEvent)
    }

    // Store in local storage for debugging (last 100 logs)
    this.storeLocally(logEvent)
  }

  /**
   * Enrich context with additional data
   */
  private enrichContext(context?: LogContext): LogContext {
    if (typeof window === 'undefined') return context || {}

    return {
      ...context,
      route: context?.route || window.location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  }

  /**
   * Sanitize error for logging
   */
  private sanitizeError(error: any): any {
    if (!error) return null

    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    }

    return error
  }

  /**
   * Console output with formatting
   */
  private consoleLog(event: LogEvent): void {
    const { level, message, context, error } = event
    
    const styles: Record<LogEvent['level'], string> = {
      info: 'color: #3b82f6; font-weight: bold',
      warn: 'color: #f59e0b; font-weight: bold',
      error: 'color: #ef4444; font-weight: bold',
      debug: 'color: #8b5cf6; font-weight: bold'
    }

    console.log(
      `%c[${level.toUpperCase()}] ${message}`,
      styles[level]
    )

    if (context) {
      console.log('Context:', context)
    }

    if (error) {
      console.error('Error:', error)
    }
  }

  /**
   * Send to external logging service
   */
  private sendToExternalService(event: LogEvent): void {
    // TODO: Implement integration with logging service
    // Examples: Sentry, LogRocket, Datadog, etc.
    
    // For now, just queue it
    if (typeof window !== 'undefined') {
      try {
        const queue = this.getErrorQueue()
        queue.push(event)
        
        // Keep only last 50 errors
        if (queue.length > 50) {
          queue.shift()
        }
        
        localStorage.setItem('dntcell-error-queue', JSON.stringify(queue))
      } catch {
        // Ignore localStorage errors
      }
    }
  }

  /**
   * Store log locally for debugging
   */
  private storeLocally(event: LogEvent): void {
    if (typeof window === 'undefined') return

    try {
      const logs = this.getLocalLogs()
      logs.push(event)
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.shift()
      }
      
      localStorage.setItem('dntcell-logs', JSON.stringify(logs))
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Get local logs
   */
  private getLocalLogs(): LogEvent[] {
    if (typeof window === 'undefined') return []

    try {
      const logs = localStorage.getItem('dntcell-logs')
      return logs ? JSON.parse(logs) : []
    } catch {
      return []
    }
  }

  /**
   * Get error queue
   */
  private getErrorQueue(): LogEvent[] {
    if (typeof window === 'undefined') return []

    try {
      const queue = localStorage.getItem('dntcell-error-queue')
      return queue ? JSON.parse(queue) : []
    } catch {
      return []
    }
  }

  /**
   * Get all stored logs
   */
  public getLogs(): LogEvent[] {
    return this.getLocalLogs()
  }

  /**
   * Clear stored logs
   */
  public clearLogs(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem('dntcell-logs')
      localStorage.removeItem('dntcell-error-queue')
    } catch {
      // Ignore
    }
  }

  /**
   * Export logs as JSON
   */
  public exportLogs(): string {
    const logs = this.getLocalLogs()
    return JSON.stringify(logs, null, 2)
  }
}

// Export singleton instance
export const logger = new Logger()

/**
 * Helper function to log feature actions
 */
export function logFeatureAction(
  feature: string,
  action: string,
  metadata?: Record<string, any>
): void {
  logger.info(`Feature action: ${feature} - ${action}`, {
    feature,
    action,
    metadata
  })
}

/**
 * Helper function to log API calls
 */
export function logApiCall(
  method: string,
  endpoint: string,
  status?: number,
  error?: any
): void {
  if (error) {
    logger.error(`API ${method} ${endpoint} failed`, error, {
      action: 'api_call',
      metadata: { method, endpoint, status }
    })
  } else {
    logger.debug(`API ${method} ${endpoint} succeeded`, {
      action: 'api_call',
      metadata: { method, endpoint, status }
    })
  }
}

/**
 * Helper function to log user actions
 */
export function logUserAction(
  action: string,
  metadata?: Record<string, any>
): void {
  logger.info(`User action: ${action}`, {
    action: 'user_action',
    metadata
  })
}
