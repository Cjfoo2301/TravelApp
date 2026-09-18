// Bump this string every time you push an update to the repo.
// Changing it is what makes the browser notice a new service worker exists.
const CACHE_VERSION = 'v1';
const CACHE_NAME = `bali-trip-${CACHE_VERSION}`;

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
];

// Install: cache the current app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  // Don't auto-activate yet — wait for the page to say it's ready (see below)
});

// Activate: clear out old caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for HTML so users get fresh content when online,
// falling back to cache when offline
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

// Let the page tell this new worker to take over immediately once the user
// taps "Update now" in the banner
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
