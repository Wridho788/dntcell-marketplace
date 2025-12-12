'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, User, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavItem {
  label: string
  icon: React.ReactNode
  href: string
  badge?: number
}

export function BottomNav() {
  const pathname = usePathname()

  const navItems: BottomNavItem[] = [
    {
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
    },
    {
      label: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/search',
    },
    {
      label: 'Negotiation',
      icon: <MessageSquare className="w-5 h-5" />,
      href: '/negotiations',
    },
    {
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
      href: '/profile',
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 safe-area-inset-bottom">
      <div className="container-mobile">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 relative min-w-[60px]',
                  isActive
                    ? 'text-primary-600'
                    : 'text-neutral-500 hover:text-neutral-700'
                )}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={cn(
                  'text-[10px] font-medium',
                  isActive && 'font-semibold'
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-600 rounded-t-full" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
