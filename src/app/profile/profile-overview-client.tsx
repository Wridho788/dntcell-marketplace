'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'
import { getProfile, Profile } from '@/services/profile.service'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Package,
  ShoppingBag,
  Bell,
  Shield,
  Activity,
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react'
import { formatDate } from '@/lib/utils/date'

export function ProfileOverviewClient() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getProfile()
      setProfile(data)
    } catch (err) {
      console.error('Failed to load profile:', err)
      setError('Gagal memuat profil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U'
  }

  const getRoleBadge = () => {
    // For now, default to 'Buyer' - will be enhanced with seller role later
    return 'Buyer'
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <MobileHeader title="Profil Saya" />
        <LoadingState message="Memuat profil..." />
      </AuthGuard>
    )
  }

  if (error) {
    return (
      <AuthGuard>
        <MobileHeader title="Profil Saya" />
        <div className="container-mobile py-12">
          <ErrorState message={error} onRetry={loadProfile} />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <MobileHeader title="Profil Saya" />

      <div className="container-mobile py-6 pb-24 space-y-4">
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              {profile?.avatar_url ? (
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-500">
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'User'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-500">
                  <span className="text-2xl font-bold text-primary-700">
                    {getInitials()}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-neutral-900 mb-1">
                {profile?.full_name || 'Nama Belum Diatur'}
              </h2>
              
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 mb-3">
                {getRoleBadge()}
              </div>

              <div className="space-y-2 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user?.email}</span>
                </div>

                {profile?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}

                {profile?.created_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Bergabung {formatDate(profile.created_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => router.push('/profile/edit')}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profil
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-900">Aktivitas Saya</h3>
          </div>

          <button
            onClick={() => router.push('/orders')}
            className="w-full flex items-center justify-between p-4 border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-neutral-900">Pesanan Saya</p>
                <p className="text-xs text-neutral-600">Lihat semua pesanan</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </button>

          <button
            onClick={() => router.push('/profile/favorites')}
            className="w-full flex items-center justify-between p-4 border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-error-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-error-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-neutral-900">Produk Favorit</p>
                <p className="text-xs text-neutral-600">Koleksi produk kesukaan</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </button>

          <button
            onClick={() => router.push('/negotiations')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-warning-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-neutral-900">Negosiasi</p>
                <p className="text-xs text-neutral-600">Riwayat negosiasi harga</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Settings & Account */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-900">Pengaturan Akun</h3>
          </div>

          <button
            onClick={() => router.push('/profile/addresses')}
            className="w-full flex items-center justify-between p-4 border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-neutral-600" />
              <span className="font-medium text-neutral-900">Alamat Pengiriman</span>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </button>

          <button
            onClick={() => router.push('/profile/security')}
            className="w-full flex items-center justify-between p-4 border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-neutral-600" />
              <span className="font-medium text-neutral-900">Keamanan & Sesi</span>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </button>

          <button
            onClick={() => router.push('/profile/notifications')}
            className="w-full flex items-center justify-between p-4 border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-neutral-600" />
              <span className="font-medium text-neutral-900">Preferensi Notifikasi</span>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </button>

          <button
            onClick={() => router.push('/profile/activity')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-neutral-600" />
              <span className="font-medium text-neutral-900">Aktivitas & Riwayat</span>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Help & Support */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <button
            onClick={() => router.push('/help')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-neutral-600" />
              <span className="font-medium text-neutral-900">Bantuan & Dukungan</span>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-lg border border-error-200 text-error-600 hover:bg-error-50 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Keluar dari Akun?
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Anda akan keluar dari sesi saat ini. Data yang tersimpan akan tetap aman.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Batal
              </Button>
              <Button
                className="flex-1 bg-error-500 hover:bg-error-600"
                onClick={handleLogout}
              >
                Ya, Keluar
              </Button>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  )
}
