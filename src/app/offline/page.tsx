'use client'

import { WifiOff } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-warning-100 rounded-full flex items-center justify-center">
          <WifiOff className="w-12 h-12 text-warning-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">
          Tidak Ada Koneksi Internet
        </h1>
        
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          Sepertinya Anda sedang offline. Periksa koneksi internet Anda dan coba lagi.
        </p>
        
        <button
          onClick={() => window.location.reload()}
          className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  )
}
