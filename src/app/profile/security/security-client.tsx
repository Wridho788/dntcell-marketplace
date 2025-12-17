'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Button } from '@/components/ui/button'
import { Smartphone, LogOut, Key, AlertCircle } from 'lucide-react'

export function SecurityClient() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [showLogoutAllConfirm, setShowLogoutAllConfirm] = useState(false)

  const handleLogoutAll = () => {
    logout()
    router.push('/login')
  }

  return (
    <AuthGuard>
      <MobileHeader title="Keamanan & Sesi" showBack />

      <div className="container-mobile py-6 pb-24 space-y-4">
        {/* Current Session Info */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Sesi Saat Ini</h3>
              <p className="text-xs text-neutral-600">Perangkat Anda saat ini</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Status</span>
              <span className="text-success-600 font-medium">Aktif</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Email</span>
              <span className="text-neutral-900 font-medium">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Security Actions */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-900">Keamanan Akun</h3>
          </div>

          <button
            onClick={() => alert('Fitur ganti password akan segera aktif')}
            className="w-full flex items-center justify-between p-4 border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-neutral-600" />
              <div className="text-left">
                <p className="font-medium text-neutral-900">Ganti Password</p>
                <p className="text-xs text-neutral-600">Perbarui password akun Anda</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowLogoutAllConfirm(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-error-600" />
              <div className="text-left">
                <p className="font-medium text-neutral-900">Keluar dari Semua Perangkat</p>
                <p className="text-xs text-neutral-600">Paksa logout di semua sesi aktif</p>
              </div>
            </div>
          </button>
        </div>

        {/* Security Tips */}
        <div className="bg-info-50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-info-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-info-700 font-medium mb-2">Tips Keamanan</p>
            <ul className="text-xs text-info-600 space-y-1">
              <li>• Gunakan password yang kuat dan unik</li>
              <li>• Jangan bagikan password dengan siapa pun</li>
              <li>• Logout jika menggunakan perangkat umum</li>
              <li>• Perbarui password secara berkala</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Logout All Confirmation */}
      {showLogoutAllConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Keluar dari Semua Perangkat?
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Anda akan keluar dari semua sesi aktif dan perlu login kembali di setiap perangkat.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowLogoutAllConfirm(false)}
              >
                Batal
              </Button>
              <Button
                className="flex-1 bg-error-500 hover:bg-error-600"
                onClick={handleLogoutAll}
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
