'use client'

import { MobileHeader } from '@/components/navigation/mobile-header'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <>
      <MobileHeader title="Lupa Password" showBack />
      
      <div className="container-mobile py-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2 leading-[1.4]">
              Lupa Password?
            </h1>
            <p className="text-sm text-neutral-600 leading-[1.6]">
              Fitur reset password akan segera tersedia
            </p>
          </div>

          {/* Placeholder */}
          <div className="bg-neutral-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-neutral-700 text-center leading-[1.6]">
              Untuk saat ini, silakan hubungi admin untuk reset password Anda
            </p>
          </div>

          {/* Back to Login */}
          <Link href="/login">
            <Button fullWidth variant="primary">
              Kembali ke Login
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
