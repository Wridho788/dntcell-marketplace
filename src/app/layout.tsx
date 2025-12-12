import type { Metadata, Viewport } from "next"
import Script from 'next/script'
import { AppProvider } from '@/components/providers/app-provider'
import { PageTransition } from '@/components/ui/page-transition'
import { OneSignalWrapper } from '@/components/onesignal/onesignal-wrapper'
import { SplashScreen } from '@/components/ui/splash-screen'
import { PWAInstallPrompt } from '@/components/ui/pwa-install-prompt'
import "./globals.css"

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0e05ad",
}

export const metadata: Metadata = {
  title: {
    template: "%s – DNTCell - Marketplace Second-Hand HP & Laptop",
    default: "DNTCell - Marketplace Second-Hand HP & Laptop Terpercaya",
  },
  description: "Platform jual beli second-hand HP & Laptop terpercaya dengan sistem negosiasi dan transaksi offline yang aman",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DNTCell",
  },
  icons: {
    icon: "/icon-192x192.png",
    shortcut: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  openGraph: {
    type: "website",
    siteName: "DNTCell Marketplace",
    title: "DNTCell - Marketplace Second-Hand HP & Laptop",
    description: "Platform jual beli second-hand HP & Laptop terpercaya",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {/* Splash Screen - Only on first visit */}
        <SplashScreen />
        
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
        
        <AppProvider>
          {/* OneSignal Push Notifications */}
          <OneSignalWrapper appId={process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || ''} />
          
          <PageTransition>
            {children}
          </PageTransition>
        </AppProvider>
        
        {/* Service Worker Registration */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registered successfully:', registration.scope);
                    },
                    function(err) {
                      console.log('Service Worker registration failed:', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
