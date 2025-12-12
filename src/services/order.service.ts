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
 */
export const getOrdersByUser = async (): Promise<Order[]> => {
  const response = await axiosClient.get<Order[]>('/orders')
  return response.data
}

/**
 * Get single order by ID
 */
export const getOrderById = async (id: string): Promise<Order> => {
  const response = await axiosClient.get<Order>(`/orders/${id}`)
  return response.data
}

/**
 * Get order status logs
 */
export const getOrderStatusLogs = async (orderId: string): Promise<OrderStatusLog[]> => {
  const response = await axiosClient.get<OrderStatusLog[]>(`/orders/${orderId}/status-logs`)
  return response.data
}

/**
 * Create new order
 */
export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const response = await axiosClient.post<Order>('/orders', payload)
  return response.data
}

/**
 * Update order status (user can only cancel)
 */
export const updateOrderStatus = async (id: string, status: 'cancelled'): Promise<Order> => {
  const response = await axiosClient.patch<Order>(`/orders/${id}/status`, { status })
  return response.data
}

const orderService = {
  getOrdersByUser,
  getOrderById,
  getOrderStatusLogs,
  createOrder,
  updateOrderStatus,
}

export default orderService
