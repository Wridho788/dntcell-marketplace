'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OrdersPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to /orders
    router.replace('/orders')
  }, [router])

  return null
}
