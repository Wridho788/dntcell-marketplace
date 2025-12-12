'use client'

import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { EmptyState } from '@/components/ui/empty-state'
import { MessageSquare } from 'lucide-react'

export default function NegotiationsPage() {
  return (
    <AuthGuard>
      <MobileHeader title="Riwayat Negosiasi" showBack />
      
      <div className="container-mobile py-6">
        <EmptyState
          icon={<MessageSquare className="w-12 h-12" />}
          title="Belum ada negosiasi"
          description="Riwayat negosiasi dengan penjual akan muncul di sini"
        />
      </div>
    </AuthGuard>
  )
}
