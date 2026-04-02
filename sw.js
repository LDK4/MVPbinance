const CACHE_NAME = 'mvp-balance-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icone-192.png'
];

// Instala o Service Worker e salva os arquivos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Intercepta as chamadas e serve o conteúdo do cache (se não tiver internet)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});