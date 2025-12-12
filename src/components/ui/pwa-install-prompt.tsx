'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // Check if user has dismissed the prompt before
    const hasDismissed = localStorage.getItem('pwa-install-dismissed')
    if (hasDismissed) {
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show the prompt after 5 seconds
      setTimeout(() => {
        setShowPrompt(true)
      }, 5000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    }
    
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true')
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-9998 animate-slide-up">
      <div className="bg-white border-2 border-[#0e05ad] rounded-2xl p-4 shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-neutral-100 rounded-full transition-colors"
          aria-label="Tutup"
        >
          <X className="w-4 h-4 text-neutral-600" />
        </button>
        
        <div className="pr-6">
          <h3 className="font-bold text-[#0e05ad] mb-1">Install DNTCell</h3>
          <p className="text-sm text-neutral-600 mb-3">
            Install aplikasi untuk pengalaman yang lebih baik dan akses offline
          </p>
          <button
            onClick={handleInstall}
            className="w-full bg-[#0e05ad] text-white py-2.5 rounded-xl font-semibold hover:bg-[#0c04a0] transition-colors"
          >
            Install Sekarang
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
