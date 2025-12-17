/**
 * Guards Index
 * Central export point for all guard utilities
 */

// Component guards
export { AuthGuard } from '@/components/auth/auth-guard'
export { AuthRequiredGuard } from '@/components/guards/auth-required-guard'
export { PublicRouteGuard } from '@/components/guards/public-route-guard'
export { AdminGuard } from '@/components/guards/admin-guard'

// Capability guards and helpers
export * from './capabilities'
