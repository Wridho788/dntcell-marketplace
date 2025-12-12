'use client'

import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { EmptyState } from '@/components/ui/empty-state'
import { MessageSquare } from 'lucide-react'

export default function NegotiationsPage() {
  return (
    <AuthGuard>
      <MobileHeader title="Negosiasi Saya" />
      
      <div className="container-mobile py-6">
        <EmptyState
          icon={<MessageSquare className="w-12 h-12" />}
          title="Belum ada negosiasi"
          description="Negosiasi harga dengan penjual akan muncul di sini"
        />
        
        <div className="mt-6 bg-primary-50 rounded-2xl p-4 border border-primary-200">
          <h4 className="font-semibold text-primary-900 mb-2 leading-[1.4]">
            Cara Negosiasi
          </h4>
          <ol className="text-sm text-primary-800 space-y-1 list-decimal list-inside leading-[1.6]">
            <li>Pilih produk yang Anda inginkan</li>
            <li>Klik tombol &ldquo;Nego Harga&rdquo;</li>
            <li>Masukkan harga penawaran Anda</li>
            <li>Tunggu konfirmasi dari penjual</li>
          </ol>
        </div>
      </div>
    </AuthGuard>
  )
}
