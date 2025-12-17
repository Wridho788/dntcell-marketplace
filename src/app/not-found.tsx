import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan',
  description: 'Halaman yang Anda cari tidak ditemukan',
}

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-12 h-12 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900">
            404
          </h1>
          <h2 className="text-xl font-semibold text-neutral-900">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-neutral-600">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Halaman mungkin telah dipindahkan atau dihapus.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 bg-neutral-200 text-neutral-900 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
          >
            Lihat Produk
          </Link>
        </div>
      </div>
    </div>
  )
}
