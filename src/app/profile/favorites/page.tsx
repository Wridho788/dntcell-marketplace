'use client'

import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { EmptyState } from '@/components/ui/empty-state'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <MobileHeader title="Daftar Favorit" showBack />
      
      <div className="container-mobile py-6">
        <EmptyState
          icon={<Heart className="w-12 h-12" />}
          title="Belum ada favorit"
          description="Produk yang Anda tambahkan ke favorit akan muncul di sini"
        />
      </div>
    </AuthGuard>
  )
}
