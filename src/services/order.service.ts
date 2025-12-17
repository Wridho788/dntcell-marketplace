import axiosClient from '@/libs/axios/axiosClient'

export interface Order {
  id: string
  buyer_id: string
  seller_id: string
  product_id: string
  negotiation_id?: string
  final_price: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method?: string
  shipping_address?: Record<string, unknown>
  notes?: string
  created_at: string
  updated_at: string
  product?: {
    id: string
    name: string
    image: string
  }
}

export interface OrderStatusLog {
  id: string
  order_id: string
  status: string
  notes?: string
  created_at: string
}

export interface CreateOrderPayload {
  product_id: string
  negotiation_id?: string
  final_price: number
  payment_method?: string
  shipping_address?: Record<string, unknown>
  notes?: string
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
 * Cancel order (user can only cancel pending orders)
 */
export const cancelOrder = async (id: string): Promise<Order> => {
  const response = await axiosClient.patch<Order>(`/orders?id=eq.${id}`, 
    { status: 'cancelled' },
    {
      headers: {
        'Prefer': 'return=representation'
      }
    }
  )
  return response.data
}

/**
 * Update order status (admin only - but included for completeness)
 */
export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order> => {
  const response = await axiosClient.patch<Order>(`/orders?id=eq.${id}`, 
    { status },
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
}

export default orderService
