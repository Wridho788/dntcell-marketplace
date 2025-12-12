'use client'

import { HTMLAttributes } from 'react'
import { Spinner } from './spinner'
import { cn } from '@/lib/utils'

export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  message?: string
  variant?: 'primary' | 'neutral' | 'white'
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
}

export function LoadingState({
  message = 'Loading...',
  variant = 'primary',
  size = 'md',
  fullPage = false,
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullPage && 'min-h-screen',
        !fullPage && 'py-12',
        className
      )}
      {...props}
    >
      <Spinner size={size} variant={variant} />
      {message && (
        <p className={cn(
          'text-sm font-medium',
          variant === 'white' && 'text-white',
          variant === 'neutral' && 'text-neutral-600',
          variant === 'primary' && 'text-neutral-600'
        )}>
          {message}
        </p>
      )}
    </div>
  )
}
