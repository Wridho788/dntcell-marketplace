/**
 * Hooks Index
 * Central export point for all TanStack Query hooks
 */

// Product hooks
export {
  useProducts,
  useInfiniteProducts,
  useProductDetail,
  useProductImages,
  useSearchProducts,
  useFeaturedProducts,
  useProductsByCategory,
} from './useProducts'

// Category hooks
export {
  useCategories,
  useCategoryById,
  useCategoryBySlug,
} from './useCategories'

// Negotiation hooks
export {
  useNegotiations,
  useNegotiationDetail,
  useCreateNegotiation,
  useCancelNegotiation,
} from './useNegotiations'

// Order hooks
export {
  useOrders,
  useOrderDetail,
  useOrderStatusLogs,
  useCreateOrder,
  useUpdateOrderStatus,
} from './useOrders'

// Notification hooks
export {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from './useNotifications'

// Profile hooks
export {
  useProfile,
  useProfileByUserId,
  useUpdateProfile,
  useUploadAvatar,
} from './useProfile'
