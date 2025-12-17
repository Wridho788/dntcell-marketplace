import { Metadata } from 'next'
import { NotificationsClient } from './notifications-client'

export const metadata: Metadata = {
  title: 'Notifikasi | DNTCell Marketplace',
  description: 'Notifikasi pesanan dan negosiasi',
}

export default function NotificationsPage() {
  return <NotificationsClient />
}
