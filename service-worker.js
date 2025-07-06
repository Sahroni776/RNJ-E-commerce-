const CACHE_NAME = 'rnj-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Add other static assets like CSS, JS bundles, and maybe key images/icons if needed
  // These paths will depend on the build output
  // Example:
  // '/assets/index-*.css',
  // '/assets/index-*.js',
  '/vite.svg',
  '/react.svg',
  '/manifest.json',
  // Kedai Shopee Style assets
  '/assets/icons_new/servis_kompor.jpeg',
  '/assets/icons_new/bersih_rumah.jpeg',
  '/assets/icons_new/cat_rumah.jpeg',
  '/assets/icons_new/bersih_kebun.jpeg',
  '/assets/icons_new/default_kedai.jpeg',
  '/assets/home_services_card_bg.jpeg'
];

// Install event: Cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Use addAll for atomic caching
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache initial assets:', error);
          // Don't fail the install just because some assets failed, 
          // but log it for debugging.
        });
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // For navigation requests, try network first, then cache (Network Falling Back to Cache)
  // This ensures users get the latest HTML if online.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return caches.match(event.request);
          }
          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return; // Exit after handling navigation
  }

  // For other requests (assets like CSS, JS, images), use Cache First strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
