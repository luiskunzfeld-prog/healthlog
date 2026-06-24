const CACHE = 'healthlog-v4';

self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// Network first — immer aktuelle Version laden
// Kein Internet → Cache als Fallback
self.addEventListener('fetch', e => {
  // chrome-extension:// und andere nicht-http(s) Schemes überspringen
  if (!e.request.url.startsWith('http')) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
