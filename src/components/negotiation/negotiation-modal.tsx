/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Tag, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createNegotiation } from '@/services/negotiation.service'
import type { Product } from '@/services/product.service'
import { formatCurrency } from '@/lib/utils/format'
import { logUserAction } from '@/lib/utils/logger'
import Image from 'next/image'

interface NegotiationModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function NegotiationModal({ product, isOpen, onClose, onSuccess }: NegotiationModalProps) {
  const router = useRouter()
  const [offeredPrice, setOfferedPrice] = useState('')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const minPrice = product.min_negotiable_price || Math.floor(product.price * 0.7)
  const maxPrice = product.price

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const price = parseFloat(offeredPrice)

    // Validation
    if (isNaN(price) || price <= 0) {
      setError('Harga harus berupa angka yang valid')
      return
    }

    if (price < minPrice) {
      setError(`Harga penawaran minimal ${formatCurrency(minPrice)}`)
      return
    }

    if (price >= maxPrice) {
      setError(`Harga penawaran harus lebih rendah dari ${formatCurrency(maxPrice)}`)
      return
    }

    setIsSubmitting(true)

    try {
      logUserAction('nego_submitted', {
        product_id: product.id,
        product_name: product.name,
        offered_price: price,
        original_price: product.price
      })

      const negotiation = await createNegotiation({
        product_id: product.id,
        offered_price: price,
        buyer_note: note.trim() || undefined
      })

      logUserAction('nego_created', {
        negotiation_id: negotiation.id,
        product_id: product.id
      })

      onSuccess?.()
      router.push(`/negotiations/${negotiation.id}`)
    } catch (err: any) {
      console.error('Failed to create negotiation:', err)
      
      if (err.response?.data?.message?.includes('already exists')) {
        setError('Anda sudah memiliki negosiasi aktif untuk produk ini')
      } else if (err.response?.data?.message?.includes('unavailable')) {
        setError('Produk tidak tersedia untuk negosiasi')
      } else if (err.response?.data?.message?.includes('out of range')) {
        setError('Harga penawaran di luar jangkauan yang diizinkan')
      } else {
        setError('Gagal mengirim penawaran. Silakan coba lagi.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePriceChange = (value: string) => {
    // Only allow numbers
    const cleaned = value.replace(/[^\d]/g, '')
    setOfferedPrice(cleaned)
    setError('')
  }

  const formatInputPrice = (value: string) => {
    if (!value) return ''
    const number = parseFloat(value)
    return number.toLocaleString('id-ID')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-neutral-900">Ajukan Negosiasi</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Summary */}
          <div className="flex gap-4 p-4 bg-neutral-50 rounded-xl">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-200 shrink-0">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <Tag className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 line-clamp-2 mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-neutral-600">
                Harga Jual: <span className="font-bold text-primary-600">{formatCurrency(product.price)}</span>
              </p>
            </div>
          </div>

          {/* Price Range Info */}
          <div className="bg-info-50 border border-info-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-info-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-info-900 mb-1">
                  Rentang Harga yang Diterima
                </p>
                <p className="text-sm text-info-800">
                  {formatCurrency(minPrice)} - {formatCurrency(maxPrice - 1)}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Price Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Harga Penawaran <span className="text-error-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
                  Rp
                </span>
                <input
                  type="text"
                  value={formatInputPrice(offeredPrice)}
                  onChange={(e) => handlePriceChange(e.target.value.replace(/\./g, ''))}
                  placeholder="0"
                  className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg font-semibold"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {offeredPrice && !isNaN(parseFloat(offeredPrice)) && (
                <p className="mt-2 text-xs text-neutral-600">
                  {parseFloat(offeredPrice) < minPrice && (
                    <span className="text-error-600">⚠️ Di bawah harga minimum</span>
                  )}
                  {parseFloat(offeredPrice) >= maxPrice && (
                    <span className="text-error-600">⚠️ Harus lebih rendah dari harga jual</span>
                  )}
                  {parseFloat(offeredPrice) >= minPrice && parseFloat(offeredPrice) < maxPrice && (
                    <span className="text-success-600">✓ Harga valid</span>
                  )}
                </p>
              )}
            </div>

            {/* Note Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Catatan (Opsional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tambahkan catatan untuk admin..."
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-neutral-500 text-right">
                {note.length}/200
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                <p className="text-sm text-error-800">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting || !offeredPrice || parseFloat(offeredPrice) < minPrice || parseFloat(offeredPrice) >= maxPrice}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Penawaran'}
            </Button>
          </form>

          {/* Info */}
          <div className="text-xs text-neutral-600 text-center">
            <p>Penawaran Anda akan ditinjau oleh admin.</p>
            <p>Anda akan menerima notifikasi setelah penawaran diproses.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
