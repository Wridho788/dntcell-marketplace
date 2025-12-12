'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store/auth'
import { register } from '@/lib/api/auth'
import { useToast } from '@/components/ui/toast'
import { User, Phone, Lock, Mail } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const { showToast } = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Format email tidak valid'
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor HP harus diisi'
    } else {
      const phoneRegex = /^[0-9]{10,13}$/
      if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Nomor HP harus 10-13 digit'
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim().replace(/\D/g, ''),
        password: formData.password
      }

      const { user, token } = await register(payload)
      
      // Auto login after successful registration
      login(user, token)
      
      showToast('Akun berhasil dibuat!', 'success')

      // Redirect to home
      router.push('/')
    } catch (error) {
      const err = error as Error
      showToast(err.message || 'Gagal mendaftar. Silakan coba lagi.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <MobileHeader title="Daftar Akun" showBack />
      
      <div className="container-mobile py-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2 leading-[1.4]">
              Buat Akun Baru
            </h1>
            <p className="text-sm text-neutral-600 leading-[1.6]">
              Daftar untuk mulai berbelanja di DNTCell
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-neutral-900 mb-2 leading-[1.4]">
                Nama Lengkap
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-900 mb-2 leading-[1.4]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="Minimal 6 karakter"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-error-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
              className='text-black'
            >
              Daftar
            </Button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600 leading-[1.6]">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
