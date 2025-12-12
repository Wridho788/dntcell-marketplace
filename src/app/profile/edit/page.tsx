'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store/auth'
import { updateProfile, uploadAvatar } from '@/lib/api/auth'
import { useToast } from '@/components/ui/toast'
import { User, Mail, Phone, MapPin, Camera, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, updateUser } = useAuthStore()
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    useAuthStore.persist.rehydrate()
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran file maksimal 2MB', 'error')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('File harus berupa gambar (JPG/PNG)', 'error')
      return
    }

    setAvatarFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (formData.phone && !/^[0-9]{10,13}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Nomor HP harus 10-13 digit'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user) return

    setLoading(true)
    try {
      let avatarUrl = user.avatar_url

      // Upload avatar if changed
      if (avatarFile) {
        setUploadingAvatar(true)
        avatarUrl = await uploadAvatar(avatarFile)
        setUploadingAvatar(false)
      }

      // Update profile
      const updatedUser = await updateProfile(user.id, {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim().replace(/\D/g, '') || undefined,
        address: formData.address.trim() || undefined,
        avatar_url: avatarUrl
      })

      updateUser(updatedUser)
      
      showToast('Profil berhasil diperbarui!', 'success')

      router.push('/profile')
    } catch (error) {
      const err = error as Error
      showToast(err.message || 'Gagal memperbarui profil', 'error')
    } finally {
      setLoading(false)
      setUploadingAvatar(false)
    }
  }

  return (
    <AuthGuard>
      <MobileHeader title="Edit Profil" showBack />
      
      <div className="container-mobile py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {avatarPreview ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src={avatarPreview}
                    alt="Avatar Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-primary-600" />
                </div>
              )}
              
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors"
                disabled={uploadingAvatar}
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <p className="text-xs text-neutral-600 text-center leading-[1.6]">
              Format: JPG/PNG. Maksimal 2MB.<br />
              Gambar akan dikompres otomatis.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-neutral-900 mb-2 leading-[1.4]">
                Nama Lengkap <span className="text-error-600">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-error-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-900 mb-2 leading-[1.4]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="nama@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-error-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-neutral-900 mb-2 leading-[1.4]">
                Nomor HP
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="08123456789"
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-xs text-error-600">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-neutral-900 mb-2 leading-[1.4]">
                Alamat
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-neutral-400" />
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => router.back()}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              fullWidth
              loading={loading || uploadingAvatar}
              disabled={loading || uploadingAvatar}
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </AuthGuard>
  )
}
