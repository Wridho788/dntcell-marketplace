'use client'

import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { EmptyState } from '@/components/ui/empty-state'
import { Package } from 'lucide-react'

export default function OrdersPage() {
  return (
    <AuthGuard>
      <MobileHeader title="Riwayat Pesanan" showBack />
      
      <div className="container-mobile py-6">
        <EmptyState
          icon={<Package className="w-12 h-12" />}
          title="Belum ada pesanan"
          description="Riwayat transaksi pembelian Anda akan muncul di sini"
        />
      </div>
    </AuthGuard>
  )
}
