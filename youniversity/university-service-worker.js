/* EML Youniversity University Service Worker — app-shell cache only. */
const CACHE_NAME = 'eml-youniversity-shell-v5';
const APP_SHELL = ['', 'index.html', 'portal.html', 'dashboard.html', 'offline.html', 'manifest.webmanifest', 'pwa-icon.svg', 'updates.json']
  .map((path) => new URL(path, self.registration.scope).toString());
const offlineUrl = new URL('offline.html', self.registration.scope).toString();

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request).then((cached) => cached || caches.match(offlineUrl))));
    return;
  }

  if (url.pathname.endsWith('/updates.json')) {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request)));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    return response;
  })));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'EML_YOUNIVERSITY_ACTIVATE_UPDATE') self.skipWaiting();
});
