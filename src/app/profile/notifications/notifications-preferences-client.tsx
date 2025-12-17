'use client'

import { useState, useEffect } from 'react'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Bell, Package, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react'

interface NotificationPreference {
  id: string
  label: string
  description: string
  enabled: boolean
  icon: React.ReactNode
}

export function NotificationPreferencesClient() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'order_updates',
      label: 'Update Pesanan',
      description: 'Notifikasi tentang status pesanan Anda',
      enabled: true,
      icon: <Package className="w-5 h-5" />
    },
    {
      id: 'negotiation_updates',
      label: 'Update Negosiasi',
      description: 'Notifikasi saat ada perubahan pada negosiasi',
      enabled: true,
      icon: <TrendingDown className="w-5 h-5" />
    },
    {
      id: 'system_messages',
      label: 'Pesan Sistem',
      description: 'Informasi penting dari DntCell Marketplace',
      enabled: true,
      icon: <Bell className="w-5 h-5" />
    }
  ])

  const [saved, setSaved] = useState(false)

  const togglePreference = (id: string) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    )
  }

  const handleSave = () => {
    // Save to local storage (backend placeholder)
    localStorage.setItem('notification_preferences', JSON.stringify(preferences))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem('notification_preferences')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPreferences(parsed)
      } catch {
        console.error('Failed to parse saved preferences')
      }
    }
  }, [])

  return (
    <AuthGuard>
      <MobileHeader title="Preferensi Notifikasi" showBack />

      <div className="container-mobile py-6 pb-32 space-y-4">
        {/* Info Banner */}
        <div className="bg-warning-50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-warning-700 font-medium mb-1">
              Fitur dalam Pengembangan
            </p>
            <p className="text-xs text-warning-600">
              Pengaturan notifikasi akan aktif secara bertahap. Saat ini Anda masih akan menerima semua notifikasi penting.
            </p>
          </div>
        </div>

        {/* Preferences List */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          {preferences.map((pref, index) => (
            <div key={pref.id}>
              <div className="p-4 flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    {pref.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-900 mb-0.5">
                      {pref.label}
                    </h4>
                    <p className="text-xs text-neutral-600">
                      {pref.description}
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => togglePreference(pref.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    pref.enabled ? 'bg-primary-600' : 'bg-neutral-200'
                  }`}
                  role="switch"
                  aria-checked={pref.enabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      pref.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {index < preferences.length - 1 && (
                <div className="h-px bg-neutral-200 mx-4" />
              )}
            </div>
          ))}
        </div>

        {/* Success Message */}
        {saved && (
          <div className="bg-success-50 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-success-600 shrink-0" />
            <p className="text-sm text-success-700 font-medium">
              Preferensi berhasil disimpan
            </p>
          </div>
        )}
      </div>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 safe-area-bottom z-40">
        <div className="container-mobile">
          <button
            onClick={handleSave}
            className="w-full py-3 px-4 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            Simpan Preferensi
          </button>
        </div>
      </div>
    </AuthGuard>
  )
}
