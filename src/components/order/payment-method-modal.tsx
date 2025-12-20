'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  CreditCard, 
  HandshakeIcon, 
  X, 
  AlertCircle,
  CheckCircle2 
} from 'lucide-react'
import type { PaymentMethod } from '@/services/order.service'

interface PaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productName: string
  finalPrice: number
  negotiationId?: string
  onConfirm: (method: PaymentMethod, deliveryType?: 'meetup' | 'shipping') => void
}

export function PaymentMethodModal({ 
  isOpen, 
  onClose, 
  productId,
  productName,
  finalPrice,
  negotiationId,
  onConfirm 
}: PaymentMethodModalProps) {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [showTransferOptions, setShowTransferOptions] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  if (!isOpen) return null

  const handleMethodSelect = (method: PaymentMethod) => {
    if (method === 'transfer') {
      setSelectedMethod(method)
      setShowTransferOptions(true)
    } else if (method === 'meetup' || method === 'cod') {
      setSelectedMethod(method)
      setShowTransferOptions(false)
    }
  }

  const handleTransferOptionSelect = (deliveryType: 'meetup' | 'shipping') => {
    if (!agreeToTerms && deliveryType === 'meetup') {
      alert('Harap setujui syarat dan ketentuan terlebih dahulu')
      return
    }
    onConfirm('transfer', deliveryType)
  }

  const handleMeetupConfirm = () => {
    if (!agreeToTerms) {
      alert('Harap setujui syarat dan ketentuan terlebih dahulu')
      return
    }
    onConfirm('meetup', 'meetup')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 max-h-[120vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">
            Pilih Metode Pembayaran
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Info */}
        <div className="bg-neutral-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-neutral-600 mb-1">Produk</p>
          <p className="font-semibold text-neutral-900 mb-2">{productName}</p>
          <p className="text-lg font-bold text-primary-600">
            Rp {finalPrice.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Payment Methods */}
        {!showTransferOptions ? (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 mb-8">
            {/* Transfer Bank */}
            <button
              onClick={() => handleMethodSelect('transfer')}
              className={`w-full flex items-start gap-4 p-4 border-2 rounded-xl transition-all ${
                selectedMethod === 'transfer'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-primary-300'
              }`}
            >
              <div className="p-3 bg-primary-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-neutral-900 mb-1">
                  Transfer Bank
                </h3>
                <p className="text-sm text-neutral-600">
                  Transfer ke rekening yang ditentukan
                </p>
              </div>
            </button>

            {/* COD / Meetup */}
            <button
              onClick={() => handleMethodSelect('meetup')}
              className={`w-full flex items-start gap-4 p-4 border-2 rounded-xl transition-all mb-8 ${
                selectedMethod === 'meetup'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-primary-300'
              }`}
            >
              <div className="p-3 bg-purple-100 rounded-lg">
                <HandshakeIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-neutral-900 mb-1">
                  COD / Meetup
                </h3>
                <p className="text-sm text-neutral-600">
                  Bayar setelah bertemu dan cek barang
                </p>
              </div>
            </button>

            {/* Terms for Meetup */}
            {selectedMethod === 'meetup' && (
              <div className="mt-4 mb-8">
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-warning-800">
                      <p className="font-semibold mb-1">Penting!</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Pembayaran dilakukan setelah bertemu penjual</li>
                        <li>Periksa kondisi barang dengan teliti</li>
                        <li>Jika barang tidak sesuai, Anda bisa membatalkan transaksi</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-700">
                    Saya memahami dan menyetujui syarat dan ketentuan transaksi COD/Meetup
                  </span>
                </label>

                <Button
                  onClick={handleMeetupConfirm}
                  disabled={!agreeToTerms}
                  className="w-full mt-4"
                  variant={'outline'}
                >
                  Lanjutkan
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Transfer Options */
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <button
              onClick={() => setShowTransferOptions(false)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-2"
            >
              ← Kembali
            </button>

            <p className="text-sm text-neutral-600 mb-4">
              Pilih opsi transfer yang sesuai:
            </p>

            {/* Transfer Normal */}
            <button
              onClick={() => handleTransferOptionSelect('shipping')}
              className="w-full flex items-start gap-4 p-4 border-2 border-neutral-200 hover:border-primary-300 rounded-xl transition-all"
            >
              <div className="p-3 bg-primary-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-neutral-900 mb-1">
                  Transfer Langsung
                </h3>
                <p className="text-sm text-neutral-600">
                  Transfer dan upload bukti pembayaran
                </p>
              </div>
            </button>

            {/* Transfer + Meetup (Hybrid) */}
            <button
              onClick={() => setShowTransferOptions(false)}
              className="w-full flex items-start gap-4 p-4 border-2 border-neutral-200 hover:border-primary-300 rounded-xl transition-all"
            >
              <div className="p-3 bg-purple-100 rounded-lg">
                <HandshakeIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-neutral-900 mb-1">
                  Bayar Setelah Lihat Barang
                </h3>
                <p className="text-sm text-neutral-600">
                  Transfer setelah bertemu dan cek kondisi barang
                </p>
                <div className="bg-info-50 rounded-lg p-2 mt-2">
                  <p className="text-xs text-info-700">
                    💡 Cocok untuk laptop/HP second - bayar setelah yakin barang sesuai
                  </p>
                </div>
              </div>
            </button>

            {/* Show meetup terms if clicking hybrid option */}
            <div className="mt-4">
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-4">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-warning-800">
                    <p className="font-semibold mb-1">Catatan untuk opsi &ldquo;Bayar Setelah Lihat Barang&rdquo;:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Anda akan bertemu penjual terlebih dahulu</li>
                      <li>Periksa kondisi barang dengan teliti</li>
                      <li>Transfer pembayaran jika barang sesuai</li>
                      <li>Bisa batalkan jika barang tidak sesuai</li>
                    </ul>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">
                  Saya memahami proses pembayaran dengan opsi ini
                </span>
              </label>

              <Button
                onClick={() => handleTransferOptionSelect('meetup')}
                disabled={!agreeToTerms}
                className="w-full mt-4"
              >
                Lanjutkan dengan Opsi Ini
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
