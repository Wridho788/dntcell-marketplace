/**
 * Services Index
 * Central export point for all service modules
 */

export { default as productService } from './product.service'
export { default as categoryService } from './category.service'
export { default as negotiationService } from './negotiation.service'
export { default as orderService } from './order.service'
export { default as notificationService } from './notification.service'
export { default as profileService } from './profile.service'

// Re-export types
export type { 
  Product, 
  ProductImage, 
  ProductFilters 
} from './product.service'

export type { Category } from './category.service'

export type { 
  Negotiation, 
  CreateNegotiationPayload, 
  UpdateNegotiationPayload 
} from './negotiation.service'

export type { 
  Order, 
  OrderStatusLog, 
  CreateOrderPayload 
} from './order.service'

export type { Notification } from './notification.service'

export type { 
  Profile, 
  UpdateProfilePayload 
} from './profile.service'
