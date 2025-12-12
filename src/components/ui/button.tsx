import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] touch-manipulation',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-primary-400 shadow-sm',
        secondary:
          'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-300 focus-visible:ring-secondary-400',
        success:
          'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 focus-visible:ring-success-400 shadow-sm',
        outline:
          'border-2 border-neutral-300 bg-transparent hover:bg-neutral-50 active:bg-neutral-100 text-neutral-700 focus-visible:ring-neutral-400',
        ghost:
          'hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700 focus-visible:ring-neutral-400',
        destructive:
          'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 focus-visible:ring-error-400 shadow-sm',
      },
      size: {
        sm: 'h-10 px-4 text-xs min-h-[44px]',
        md: 'h-11 px-5 text-sm min-h-[44px]',
        lg: 'h-12 px-6 text-base min-h-[44px]',
        icon: 'h-11 w-11 min-h-[44px] min-w-[44px]',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && icon && icon}
        {children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
