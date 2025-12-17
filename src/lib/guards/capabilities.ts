/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/types/auth'

/**
 * Role & Capability Guards
 * Centralized rules for authorization and feature access
 */

// Role types
export type UserRole = 'buyer' | 'seller' | 'admin'

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  if (!user) return false
  return user.role === 'admin'
}

/**
 * Check if user is regular user (buyer or seller)
 */
export function isUser(user: User | null): boolean {
  if (!user) return false
  return user.role === 'buyer' || user.role === 'seller'
}

/**
 * Check if user is seller
 */
export function isSeller(user: User | null): boolean {
  if (!user) return false
  return user.role === 'seller' || user.role === 'admin'
}

/**
 * Check if user is buyer
 */
export function isBuyer(user: User | null): boolean {
  if (!user) return false
  return user.role === 'buyer' || user.role === 'admin'
}

/**
 * Check if user can negotiate on a product
 */
export function canNegotiate(user: User | null, product: any): boolean {
  if (!user || !product) return false
  
  // Cannot negotiate own products
  if (product.user_id === user.id) return false
  
  // Only buyers can negotiate
  if (!isBuyer(user)) return false
  
  // Product must be available
  if (product.status !== 'available') return false
  
  return true
}

/**
 * Check if user can buy a product
 */
export function canBuy(user: User | null, product: any): boolean {
  if (!user || !product) return false
  
  // Cannot buy own products
  if (product.user_id === user.id) return false
  
  // Only buyers can purchase
  if (!isBuyer(user)) return false
  
  // Product must be available
  if (product.status !== 'available') return false
  
  return true
}

/**
 * Check if user can edit a product
 */
export function canEditProduct(user: User | null, product: any): boolean {
  if (!user || !product) return false
  
  // Admin can edit any product
  if (isAdmin(user)) return true
  
  // Owner can edit their product
  return product.user_id === user.id
}

/**
 * Check if user can delete a product
 */
export function canDeleteProduct(user: User | null, product: any): boolean {
  if (!user || !product) return false
  
  // Admin can delete any product
  if (isAdmin(user)) return true
  
  // Owner can delete their product
  return product.user_id === user.id
}

/**
 * Check if user can view an order
 */
export function canViewOrder(user: User | null, order: any): boolean {
  if (!user || !order) return false
  
  // Admin can view all orders
  if (isAdmin(user)) return true
  
  // Buyer or seller can view their orders
  return order.buyer_id === user.id || order.seller_id === user.id
}

/**
 * Check if user can view a negotiation
 */
export function canViewNegotiation(user: User | null, negotiation: any): boolean {
  if (!user || !negotiation) return false
  
  // Admin can view all negotiations
  if (isAdmin(user)) return true
  
  // Buyer or seller can view their negotiations
  return negotiation.buyer_id === user.id || negotiation.seller_id === user.id
}

/**
 * Check if user can respond to a negotiation
 */
export function canRespondToNegotiation(user: User | null, negotiation: any): boolean {
  if (!user || !negotiation) return false
  
  // Only seller can respond
  if (!isSeller(user)) return false
  
  // Must be the product owner
  if (negotiation.seller_id !== user.id) return false
  
  // Negotiation must be pending
  if (negotiation.status !== 'pending') return false
  
  return true
}

/**
 * Check if user can create a product
 */
export function canCreateProduct(user: User | null): boolean {
  if (!user) return false
  
  // Sellers and admins can create products
  return isSeller(user)
}

/**
 * Check if user can access admin panel
 */
export function canAccessAdminPanel(user: User | null): boolean {
  return isAdmin(user)
}

/**
 * Check if user can manage users
 */
export function canManageUsers(user: User | null): boolean {
  return isAdmin(user)
}

/**
 * Check if user can view analytics
 */
export function canViewAnalytics(user: User | null): boolean {
  return isAdmin(user)
}

/**
 * Get user display role
 */
export function getUserDisplayRole(user: User | null): string {
  if (!user) return 'Guest'
  
  switch (user.role) {
    case 'admin':
      return 'Administrator'
    case 'seller':
      return 'Penjual'
    case 'buyer':
      return 'Pembeli'
    default:
      return 'User'
  }
}

/**
 * Get available actions for a product based on user role
 */
export function getProductActions(user: User | null, product: any): string[] {
  const actions: string[] = []
  
  if (!user || !product) return actions
  
  if (canEditProduct(user, product)) {
    actions.push('edit')
  }
  
  if (canDeleteProduct(user, product)) {
    actions.push('delete')
  }
  
  if (canNegotiate(user, product)) {
    actions.push('negotiate')
  }
  
  if (canBuy(user, product)) {
    actions.push('buy')
  }
  
  return actions
}
