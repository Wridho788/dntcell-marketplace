'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { Button } from '@/components/ui/button'
import { getProductById } from '@/services/product.service'
import type { Product } from '@/services/product.service'
import { AlertCircle, CheckCircle2, Copy, CreditCard, HandshakeIcon } from 'lucide-react'
import Image from 'next/image'

type PaymentMethod = 'cod' | 'bank_transfer'

export function CreateOrderClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const productId = searchParams.get('product_id')
  const paymentMethod = searchParams.get('payment_method') as PaymentMethod
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Bank details (dummy)
  const bankDetails = {
    bankName: 'Bank Mandiri',
    accountNumber: '1370013456789',
    accountName: 'DNTCell Store'
  }

  useEffect(() => {
    if (!productId || !paymentMethod) {
      setError('Parameter tidak valid')
      setLoading(false)
      return
    }

    if (!['cod', 'bank_transfer'].includes(paymentMethod)) {
      setError('Metode pembayaran tidak valid')
      setLoading(false)
      return
    }

    // Fetch product details
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await getProductById(productId)
        
        // Check if product is available
        if (data.status !== 'available') {
          if (data.status === 'sold') {
            setError('Produk ini sudah terjual')
          } else {
            setError('Produk ini tidak tersedia saat ini')
          }
          setProduct(null)
        } else {
          setProduct(data)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Gagal memuat produk')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId, paymentMethod])

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirmOrder = () => {
    // TODO: Create order in database
    alert('Fitur konfirmasi pesanan akan segera hadir!')
    router.push('/orders')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <MobileHeader title="Buat Pesanan" showBack />
        <div className="container-mobile py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
            <p className="text-neutral-600">Memuat...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <MobileHeader title="Buat Pesanan" showBack />
        <div className="container-mobile py-8">
          <div className="bg-white rounded-xl p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-error-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">
                {error || 'Produk Tidak Ditemukan'}
              </h2>
              <p className="text-neutral-600">
                {error === 'Produk ini sudah terjual' 
                  ? 'Mohon maaf, produk ini sudah dibeli oleh pembeli lain.'
                  : error === 'Produk ini tidak tersedia saat ini'
                  ? 'Mohon maaf, produk ini sedang tidak tersedia untuk dibeli.'
                  : 'Silakan kembali dan coba lagi.'}
              </p>
            </div>
            <Button onClick={() => router.push('/products')} className="w-full">
              Lihat Produk Lain
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <MobileHeader title="Buat Pesanan" showBack />
      
      <main className="container-mobile py-6 space-y-6">
        {/* Product Info */}
        <section className="bg-white rounded-xl p-4 space-y-4">
          <h2 className="font-semibold text-neutral-900">Detail Produk</h2>
          
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="relative w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <span className="text-4xl">📦</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-neutral-600 mb-2">
                Kondisi: <span className="font-medium">{product.condition === 'new' ? 'Baru' : 'Bekas'}</span>
              </p>
              <p className="text-lg font-bold text-primary-600">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="bg-white rounded-xl p-4 space-y-4">
          <h2 className="font-semibold text-neutral-900">Metode Pembayaran</h2>
          
          {paymentMethod === 'cod' ? (
            <div className="flex gap-3 items-start p-4 bg-success-50 border border-success-200 rounded-lg">
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center shrink-0">
                <HandshakeIcon className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <p className="font-semibold text-success-900 mb-1">
                  Cash on Delivery (COD)
                </p>
                <p className="text-sm text-success-800">
                  Bayar langsung saat barang diterima. Pastikan Anda menyiapkan uang pas.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-3 items-start p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-primary-900 mb-1">
                    Transfer Bank
                  </p>
                  <p className="text-sm text-primary-800">
                    Transfer ke rekening Bank Mandiri di bawah ini
                  </p>
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Bank</span>
                  <span className="font-semibold text-neutral-900">{bankDetails.bankName}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Nama Penerima</span>
                  <span className="font-semibold text-neutral-900">{bankDetails.accountName}</span>
                </div>
                
                <div className="pt-3 border-t border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-2">Nomor Rekening</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-3 bg-white border border-neutral-300 rounded-lg font-mono text-lg font-bold text-neutral-900">
                      {bankDetails.accountNumber}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyAccountNumber}
                      className="shrink-0"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1 text-success-600" />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Salin
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Transfer Instructions */}
              <div className="bg-info-50 border border-info-200 rounded-lg p-4">
                <h3 className="font-semibold text-info-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Instruksi Transfer
                </h3>
                <ol className="text-sm text-info-800 space-y-1.5 list-decimal list-inside">
                  <li>Transfer sesuai dengan nominal harga produk</li>
                  <li>Simpan bukti transfer Anda</li>
                  <li>Konfirmasi pembayaran dengan menghubungi penjual</li>
                  <li>Pesanan akan diproses setelah pembayaran dikonfirmasi</li>
                </ol>
              </div>
            </div>
          )}
        </section>

        {/* Order Summary */}
        <section className="bg-white rounded-xl p-4 space-y-3">
          <h2 className="font-semibold text-neutral-900">Ringkasan Pesanan</h2>
          
          <div className="space-y-2 py-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span className="text-neutral-900">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Ongkos Kirim</span>
              <span className="text-neutral-900">Akan dihitung</span>
            </div>
            
            <div className="pt-3 border-t border-neutral-200">
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-900">Total</span>
                <span className="text-xl font-bold text-primary-600">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 safe-area-bottom z-40">
        <div className="container-mobile">
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleConfirmOrder}
          >
            Konfirmasi Pesanan
          </Button>
        </div>
      </div>
    </div>
  )
}
