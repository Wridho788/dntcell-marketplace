import axiosClient from '@/libs/axios/axiosClient'

// Order status types based on Sprint 3 spec
export type OrderStatus = 'pending' | 'waiting_payment' | 'waiting_meetup' | 'paid' | 'completed' | 'cancelled' | 'rejected'
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded'
export type PaymentMethod = 'transfer' | 'cod' | 'meetup'
export type DeliveryType = 'meetup' | 'shipping'

export interface Order {
  id: string
  buyer_id: string
  seller_id: string
  product_id: string
  negotiation_id?: string
  final_price: number
  order_status: OrderStatus
  payment_status: PaymentStatus
  payment_method?: PaymentMethod
  payment_reference?: string
  delivery_type?: DeliveryType
  meetup_location?: string
  meetup_at?: string
  cancel_reason?: string
  created_at: string
  updated_at: string
  product?: {
    id: string
    name: string
    main_image_url: string
    selling_price: number
  }
  seller?: {
    id: string
    profiles?: {
      full_name?: string
    }
  }
}

export interface OrderStatusLog {
  id: string
  order_id: string
  from_status: string | null
  to_status: string
  changed_by: string
  created_at: string
}

export interface CreateOrderPayload {
  product_id: string
  negotiation_id?: string
  final_price: number
  payment_method: PaymentMethod
  delivery_type?: DeliveryType
  meetup_location?: string
  meetup_at?: string
}

export interface CancelOrderPayload {
  cancel_reason: string
}

export interface PaymentProof {
  id: string
  order_id: string
  image_url: string
  created_at: string
}

/**
 * Get all orders for current user
 * Supabase PostgREST format: /orders?select=*&order=created_at.desc
 * Note: User filtering handled by RLS
 */
export const getOrdersByUser = async (): Promise<Order[]> => {
  const response = await axiosClient.get<Order[]>('/orders', {
    params: {
      select: '*,product:products(*)',
      order: 'created_at.desc'
    }
  })
  return response.data
}

/**
 * Get single order by ID
 * Supabase PostgREST format: /orders?id=eq.123&select=*
 */
export const getOrderById = async (id: string): Promise<Order> => {
  const response = await axiosClient.get<Order[]>('/orders', {
    params: {
      id: `eq.${id}`,
      select: '*,product:products(*)',
      limit: 1
    }
  })
  return response.data[0]
}

/**
 * Get order status logs
 * Supabase PostgREST format: /order_status_logs?order_id=eq.123
 */
export const getOrderStatusLogs = async (orderId: string): Promise<OrderStatusLog[]> => {
  const response = await axiosClient.get<OrderStatusLog[]>('/order_status_logs', {
    params: {
      order_id: `eq.${orderId}`,
      select: '*',
      order: 'created_at.asc'
    }
  })
  return response.data
}

/**
 * Create new order
 */
export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const response = await axiosClient.post<Order>('/orders', payload, {
    headers: {
      'Prefer': 'return=representation'
    }
  })
  return response.data
}

/**
 * Cancel order (user can only cancel certain statuses)
 */
export const cancelOrder = async (id: string, payload: CancelOrderPayload): Promise<Order> => {
  const response = await axiosClient.patch<Order>(`/orders?id=eq.${id}`, 
    { 
      order_status: 'cancelled',
      cancel_reason: payload.cancel_reason
    },
    {
      headers: {
        'Prefer': 'return=representation'
      }
    }
  )
  return response.data
}

/**
 * Upload payment proof
 */
export const uploadPaymentProof = async (orderId: string, imageUrl: string): Promise<PaymentProof> => {
  const response = await axiosClient.post<PaymentProof>('/payment_proofs', 
    {
      order_id: orderId,
      image_url: imageUrl
    },
    {
      headers: {
        'Prefer': 'return=representation'
      }
    }
  )
  return response.data
}

/**
 * Get payment proofs for an order
 */
export const getPaymentProofs = async (orderId: string): Promise<PaymentProof[]> => {
  const response = await axiosClient.get<PaymentProof[]>('/payment_proofs', {
    params: {
      order_id: `eq.${orderId}`,
      select: '*',
      order: 'created_at.desc'
    }
  })
  return response.data
}

/**
 * Update order status (admin only - but included for completeness)
 */
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  const response = await axiosClient.patch<Order>(`/orders?id=eq.${id}`, 
    { order_status: status },
    {
      headers: {
        'Prefer': 'return=representation'
      }
    }
  )
  return response.data
}

const orderService = {
  getOrdersByUser,
  getOrderById,
  getOrderStatusLogs,
  createOrder,
  cancelOrder,
  updateOrderStatus,
  uploadPaymentProof,
  getPaymentProofs,
}

export default orderService
