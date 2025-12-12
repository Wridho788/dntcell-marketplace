import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './button'

interface ErrorStateProps {
  error?: Error | { message: string; status?: number } | null
  message?: string
  onRetry?: () => void
  className?: string
  fullScreen?: boolean
}

export function ErrorState({ 
  error, 
  message,
  onRetry,
  className = '',
  fullScreen = false
}: ErrorStateProps) {
  const errorMessage = message || error?.message || 'Something went wrong'
  
  const content = (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Oops! Something went wrong
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
          {errorMessage}
        </p>
      </div>

      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        {content}
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      {content}
    </div>
  )
}

export default ErrorState
