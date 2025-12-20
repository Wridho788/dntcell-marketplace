'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { getProductById } from '@/services/product.service'
import { getNegotiationDetail } from '@/services/negotiation.service'
import { createOrder } from '@/services/order.service'
import type { PaymentMethod } from '@/services/order.service'
import { formatCurrency } from '@/lib/utils/format'
import { logUserAction } from '@/lib/utils/logger'
import type { Product } from '@/services/product.service'
import type { Negotiation } from '@/services/negotiation.service'
import { 
  Package, 
  MapPin, 
  CreditCard, 
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

export function CheckoutClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('product_id')
  const negotiationId = searchParams.get('negotiation_id')

  const [product, setProduct] = useState<Product | null>(null)
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postal_code: ''
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!productId) {
      setError('Product ID tidak ditemukan')
      setIsLoading(false)
      return
    }

    loadCheckoutData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, negotiationId])

  const loadCheckoutData = async () => {
    if (!productId) return

    try {
      setIsLoading(true)
      setError(null)

      // Load product
      const productData = await getProductById(productId)
      setProduct(productData)

      // Load negotiation if provided
      if (negotiationId) {
        const negoData = await getNegotiationDetail(negotiationId)
        
        // Validate negotiation
        if (negoData.product_id !== productId) {
          setError('Negosiasi tidak sesuai dengan produk')
          return
        }
        if (negoData.status !== 'approved') {
          setError('Negosiasi belum disetujui')
          return
        }
        if (negoData.used) {
          setError('Negosiasi sudah digunakan')
          return
        }
        
        setNegotiation(negoData)
      }

      logUserAction('checkout_viewed', {
        product_id: productId,
        negotiation_id: negotiationId,
        has_negotiation: !!negotiationId
      })
    } catch (err) {
      console.error('Failed to load checkout data:', err)
      setError('Gagal memuat data checkout')
    } finally {
      setIsLoading(false)
    }
  }

  const getFinalPrice = () => {
    if (negotiation?.final_price) {
      return negotiation.final_price
    }
    return product?.price || 0
  }

  const getDiscount = () => {
    if (negotiation?.final_price && product?.price) {
      return product.price - negotiation.final_price
    }
    return 0
  }

  const validateForm = () => {
    if (!shippingAddress.name.trim()) {
      alert('Nama penerima harus diisi')
      return false
    }
    if (!shippingAddress.phone.trim()) {
      alert('Nomor telepon harus diisi')
      return false
    }
    if (!shippingAddress.address.trim()) {
      alert('Alamat harus diisi')
      return false
    }
    if (!shippingAddress.city.trim()) {
      alert('Kota harus diisi')
      return false
    }
    if (!paymentMethod) {
      alert('Metode pembayaran harus dipilih')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm() || !product) return

    setShowConfirm(true)
  }

  const handleConfirmOrder = async () => {
    if (!product) return

    try {
      setIsSubmitting(true)
      setShowConfirm(false)

      const orderPayload = {
        product_id: product.id,
        negotiation_id: negotiationId || undefined,
        final_price: getFinalPrice(),
        payment_method: (paymentMethod === 'cod' ? 'meetup' : paymentMethod) as PaymentMethod,
        delivery_type: paymentMethod === 'cod' ? 'meetup' as const : undefined
      }

      const order = await createOrder(orderPayload)

      logUserAction('order_created', {
        order_id: order.id,
        product_id: product.id,
        negotiation_id: negotiationId,
        payment_method: paymentMethod,
        final_price: getFinalPrice()
      })

      // Redirect to order detail
      router.push(`/orders/${order.id}`)
    } catch (err: unknown) {
      console.error('Failed to create order:', err)
      
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } }
        if (error.response?.data?.message) {
          alert(error.response.data.message)
        } else {
          alert('Gagal membuat pesanan. Silakan coba lagi.')
        }
      } else {
        alert('Gagal membuat pesanan. Silakan coba lagi.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <MobileHeader title="Checkout" showBack />
        <LoadingState message="Memuat data checkout..." />
      </AuthGuard>
    )
  }

  if (error || !product) {
    return (
      <AuthGuard>
        <MobileHeader title="Checkout" showBack />
        <div className="container-mobile py-12">
          <ErrorState 
            message={error || 'Produk tidak ditemukan'}
            onRetry={loadCheckoutData}
          />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <MobileHeader title="Checkout" showBack />
      
      <div className="container-mobile py-4 pb-32">
        {/* Product Summary */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-neutral-600" />
            <h2 className="font-semibold text-neutral-900">Produk</h2>
          </div>
          
          <div className="flex gap-3">
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-neutral-200">
              <Image
                src={product.images[0] || '/images/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-neutral-900 mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-neutral-600 mb-2">
                Kondisi: {product.condition === 'new' ? 'Baru' : 'Bekas'}
              </p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
          <h2 className="font-semibold text-neutral-900 mb-3">Rincian Harga</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Harga Produk</span>
              <span className="text-neutral-900">{formatCurrency(product.price)}</span>
            </div>
            
            {negotiation && (
              <div className="flex justify-between text-sm">
                <span className="text-success-600">Diskon Negosiasi</span>
                <span className="text-success-600">-{formatCurrency(getDiscount())}</span>
              </div>
            )}
            
            <div className="border-t border-neutral-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-900">Total Pembayaran</span>
                <span className="font-bold text-primary-600 text-lg">
                  {formatCurrency(getFinalPrice())}
                </span>
              </div>
            </div>
          </div>

          {negotiation && (
            <div className="mt-3 p-2 bg-success-50 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
              <p className="text-xs text-success-700">
                Harga hasil negosiasi yang telah disetujui
              </p>
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-neutral-600" />
            <h2 className="font-semibold text-neutral-900">Alamat Pengiriman</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Nama Penerima <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                value={shippingAddress.name}
                onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nama lengkap penerima"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Nomor Telepon <span className="text-error-500">*</span>
              </label>
              <input
                type="tel"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Alamat Lengkap <span className="text-error-500">*</span>
              </label>
              <textarea
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                placeholder="Jalan, nomor rumah, RT/RW, Kelurahan, Kecamatan"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Kota <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Nama kota"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Kode Pos
                </label>
                <input
                  type="text"
                  value={shippingAddress.postal_code}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="12345"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Provinsi
              </label>
              <input
                type="text"
                value={shippingAddress.province}
                onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nama provinsi"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-neutral-600" />
            <h2 className="font-semibold text-neutral-900">Metode Pembayaran</h2>
          </div>

          <div className="space-y-2">
            <label className="flex items-center p-3 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div className="ml-3 flex-1">
                <p className="font-medium text-neutral-900">COD (Bayar di Tempat)</p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Bayar langsung saat barang diterima
                </p>
              </div>
            </label>

            <label className="flex items-center p-3 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
              <input
                type="radio"
                name="payment"
                value="transfer"
                checked={paymentMethod === 'transfer'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div className="ml-3 flex-1">
                <p className="font-medium text-neutral-900">Transfer Bank</p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Pembayaran akan dikonfirmasi admin
                </p>
              </div>
            </label>

            <label className="flex items-center p-3 border-2 border-neutral-200 rounded-lg cursor-not-allowed opacity-50">
              <input
                type="radio"
                name="payment"
                value="ewallet"
                disabled
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div className="ml-3 flex-1">
                <p className="font-medium text-neutral-900">E-Wallet</p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Segera hadir
                </p>
              </div>
            </label>
          </div>

          <div className="mt-3 p-3 bg-warning-50 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-warning-600 shrink-0 mt-0.5" />
            <p className="text-xs text-warning-700">
              Pembayaran akan dikonfirmasi oleh admin. Anda akan menerima notifikasi setelah pembayaran diverifikasi.
            </p>
          </div>
        </div>

        {/* Optional Notes */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-neutral-600" />
            <h2 className="font-semibold text-neutral-900">Catatan (Opsional)</h2>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="Tambahkan catatan untuk penjual (opsional)"
            maxLength={200}
          />
          <p className="text-xs text-neutral-500 mt-1">
            {notes.length}/200 karakter
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 safe-area-bottom z-40">
        <div className="container-mobile">
          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Memproses...' : `Buat Pesanan - ${formatCurrency(getFinalPrice())}`}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Konfirmasi Pesanan
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Pastikan semua data sudah benar sebelum membuat pesanan. Pesanan yang sudah dibuat tidak dapat diubah.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
              >
                Cek Lagi
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Memproses...' : 'Ya, Buat Pesanan'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  )
}
