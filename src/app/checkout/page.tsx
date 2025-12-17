import { Metadata } from 'next'
import { CheckoutClient } from './checkout-client'

export const metadata: Metadata = {
  title: 'Checkout | DNTCell Marketplace',
  description: 'Checkout dan buat pesanan',
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
