/**
 * Notification Event Triggers
 * Examples of how to trigger notifications for various marketplace events
 */

import {
  sendTemplatedNotification,
  NotificationTemplates,
} from '@/lib/onesignal/notification.service'

/**
 * Trigger notification when negotiation is accepted
 */
export async function onNegotiationAccepted(
  negotiation: {
    id: string
    buyer_id: string
    product_name: string
    offer_price: number
  }
) {
  try {
    await sendTemplatedNotification(
      negotiation.buyer_id,
      NotificationTemplates.negotiationAccepted(negotiation.product_name),
      `/negotiations/${negotiation.id}`
    )
  } catch (error) {
    console.error('Error sending negotiation accepted notification:', error)
  }
}

/**
 * Trigger notification when negotiation is rejected
 */
export async function onNegotiationRejected(
  negotiation: {
    id: string
    buyer_id: string
    product_name: string
  }
) {
  try {
    await sendTemplatedNotification(
      negotiation.buyer_id,
      NotificationTemplates.negotiationRejected(negotiation.product_name),
      `/negotiations/${negotiation.id}`
    )
  } catch (error) {
    console.error('Error sending negotiation rejected notification:', error)
  }
}

/**
 * Trigger notification when seller makes counter offer
 */
export async function onNegotiationCounterOffer(
  negotiation: {
    id: string
    buyer_id: string
    product_name: string
    current_price: number
  }
) {
  try {
    await sendTemplatedNotification(
      negotiation.buyer_id,
      NotificationTemplates.negotiationCounterOffer(
        negotiation.product_name,
        negotiation.current_price
      ),
      `/negotiations/${negotiation.id}`
    )
  } catch (error) {
    console.error('Error sending counter offer notification:', error)
  }
}

/**
 * Trigger notification when order is created
 */
export async function onOrderCreated(
  order: {
    id: string
    buyer_id: string
  }
) {
  try {
    await sendTemplatedNotification(
      order.buyer_id,
      NotificationTemplates.orderCreated(order.id),
      `/orders/${order.id}`
    )
  } catch (error) {
    console.error('Error sending order created notification:', error)
  }
}

/**
 * Trigger notification when order is confirmed by seller
 */
export async function onOrderConfirmed(
  order: {
    id: string
    buyer_id: string
  }
) {
  try {
    await sendTemplatedNotification(
      order.buyer_id,
      NotificationTemplates.orderConfirmed(order.id),
      `/orders/${order.id}`
    )
  } catch (error) {
    console.error('Error sending order confirmed notification:', error)
  }
}

/**
 * Trigger notification when order is shipped
 */
export async function onOrderShipped(
  order: {
    id: string
    buyer_id: string
  }
) {
  try {
    await sendTemplatedNotification(
      order.buyer_id,
      NotificationTemplates.orderShipped(order.id),
      `/orders/${order.id}`
    )
  } catch (error) {
    console.error('Error sending order shipped notification:', error)
  }
}

/**
 * Trigger notification when order is delivered
 */
export async function onOrderDelivered(
  order: {
    id: string
    buyer_id: string
  }
) {
  try {
    await sendTemplatedNotification(
      order.buyer_id,
      NotificationTemplates.orderDelivered(order.id),
      `/orders/${order.id}`
    )
  } catch (error) {
    console.error('Error sending order delivered notification:', error)
  }
}

/**
 * Trigger notification when order is cancelled
 */
export async function onOrderCancelled(
  order: {
    id: string
    buyer_id: string
  }
) {
  try {
    await sendTemplatedNotification(
      order.buyer_id,
      NotificationTemplates.orderCancelled(order.id),
      `/orders/${order.id}`
    )
  } catch (error) {
    console.error('Error sending order cancelled notification:', error)
  }
}

/**
 * Trigger notification when user receives a new message
 */
export async function onNewMessage(
  message: {
    id: string
    recipient_id: string
    sender_name: string
    conversation_id: string
  }
) {
  try {
    await sendTemplatedNotification(
      message.recipient_id,
      NotificationTemplates.newMessage(message.sender_name),
      `/messages/${message.conversation_id}`
    )
  } catch (error) {
    console.error('Error sending new message notification:', error)
  }
}

/**
 * Example: Send notification in API route
 * 
 * // In your API route (e.g., /api/negotiations/[id]/accept/route.ts)
 * import { onNegotiationAccepted } from '@/lib/onesignal/event-triggers'
 * 
 * export async function POST(request: NextRequest) {
 *   // ... your logic to accept negotiation
 *   
 *   // Send notification
 *   await onNegotiationAccepted({
 *     id: negotiation.id,
 *     buyer_id: negotiation.buyer_id,
 *     product_name: product.name,
 *     offer_price: negotiation.offer_price
 *   })
 *   
 *   return NextResponse.json({ success: true })
 * }
 */

/**
 * Example: Using database triggers (Supabase)
 * 
 * You can also use Supabase Edge Functions or Database Webhooks to trigger notifications:
 * 
 * 1. Create a Supabase Edge Function:
 * 
 * ```typescript
 * // supabase/functions/send-notification/index.ts
 * import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
 * 
 * serve(async (req) => {
 *   const { type, data } = await req.json()
 *   
 *   // Call your notification service
 *   const response = await fetch('https://your-app.com/api/notifications/trigger', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ type, data })
 *   })
 *   
 *   return new Response(JSON.stringify({ success: true }), {
 *     headers: { 'Content-Type': 'application/json' }
 *   })
 * })
 * ```
 * 
 * 2. Set up Database Webhook in Supabase Dashboard:
 *    - Table: negotiations
 *    - Events: UPDATE
 *    - Webhook URL: https://your-project.supabase.co/functions/v1/send-notification
 */
