'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store/auth'
import { login } from '@/lib/api/auth'
import { useToast } from '@/components/ui/toast'
import { Mail, Lock } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login: setAuth, isLoggedIn } = useAuthStore()
  const { showToast } = useToast()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      const redirect = searchParams.get('redirect') || '/'
      router.push(redirect)
    }
  }, [isLoggedIn, router, searchParams])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Format email tidak valid'
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const { user, token } = await login({
        email: formData.email.trim(),
        password: formData.password
      })
      
      setAuth(user, token)
      
      showToast(`Selamat datang, ${user.name}!`, 'success')

      // Redirect to previous page or home
      const redirect = searchParams.get('redirect') || '/'
      router.push(redirect)
    } catch (error) {
      const err = error as Error
      showToast(err.message || 'Gagal login. Silakan coba lagi.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <MobileHeader title="Masuk" showBack />
      
      <div className="container-mobile py-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2 leading-[1.4]">
              Masuk ke Akun
            </h1>
            <p className="text-sm text-neutral-600 leading-[1.6]">
              Masuk untuk melanjutkan belanja di DNTCell
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-error-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-neutral-900 leading-[1.4]">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-primary-600 font-semibold hover:text-primary-700"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="Masukkan password"
                  autoComplete="current-password"
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
              Masuk
            </Button>
          </form>

          {/* Link to Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600 leading-[1.6]">
              Belum punya akun?{' '}
              <Link href="/register" className="text-primary-600 font-semibold hover:text-primary-700">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
