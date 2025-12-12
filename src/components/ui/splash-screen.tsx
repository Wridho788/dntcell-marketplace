'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash')
    
    if (!hasSeenSplash) {
      setIsVisible(true)
      sessionStorage.setItem('hasSeenSplash', 'true')
      
      // Hide splash screen after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-white animate-fade-in"
      style={{
        animation: 'fadeIn 0.5s ease-in, fadeOut 0.5s ease-out 2.5s forwards'
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-32 h-32 animate-bounce-slow">
          <Image
            src="/dntcell-logo.jpeg"
            alt="DNTCell Logo"
            fill
            className="object-contain rounded-2xl shadow-lg"
            priority
          />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0e05ad] font-display">DNTCell</h1>
          <p className="text-sm text-neutral-600 mt-1">Marketplace Terpercaya</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
            visibility: hidden;
          }
        }
        
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
