import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dncell-marketplace.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/profile',
          '/profile/*',
          '/negotiations',
          '/negotiations/*',
          '/orders',
          '/orders/*',
          '/notifications',
          '/login',
          '/register',
          '/forgot-password',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
