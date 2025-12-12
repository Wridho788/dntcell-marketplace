// Service Worker for PWA caching
const CACHE_NAME = 'dntcell-v2'
const OFFLINE_URL = '/offline'

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/dntcell-logo.jpeg',
  '/icon-192x192.png',
  '/icon-256x256.png',
]

// Install event - cache initial assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching initial assets')
        return cache.addAll(PRECACHE_ASSETS).catch(err => {
          console.error('[Service Worker] Failed to cache assets:', err)
        })
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...')
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[Service Worker] Deleting old cache:', name)
              return caches.delete(name)
            })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip external requests (OneSignal, Supabase, etc.)
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) {
    // Let external requests pass through
    return
  }

  // Skip API routes
  if (url.pathname.startsWith('/api/')) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        // Cache pages and static assets
        if (
          url.pathname.includes('/_next/static/') ||
          url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff2|ico)$/)
        ) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }

        return response
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          
          // If offline and request is for a page, return offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL).then(offlinePage => {
              if (offlinePage) {
                return offlinePage
              }
              // Fallback if offline page not cached
              return new Response('Offline - Please check your internet connection', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'text/plain' }
              })
            })
          }
          
          return new Response('Offline', { status: 503 })
        })
      })
  )
})

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

console.log('[Service Worker] Loaded successfully')

