import axiosClient from '@/libs/axios/axiosClient'

export interface Notification {
  id: string
  user_id: string
  type: 'order' | 'negotiation' | 'product' | 'system'
  title: string
  message: string
  data?: Record<string, unknown>
  is_read: boolean
  created_at: string
}

/**
 * Get all notifications for current user
 */
export const getNotifications = async (): Promise<Notification[]> => {
  const response = await axiosClient.get<Notification[]>('/notifications')
  return response.data
}

/**
 * Get unread notification count
 */
export const getUnreadCount = async (): Promise<number> => {
  const response = await axiosClient.get<{ count: number }>('/notifications/unread-count')
  return response.data.count
}

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId: string): Promise<Notification> => {
  const response = await axiosClient.patch<Notification>(`/notifications/${notificationId}/read`)
  return response.data
}

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<void> => {
  await axiosClient.patch('/notifications/read-all')
}

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  await axiosClient.delete(`/notifications/${notificationId}`)
}

const notificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
}

export default notificationService
