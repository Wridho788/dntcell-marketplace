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
  const [isLeaving, setIsLeaving] = useState(false)

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(onClose, 400)
  }

  useEffect(() => {
    // Enter animation
    requestAnimationFrame(() => {
      setIsVisible(true)
    })

    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration])

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-white" />,
    error: <XCircle className="w-6 h-6 text-white" />,
    info: <Info className="w-6 h-6 text-white" />
  }

  const bgColors = {
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
    info: 'bg-gradient-to-r from-[#0e05ad] to-blue-600'
  }

  const borderColors = {
    success: 'border-green-400/30',
    error: 'border-red-400/30',
    info: 'border-[#0e05ad]/30'
  }

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-9999 transition-all duration-400 ease-out ${
        isVisible && !isLeaving 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 -translate-y-4 scale-95'
      }`}
      style={{
        animation: isLeaving 
          ? 'toastExit 0.4s ease-out forwards' 
          : 'toastEnter 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      <div 
        className={`
          ${bgColors[type]} ${borderColors[type]}
          backdrop-blur-sm border-2
          rounded-2xl p-4 shadow-2xl 
          flex items-center gap-3 
          min-w-[300px] max-w-[90vw]
          transform hover:scale-105 transition-transform duration-200
        `}
      >
        <div className="shrink-0 animate-bounce-subtle">
          {icons[type]}
        </div>
        <p className="text-sm font-semibold text-white flex-1 leading-relaxed">
          {message}
        </p>
        <button
          onClick={handleClose}
          className="shrink-0 p-1.5 hover:bg-white/20 rounded-lg transition-all duration-200 hover:rotate-90"
          aria-label="Tutup notifikasi"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      <style jsx>{`
        @keyframes toastEnter {
          0% {
            opacity: 0;
            transform: translate(-50%, -20px) scale(0.9);
          }
          50% {
            transform: translate(-50%, 5px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
        
        @keyframes toastExit {
          0% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -20px) scale(0.9);
          }
        }
        
        @keyframes bounceSuttle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        .animate-bounce-subtle {
          animation: bounceSuttle 0.6s ease-in-out;
        }
      `}</style>
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
