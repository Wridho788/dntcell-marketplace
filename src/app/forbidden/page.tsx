import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Akses Ditolak',
  description: 'Anda tidak memiliki izin untuk mengakses halaman ini',
}

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900">
            403
          </h1>
          <h2 className="text-xl font-semibold text-neutral-900">
            Akses Ditolak
          </h2>
          <p className="text-neutral-600">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. 
            Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
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
            href="/profile"
            className="px-6 py-3 bg-neutral-200 text-neutral-900 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
          >
            Ke Profil
          </Link>
        </div>
      </div>
    </div>
  )
}
