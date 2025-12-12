import type { Metadata, Viewport } from "next"
import { AppProvider } from '@/components/providers/app-provider'
import { PageTransition } from '@/components/ui/page-transition'
import { OneSignalWrapper } from '@/components/onesignal/onesignal-wrapper'
import "./globals.css"

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
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
    <html lang="en">
      <head>
        <meta name="application-name" content="DNTCell Marketplace" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DNTCell" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#2563eb" />

        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icon-16x16.png"
        />
        <link rel="shortcut icon" href="/dntcell-logo.ico" />
      </head>
      <body className="antialiased">
        <AppProvider>
          {/* OneSignal Push Notifications */}
          <OneSignalWrapper appId={process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || ''} />
          
          <PageTransition>
            {children}
          </PageTransition>
        </AppProvider>
        
        {/* Service Worker - Disabled for now to debug caching issues */}
        {/* 
        <script
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
        */}
      </body>
    </html>
  );
}
