'use client'

import dynamic from 'next/dynamic'

// Dynamic import for OneSignal (client-side only, no SSR)
const OneSignalClient = dynamic(
  () => import('@/components/onesignal/onesignal-client').then(mod => ({ default: mod.OneSignalClient })),
  { ssr: false }
)

interface OneSignalWrapperProps {
  appId: string
}

export function OneSignalWrapper({ appId }: OneSignalWrapperProps) {
  return <OneSignalClient appId={appId} />
}
