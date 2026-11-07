// Kill switch for the old next-pwa service worker.
//
// Earlier versions of the site registered a Workbox service worker at /sw.js
// that cached pages and scripts. That setup was removed, but browsers that
// already installed it keep running it until a new /sw.js replaces it. This
// worker takes over, deletes every cache the old one created, unregisters
// itself and reloads open tabs so readers always get the current site.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});
