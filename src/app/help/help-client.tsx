'use client'

import { useState } from 'react'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { Button } from '@/components/ui/button'
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Mail, 
  FileText,
  ShoppingBag,
  TrendingDown,
  CreditCard
} from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export function HelpClient() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      category: 'Negosiasi',
      question: 'Bagaimana cara negosiasi harga?',
      answer: 'Klik tombol "Tawar Harga" pada produk yang Anda inginkan. Masukkan harga yang Anda tawarkan, tambahkan catatan jika perlu, lalu kirim. Penjual akan meninjau dan merespons penawaran Anda.'
    },
    {
      category: 'Negosiasi',
      question: 'Berapa lama penjual merespons negosiasi?',
      answer: 'Penjual biasanya merespons dalam 1-3 hari kerja. Anda akan menerima notifikasi ketika penjual sudah merespons penawaran Anda.'
    },
    {
      category: 'Negosiasi',
      question: 'Apakah semua produk bisa dinegosiasi?',
      answer: 'Tidak semua produk dapat dinegosiasi. Produk yang dapat dinegosiasi akan menampilkan tombol "Tawar Harga". Penjual menentukan apakah produk mereka dapat dinegosiasi atau tidak.'
    },
    {
      category: 'Pesanan',
      question: 'Bagaimana cara melakukan pemesanan?',
      answer: 'Setelah negosiasi disetujui atau jika Anda setuju dengan harga yang ditampilkan, klik "Beli Sekarang". Isi informasi pengiriman, pilih metode pembayaran, lalu konfirmasi pesanan Anda.'
    },
    {
      category: 'Pesanan',
      question: 'Apa yang terjadi setelah saya membuat pesanan?',
      answer: 'Pesanan Anda akan menunggu konfirmasi dari admin. Setelah dikonfirmasi, pesanan akan diproses, dikemas, dan dikirim. Anda dapat memantau status pesanan di halaman "Pesanan Saya".'
    },
    {
      category: 'Pesanan',
      question: 'Bagaimana cara membatalkan pesanan?',
      answer: 'Anda hanya dapat membatalkan pesanan yang masih berstatus "Menunggu Konfirmasi". Buka detail pesanan, lalu klik tombol "Batalkan Pesanan". Setelah pesanan dikonfirmasi, pembatalan harus dikoordinasikan dengan admin.'
    },
    {
      category: 'Pembayaran',
      question: 'Metode pembayaran apa saja yang tersedia?',
      answer: 'Saat ini kami menyediakan COD (Cash on Delivery), Transfer Bank, dan E-wallet. Semua pembayaran perlu dikonfirmasi oleh admin sebelum pesanan diproses.'
    },
    {
      category: 'Pembayaran',
      question: 'Kapan saya harus membayar?',
      answer: 'Untuk COD, Anda membayar saat barang diterima. Untuk Transfer Bank, Anda perlu transfer setelah pesanan dikonfirmasi admin. Instruksi detail akan diberikan setelah konfirmasi pesanan.'
    },
    {
      category: 'Akun',
      question: 'Bagaimana cara mengubah informasi profil?',
      answer: 'Buka halaman Profil, klik "Edit Profil", lalu ubah informasi yang diperlukan seperti nama, nomor telepon, atau bio. Klik "Simpan Perubahan" setelah selesai.'
    },
    {
      category: 'Akun',
      question: 'Apakah email saya bisa diubah?',
      answer: 'Untuk keamanan akun, email tidak dapat diubah. Jika Anda perlu mengubah email, silakan hubungi tim dukungan kami.'
    }
  ]

  const toggleExpand = (index: number) => {
    setExpandedId(expandedId === index ? null : index)
  }

  const groupedFAQs = faqs.reduce((acc, faq, index) => {
    if (!acc[faq.category]) {
      acc[faq.category] = []
    }
    acc[faq.category].push({ ...faq, index })
    return acc
  }, {} as Record<string, (FAQItem & { index: number })[]>)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Negosiasi':
        return <TrendingDown className="w-5 h-5 text-primary-600" />
      case 'Pesanan':
        return <ShoppingBag className="w-5 h-5 text-success-600" />
      case 'Pembayaran':
        return <CreditCard className="w-5 h-5 text-warning-600" />
      case 'Akun':
        return <HelpCircle className="w-5 h-5 text-info-600" />
      default:
        return <FileText className="w-5 h-5 text-neutral-600" />
    }
  }

  return (
    <div>
      <MobileHeader title="Bantuan & Dukungan" showBack />

      <div className="container-mobile py-6 pb-24 space-y-6">
        {/* Header */}
        <div className="bg-linear-to-br from-primary-500 to-primary-600 rounded-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Butuh Bantuan?</h2>
              <p className="text-sm text-primary-100">Kami siap membantu Anda</p>
            </div>
          </div>
        </div>

        {/* Quick Contact */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => alert('Fitur chat support akan segera aktif')}
            className="bg-white rounded-lg border border-neutral-200 p-4 hover:border-primary-300 transition-colors"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-neutral-900">Live Chat</span>
              <span className="text-xs text-neutral-600">Chat langsung</span>
            </div>
          </button>

          <button 
            onClick={() => window.location.href = 'mailto:support@dntcell.com'}
            className="bg-white rounded-lg border border-neutral-200 p-4 hover:border-primary-300 transition-colors"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-success-600" />
              </div>
              <span className="text-sm font-medium text-neutral-900">Email</span>
              <span className="text-xs text-neutral-600">Kirim email</span>
            </div>
          </button>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-neutral-900">Pertanyaan Umum</h3>

          {Object.entries(groupedFAQs).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                {getCategoryIcon(category)}
                <h4 className="font-semibold text-neutral-900">{category}</h4>
              </div>

              <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                {items.map((faq, idx) => (
                  <div key={faq.index}>
                    <button
                      onClick={() => toggleExpand(faq.index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
                    >
                      <span className="font-medium text-neutral-900 pr-4">
                        {faq.question}
                      </span>
                      {expandedId === faq.index ? (
                        <ChevronUp className="w-5 h-5 text-neutral-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-600 shrink-0" />
                      )}
                    </button>

                    {expandedId === faq.index && (
                      <div className="px-4 pb-4 border-t border-neutral-200 pt-4">
                        <p className="text-sm text-neutral-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}

                    {idx < items.length - 1 && <div className="h-px bg-neutral-200" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legal Links */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <button 
            onClick={() => alert('Halaman Syarat & Ketentuan akan segera tersedia')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <span className="text-sm font-medium text-neutral-900">Syarat & Ketentuan</span>
            <ChevronDown className="w-5 h-5 text-neutral-400 -rotate-90" />
          </button>

          <div className="h-px bg-neutral-200" />

          <button 
            onClick={() => alert('Halaman Kebijakan Privasi akan segera tersedia')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <span className="text-sm font-medium text-neutral-900">Kebijakan Privasi</span>
            <ChevronDown className="w-5 h-5 text-neutral-400 -rotate-90" />
          </button>
        </div>

        {/* Still Need Help */}
        <div className="bg-neutral-50 rounded-lg p-6 text-center">
          <p className="text-sm text-neutral-700 mb-4">
            Masih butuh bantuan?
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.href = 'mailto:support@dntcell.com'}
          >
            <Mail className="w-4 h-4 mr-2" />
            Hubungi Kami
          </Button>
        </div>
      </div>
    </div>
  )
}
