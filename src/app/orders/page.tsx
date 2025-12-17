import { Metadata } from 'next'
import { OrdersListClient } from './orders-list-client'

export const metadata: Metadata = {
  title: 'Pesanan Saya | DNTCell Marketplace',
  description: 'Daftar pesanan dan status',
}

export default function OrdersPage() {
  return <OrdersListClient />
}
