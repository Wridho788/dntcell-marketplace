import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import orderService, { Order, OrderStatusLog, CreateOrderPayload } from '@/services/order.service'

/**
 * Get all orders for current user
 */
export function useOrders(options?: UseQueryOptions<Order[], Error>) {
  return useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: orderService.getOrdersByUser,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  })
}

/**
 * Get single order detail
 */
export function useOrderDetail(id: string, options?: UseQueryOptions<Order, Error>) {
  return useQuery<Order, Error>({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  })
}

/**
 * Get order status logs
 */
export function useOrderStatusLogs(orderId: string, options?: UseQueryOptions<OrderStatusLog[], Error>) {
  return useQuery<OrderStatusLog[], Error>({
    queryKey: ['order-status-logs', orderId],
    queryFn: () => orderService.getOrderStatusLogs(orderId),
    enabled: !!orderId,
    staleTime: 1 * 60 * 1000,
    ...options,
  })
}

/**
 * Create new order
 */
export function useCreateOrder(options?: UseMutationOptions<Order, Error, CreateOrderPayload>) {
  const queryClient = useQueryClient()

  return useMutation<Order, Error, CreateOrderPayload>({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      // Also invalidate product that was ordered
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    ...options,
  })
}

/**
 * Update order status (cancel only for user)
 */
export function useUpdateOrderStatus(options?: UseMutationOptions<Order, Error, string>) {
  const queryClient = useQueryClient()

  return useMutation<Order, Error, string>({
    mutationFn: (orderId) => orderService.updateOrderStatus(orderId, 'cancelled'),
    onSuccess: (_, orderId) => {
      // Invalidate specific order and list
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order-status-logs', orderId] })
    },
    ...options,
  })
}
