import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import notificationService, { Notification } from '@/services/notification.service'

/**
 * Get all notifications for current user
 */
export function useNotifications(options?: UseQueryOptions<Notification[], Error>) {
  return useQuery<Notification[], Error>({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    ...options,
  })
}

/**
 * Get unread notification count
 */
export function useUnreadNotificationCount(options?: UseQueryOptions<number, Error>) {
  return useQuery<number, Error>({
    queryKey: ['notifications-unread-count'],
    queryFn: notificationService.getUnreadCount,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // Refetch every minute
    ...options,
  })
}

/**
 * Mark notification as read
 */
export function useMarkNotificationRead(options?: UseMutationOptions<Notification, Error, string>) {
  const queryClient = useQueryClient()

  return useMutation<Notification, Error, string>({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    },
    ...options,
  })
}

/**
 * Mark all notifications as read
 */
export function useMarkAllNotificationsRead(options?: UseMutationOptions<void, Error, void>) {
  const queryClient = useQueryClient()

  return useMutation<void, Error, void>({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    },
    ...options,
  })
}

/**
 * Delete notification
 */
export function useDeleteNotification(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: notificationService.deleteNotification,
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    },
    ...options,
  })
}
