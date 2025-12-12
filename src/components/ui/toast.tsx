'use client'

import { useEffect, useState, createContext, useContext, ReactNode } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success-600" />,
    error: <XCircle className="w-5 h-5 text-error-600" />,
    info: <Info className="w-5 h-5 text-info-600" />
  }

  const bgColors = {
    success: 'bg-success-50 border-success-200',
    error: 'bg-error-50 border-error-200',
    info: 'bg-info-50 border-info-200'
  }

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className={`${bgColors[type]} border rounded-xl p-4 shadow-lg flex items-center gap-3 min-w-[280px] max-w-[90vw]`}>
        {icons[type]}
        <p className="text-sm font-medium text-neutral-900 flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="p-1 hover:bg-black/5 rounded transition-colors"
        >
          <X className="w-4 h-4 text-neutral-600" />
        </button>
      </div>
    </div>
  )
}

// Toast Container Hook & Context
let toastId = 0

interface ToastData {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  toasts: ToastData[]
  showToast: (message: string, type?: ToastType) => void
  removeToast: (id: number) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = toastId++
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const value = {
    toasts,
    showToast,
    removeToast,
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    info: (message: string) => showToast(message, 'info'),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastData[]
  onRemove: (id: number) => void
}

function ToastContainerInternal({ toasts, onRemove }: ToastContainerProps) {
  if (!toasts || toasts.length === 0) return null
  
  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </>
  )
}

// Global Toast Container (use this in AppProvider)
export function ToastContainer() {
  const context = useContext(ToastContext)
  
  // Return null if context is not available (during SSR or before hydration)
  if (!context) return null
  
  const { toasts, removeToast } = context
  
  return <ToastContainerInternal toasts={toasts} onRemove={removeToast} />
}
