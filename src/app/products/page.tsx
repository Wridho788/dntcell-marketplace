import { Metadata } from 'next'
import { ProductListClient } from './products-list-client'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Semua Produk',
  description: 'Jelajahi koleksi lengkap HP dan Laptop second berkualitas dengan harga terbaik. Kondisi terjamin, bisa nego.',
  keywords: 'hp bekas, laptop second, jual hp bekas, beli laptop bekas, hp second berkualitas',
  url: '/products'
})

// ISR: Revalidate every 1 minute
export const revalidate = 60

export default function ProductsPage() {
  return <ProductListClient />
}
