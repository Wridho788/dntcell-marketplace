/**
 * OneSignal Notification Service
 * Helper functions to send push notifications via OneSignal REST API
 */

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID || ''
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY || ''
const ONESIGNAL_REST_API_URL = 'https://onesignal.com/api/v1/notifications'

interface NotificationPayload {
  app_id: string
  headings: { en: string }
  contents: { en: string }
  data?: Record<string, unknown>
  url?: string
  ios_badgeType?: string
  ios_badgeCount?: number
}

/**
 * Send notification to specific player ID
 */
export async function sendUserNotifByPlayerId(
  playerId: string,
  title: string,
  message: string,
  data?: Record<string, unknown>,
  url?: string
) {
  try {
    const payload: NotificationPayload & { include_player_ids: string[] } = {
      app_id: ONESIGNAL_APP_ID,
      include_player_ids: [playerId],
      headings: { en: title },
      contents: { en: message },
      data: data || {},
    }

    if (url) {
      payload.url = url
    }

    const response = await fetch(ONESIGNAL_REST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${ONESIGNAL_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OneSignal API error: ${JSON.stringify(error)}`)
    }

    const result = await response.json()
    console.log('Notification sent successfully:', result)
    return result
  } catch (error) {
    console.error('Error sending notification:', error)
    throw error
  }
}

/**
 * Send notification to user by user ID
 * This requires fetching player IDs from database first
 */
export async function sendUserNotifByUserId(
  userId: string,
  title: string,
  message: string,
  data?: Record<string, unknown>,
  url?: string
) {
  try {
    // TODO: Fetch player IDs from database
    // Example using Supabase:
    /*
    const { data: devices, error } = await supabase
      .from('onesignal_devices')
      .select('player_id')
      .eq('user_id', userId)
      .eq('type', 'user')

    if (error) throw error

    const playerIds = devices.map(d => d.player_id)
    */

    // For now, use external user ID feature
    const payload: NotificationPayload & { include_external_user_ids: string[] } = {
      app_id: ONESIGNAL_APP_ID,
      include_external_user_ids: [userId],
      headings: { en: title },
      contents: { en: message },
      data: data || {},
    }

    if (url) {
      payload.url = url
    }

    const response = await fetch(ONESIGNAL_REST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${ONESIGNAL_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OneSignal API error: ${JSON.stringify(error)}`)
    }

    const result = await response.json()
    console.log('Notification sent successfully:', result)
    return result
  } catch (error) {
    console.error('Error sending notification:', error)
    throw error
  }
}

/**
 * Send notification to multiple users
 */
export async function sendUserNotifToMany(
  userIds: string[],
  title: string,
  message: string,
  data?: Record<string, unknown>,
  url?: string
) {
  try {
    const payload: NotificationPayload & { include_external_user_ids: string[] } = {
      app_id: ONESIGNAL_APP_ID,
      include_external_user_ids: userIds,
      headings: { en: title },
      contents: { en: message },
      data: data || {},
    }

    if (url) {
      payload.url = url
    }

    const response = await fetch(ONESIGNAL_REST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${ONESIGNAL_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OneSignal API error: ${JSON.stringify(error)}`)
    }

    const result = await response.json()
    console.log('Notifications sent successfully:', result)
    return result
  } catch (error) {
    console.error('Error sending notifications:', error)
    throw error
  }
}

/**
 * Send notification to all users (broadcast)
 */
export async function sendBroadcastNotification(
  title: string,
  message: string,
  data?: Record<string, unknown>,
  url?: string
) {
  try {
    const payload: NotificationPayload & { included_segments: string[] } = {
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['All'], // Send to all subscribed users
      headings: { en: title },
      contents: { en: message },
      data: data || {},
    }

    if (url) {
      payload.url = url
    }

    const response = await fetch(ONESIGNAL_REST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${ONESIGNAL_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OneSignal API error: ${JSON.stringify(error)}`)
    }

    const result = await response.json()
    console.log('Broadcast notification sent successfully:', result)
    return result
  } catch (error) {
    console.error('Error sending broadcast notification:', error)
    throw error
  }
}

/**
 * Notification templates for different events
 */
export const NotificationTemplates = {
  // Negotiation events
  negotiationAccepted: (productName: string) => ({
    title: '🎉 Negosiasi Diterima!',
    message: `Selamat! Negosiasi Anda untuk ${productName} telah diterima oleh penjual.`,
    data: { type: 'negotiation', action: 'accepted' },
  }),

  negotiationRejected: (productName: string) => ({
    title: '❌ Negosiasi Ditolak',
    message: `Maaf, negosiasi Anda untuk ${productName} ditolak. Coba tawar lagi!`,
    data: { type: 'negotiation', action: 'rejected' },
  }),

  negotiationCounterOffer: (productName: string, price: number) => ({
    title: '💬 Penawaran Balik',
    message: `Penjual memberikan penawaran balik Rp ${price.toLocaleString('id-ID')} untuk ${productName}`,
    data: { type: 'negotiation', action: 'counter' },
  }),

  // Order events
  orderCreated: (orderId: string) => ({
    title: '✅ Pesanan Dibuat',
    message: `Pesanan #${orderId} berhasil dibuat. Tunggu konfirmasi penjual.`,
    data: { type: 'order', action: 'created' },
  }),

  orderConfirmed: (orderId: string) => ({
    title: '📦 Pesanan Dikonfirmasi',
    message: `Pesanan #${orderId} telah dikonfirmasi. Siap untuk diproses.`,
    data: { type: 'order', action: 'confirmed' },
  }),

  orderShipped: (orderId: string) => ({
    title: '🚚 Pesanan Dikirim',
    message: `Pesanan #${orderId} sedang dalam perjalanan ke alamat Anda.`,
    data: { type: 'order', action: 'shipped' },
  }),

  orderDelivered: (orderId: string) => ({
    title: '🎁 Pesanan Tiba',
    message: `Pesanan #${orderId} telah sampai. Jangan lupa konfirmasi penerimaan!`,
    data: { type: 'order', action: 'delivered' },
  }),

  orderCancelled: (orderId: string) => ({
    title: '🚫 Pesanan Dibatalkan',
    message: `Pesanan #${orderId} telah dibatalkan.`,
    data: { type: 'order', action: 'cancelled' },
  }),

  // Chat/Message events
  newMessage: (senderName: string) => ({
    title: '💬 Pesan Baru',
    message: `${senderName} mengirimkan pesan baru kepada Anda.`,
    data: { type: 'message', action: 'new' },
  }),

  // System/Admin events
  adminBroadcast: (message: string) => ({
    title: '📢 Pengumuman',
    message: message,
    data: { type: 'system', action: 'broadcast' },
  }),

  productStatusChanged: (productName: string, status: string) => ({
    title: '🔄 Status Produk Berubah',
    message: `Produk ${productName} sekarang berstatus: ${status}`,
    data: { type: 'product', action: 'status_changed' },
  }),
}

/**
 * Send notification using template
 */
export async function sendTemplatedNotification(
  userId: string,
  template: ReturnType<typeof NotificationTemplates[keyof typeof NotificationTemplates]>,
  url?: string
) {
  return sendUserNotifByUserId(
    userId,
    template.title,
    template.message,
    template.data,
    url
  )
}
