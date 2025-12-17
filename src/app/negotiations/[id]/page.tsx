import { Metadata } from 'next'
import { NegotiationDetailClient } from './negotiation-detail-client'

export const metadata: Metadata = {
  title: 'Detail Negosiasi',
  description: 'Lihat detail dan status negosiasi harga produk',
}

interface NegotiationDetailProps {
  params: {
    id: string
  }
}

export default function NegotiationDetailPage({ params }: NegotiationDetailProps) {
  return <NegotiationDetailClient negotiationId={params.id} />
}
