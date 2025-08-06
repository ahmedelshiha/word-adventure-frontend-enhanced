/**
 * Service Worker for Word Adventure PWA
 * Handles caching and offline functionality
 */

const CACHE_NAME = 'word-adventure-v1'
const STATIC_CACHE_NAME = 'word-adventure-static-v1'
const DYNAMIC_CACHE_NAME = 'word-adventure-dynamic-v1'

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
]

// Essential words data for offline mode
const ESSENTIAL_WORDS_KEY = 'essential-words-cache'

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error)
      })
  )
  
  // Skip waiting to activate immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip external requests (except for images)
  if (url.origin !== location.origin && !request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    return
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse
        }
        
        // Otherwise fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            
            // Clone the response
            const responseToCache = response.clone()
            
            // Cache dynamic content
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache)
              })
            
            return response
          })
          .catch(() => {
            // If network fails, try to serve offline fallback
            if (request.destination === 'document') {
              return caches.match('/')
            }
            
            // For images, return a placeholder
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">Image unavailable</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              )
            }
            
            return new Response('Offline', { status: 503 })
          })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag)
  
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncUserProgress())
  }
})

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')
  
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Word Adventure', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data)
  
  if (event.data && event.data.type === 'CACHE_ESSENTIAL_WORDS') {
    cacheEssentialWords(event.data.words)
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Helper function to cache essential words for offline use
async function cacheEssentialWords(words) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME)
    
    // Cache word images
    const imagePromises = words
      .filter(word => word.image)
      .map(word => {
        return fetch(word.image)
          .then(response => {
            if (response.ok) {
              return cache.put(word.image, response)
            }
          })
          .catch(error => {
            console.warn('Failed to cache word image:', word.image, error)
          })
      })
    
    await Promise.allSettled(imagePromises)
    console.log('Service Worker: Essential words cached for offline use')
  } catch (error) {
    console.error('Service Worker: Failed to cache essential words', error)
  }
}

// Helper function to sync user progress when back online
async function syncUserProgress() {
  try {
    // Get pending changes from IndexedDB or localStorage
    const pendingChanges = JSON.parse(localStorage.getItem('word_adventure_pending_changes') || '[]')
    
    if (pendingChanges.length === 0) {
      return
    }
    
    // Try to sync each change
    const syncPromises = pendingChanges.map(async (change) => {
      try {
        const response = await fetch('/api/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(change)
        })
        
        if (response.ok) {
          return { success: true, id: change.id }
        } else {
          throw new Error(`Sync failed: ${response.status}`)
        }
      } catch (error) {
        console.error('Failed to sync change:', change, error)
        return { success: false, id: change.id, error }
      }
    })
    
    const results = await Promise.allSettled(syncPromises)
    
    // Remove successfully synced changes
    const successfulIds = results
      .filter(result => result.status === 'fulfilled' && result.value.success)
      .map(result => result.value.id)
    
    const remainingChanges = pendingChanges.filter(change => !successfulIds.includes(change.id))
    localStorage.setItem('word_adventure_pending_changes', JSON.stringify(remainingChanges))
    
    console.log(`Service Worker: Synced ${successfulIds.length} changes, ${remainingChanges.length} remaining`)
  } catch (error) {
    console.error('Service Worker: Background sync failed', error)
  }
}

