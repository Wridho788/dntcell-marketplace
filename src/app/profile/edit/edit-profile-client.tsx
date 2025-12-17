'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile, updateProfile, Profile, UpdateProfilePayload } from '@/services/profile.service'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import { logUserAction } from '@/lib/utils/logger'

export function EditProfileClient() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Form state
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getProfile()
      setProfile(data)
      
      // Populate form
      setFullName(data.full_name || '')
      setPhone(data.phone || '')
      setBio(data.bio || '')
    } catch (err) {
      console.error('Failed to load profile:', err)
      setError('Gagal memuat data profil')
    } finally {
      setIsLoading(false)
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi'
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Nama lengkap minimal 3 karakter'
    }

    if (phone && !/^[0-9+\-() ]+$/.test(phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid'
    }

    if (bio && bio.length > 200) {
      newErrors.bio = 'Bio maksimal 200 karakter'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) {
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const payload: UpdateProfilePayload = {
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
        bio: bio.trim() || undefined
      }

      await updateProfile(payload)

      logUserAction('profile_updated', {
        fields: Object.keys(payload)
      })

      setSaveSuccess(true)

      // Show success briefly then redirect
      setTimeout(() => {
        router.push('/profile')
      }, 1500)
    } catch (err) {
      console.error('Failed to update profile:', err)
      setError('Gagal menyimpan perubahan. Silakan coba lagi.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <MobileHeader title="Edit Profil" showBack />
        <LoadingState message="Memuat data profil..." />
      </AuthGuard>
    )
  }

  if (error && !profile) {
    return (
      <AuthGuard>
        <MobileHeader title="Edit Profil" showBack />
        <div className="container-mobile py-12">
          <ErrorState message={error} onRetry={loadProfile} />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <MobileHeader title="Edit Profil" showBack />

      <div className="container-mobile py-6 pb-32">
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-neutral-900 mb-2">
                Nama Lengkap <span className="text-error-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.fullName ? 'border-error-500' : 'border-neutral-300'
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="Masukkan nama lengkap Anda"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-900 mb-2">
                Nomor Telepon
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.phone ? 'border-error-500' : 'border-neutral-300'
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="Contoh: +62812345678 (opsional)"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
              <p className="mt-1 text-xs text-neutral-600">
                Nomor telepon akan digunakan untuk komunikasi terkait pesanan
              </p>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={profile?.user_id || ''}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-neutral-600">
                Email tidak dapat diubah untuk keamanan akun Anda
              </p>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-neutral-900 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={200}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.bio ? 'border-error-500' : 'border-neutral-300'
                } focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none`}
                placeholder="Ceritakan sedikit tentang Anda (opsional)"
              />
              <div className="mt-1 flex justify-between items-center">
                <p className="text-xs text-neutral-600">
                  Bio singkat akan ditampilkan di profil publik Anda
                </p>
                <span className="text-xs text-neutral-500">
                  {bio.length}/200
                </span>
              </div>
              {errors.bio && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.bio}
                </p>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-info-50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-info-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-info-700 font-medium mb-1">
                Informasi Penting
              </p>
              <p className="text-xs text-info-600">
                Pastikan data yang Anda masukkan akurat. Informasi ini akan digunakan untuk keperluan transaksi dan komunikasi.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-error-50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error-600 shrink-0" />
            <p className="text-sm text-error-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {saveSuccess && (
          <div className="mt-4 p-4 bg-success-50 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success-600 shrink-0" />
            <p className="text-sm text-success-700">
              Profil berhasil diperbarui! Mengalihkan...
            </p>
          </div>
        )}
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 safe-area-bottom z-40">
        <div className="container-mobile">
          <Button
            size="lg"
            className="w-full"
            onClick={handleSave}
            disabled={isSaving || saveSuccess}
          >
            {isSaving ? (
              'Menyimpan...'
            ) : saveSuccess ? (
              'Berhasil!'
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </div>
    </AuthGuard>
  )
}
