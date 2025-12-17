import { Metadata } from 'next'
import { NegotiationsListClient } from './negotiations-list-client'

export const metadata: Metadata = {
  title: 'Negosiasi Saya',
  description: 'Kelola dan lihat status negosiasi harga produk Anda',
}

export default function NegotiationsPage() {
  return <NegotiationsListClient />
}
