import { Metadata } from 'next'
import { OrderDetailClient } from './order-detail-client'

export const metadata: Metadata = {
  title: 'Detail Pesanan | DNTCell Marketplace',
  description: 'Detail pesanan dan status pengiriman',
}

interface PageProps {
  params: {
    id: string
  }
}

export default function OrderDetailPage({ params }: PageProps) {
  return <OrderDetailClient orderId={params.id} />
}
