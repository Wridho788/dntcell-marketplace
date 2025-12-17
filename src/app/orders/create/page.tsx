import { Suspense } from 'react'
import { CreateOrderClient } from './create-order-client'

export default function CreateOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CreateOrderClient />
    </Suspense>
  )
}
