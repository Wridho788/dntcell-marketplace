'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamic import for OneSignal (client-side only, no SSR)
const OneSignalClient = dynamic(
  () => import('@/components/onesignal/onesignal-client').then(mod => ({ default: mod.OneSignalClient })),
  { ssr: false }
)

interface OneSignalWrapperProps {
  appId: string
}

export function OneSignalWrapper({ appId }: OneSignalWrapperProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Only render on client side
    setShouldRender(true)
  }, [])

  // Don't render if no App ID provided
  if (!appId) {
    return null
  }

  // Don't render until client-side
  if (!shouldRender) {
    return null
  }
  
  return <OneSignalClient appId={appId} />
}

