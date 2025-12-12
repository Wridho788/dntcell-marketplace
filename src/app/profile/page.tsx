'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store/auth'
import { User, LogOut, Settings, Heart, MessageSquare, Package, MapPin, Phone, Mail, Edit } from 'lucide-react'
import Image from 'next/image'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    useAuthStore.persist.rehydrate()
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <AuthGuard>
      <MobileHeader title="Profil Saya" />
      
      <div className="container-mobile py-6 space-y-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <div className="flex items-center gap-4 mb-4">
            {user?.avatar_url ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden">
                <Image
                  src={user.avatar_url}
                  alt={user.name || 'User avatar'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary-600" />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="font-bold text-lg text-neutral-900 leading-[1.4]">
                {user?.name || 'User'}
              </h3>
              <p className="text-sm text-neutral-600 leading-[1.6]">
                Member sejak {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '-'}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/profile/edit')}
              aria-label="Edit Profile"
            >
              <Edit className="w-5 h-5" />
            </Button>
          </div>

          {/* Contact Info */}
          <div className="space-y-2.5 pt-4 border-t border-neutral-200">
            {user?.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-700 leading-[1.6]">{user.email}</span>
              </div>
            )}
            {user?.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-700 leading-[1.6]">{user.phone}</span>
              </div>
            )}
            {user?.address && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-700 leading-[1.6]">{user.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => router.push('/profile/favorites')}
            className="bg-white rounded-xl p-4 border border-neutral-200 hover:border-primary-300 transition-colors active:scale-[0.98]"
          >
            <div className="flex flex-col items-center gap-2">
              <Heart className="w-6 h-6 text-error-500" />
              <span className="text-2xl font-bold text-neutral-900">0</span>
              <span className="text-xs text-neutral-600 leading-[1.4]">Favorit</span>
            </div>
          </button>

          <button
            onClick={() => router.push('/profile/negotiations')}
            className="bg-white rounded-xl p-4 border border-neutral-200 hover:border-primary-300 transition-colors active:scale-[0.98]"
          >
            <div className="flex flex-col items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary-600" />
              <span className="text-2xl font-bold text-neutral-900">0</span>
              <span className="text-xs text-neutral-600 leading-[1.4]">Negosiasi</span>
            </div>
          </button>

          <button
            onClick={() => router.push('/profile/orders')}
            className="bg-white rounded-xl p-4 border border-neutral-200 hover:border-primary-300 transition-colors active:scale-[0.98]"
          >
            <div className="flex flex-col items-center gap-2">
              <Package className="w-6 h-6 text-success-600" />
              <span className="text-2xl font-bold text-neutral-900">0</span>
              <span className="text-xs text-neutral-600 leading-[1.4]">Pesanan</span>
            </div>
          </button>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <button
            onClick={() => router.push('/profile/edit')}
            className="w-full flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors active:bg-neutral-100"
          >
            <Settings className="w-5 h-5 text-neutral-600" />
            <span className="flex-1 text-left text-sm font-semibold text-neutral-900 leading-[1.4]">
              Pengaturan Akun
            </span>
          </button>

          <div className="h-px bg-neutral-200" />

          <button
            onClick={() => router.push('/profile/favorites')}
            className="w-full flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors active:bg-neutral-100"
          >
            <Heart className="w-5 h-5 text-neutral-600" />
            <span className="flex-1 text-left text-sm font-semibold text-neutral-900 leading-[1.4]">
              Daftar Favorit
            </span>
          </button>

          <div className="h-px bg-neutral-200" />

          <button
            onClick={() => router.push('/profile/negotiations')}
            className="w-full flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors active:bg-neutral-100"
          >
            <MessageSquare className="w-5 h-5 text-neutral-600" />
            <span className="flex-1 text-left text-sm font-semibold text-neutral-900 leading-[1.4]">
              Riwayat Negosiasi
            </span>
          </button>

          <div className="h-px bg-neutral-200" />

          <button
            onClick={() => router.push('/profile/orders')}
            className="w-full flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors active:bg-neutral-100"
          >
            <Package className="w-5 h-5 text-neutral-600" />
            <span className="flex-1 text-left text-sm font-semibold text-neutral-900 leading-[1.4]">
              Riwayat Pesanan
            </span>
          </button>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          fullWidth
          size="lg"
          icon={<LogOut className="w-5 h-5" />}
          onClick={() => setShowLogoutConfirm(true)}
        >
          Keluar
        </Button>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-neutral-900 mb-2 leading-[1.4]">
                Keluar dari Aplikasi?
              </h3>
              <p className="text-sm text-neutral-600 mb-6 leading-[1.6]">
                Anda akan keluar dari akun ini. Anda perlu login lagi untuk mengakses fitur tertentu.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  fullWidth
                  onClick={handleLogout}
                >
                  Keluar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
