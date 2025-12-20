'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, AlertTriangle } from 'lucide-react'

interface CancelOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  isLoading?: boolean
}

const CANCEL_REASONS = [
  'Berubah pikiran',
  'Menemukan harga lebih murah',
  'Salah pilih produk',
  'Penjual tidak responsif',
  'Barang tidak sesuai deskripsi',
  'Lainnya'
]

export function CancelOrderModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  isLoading = false
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    const reason = selectedReason === 'Lainnya' ? customReason : selectedReason
    if (!reason.trim()) {
      alert('Harap pilih alasan pembatalan')
      return
    }
    onConfirm(reason)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-900">
            Batalkan Pesanan
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning */}
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
            <div className="text-sm text-warning-800">
              <p className="font-semibold mb-1">Perhatian!</p>
              <p>Pesanan yang sudah dibatalkan tidak dapat dikembalikan. Pastikan keputusan Anda sudah tepat.</p>
            </div>
          </div>
        </div>

        {/* Reason Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-neutral-900 mb-3">
            Alasan Pembatalan
          </label>
          <div className="space-y-2">
            {CANCEL_REASONS.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedReason === reason
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name="cancel_reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  disabled={isLoading}
                  className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">{reason}</span>
              </label>
            ))}
          </div>

          {/* Custom Reason Input */}
          {selectedReason === 'Lainnya' && (
            <div className="mt-4">
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Jelaskan alasan Anda..."
                disabled={isLoading}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Kembali
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !selectedReason}
            className="flex-1"
          >
            {isLoading ? 'Membatalkan...' : 'Ya, Batalkan'}
          </Button>
        </div>
      </div>
    </div>
  )
}
