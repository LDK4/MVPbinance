const CACHE_NAME = 'mvp-balance-v2';
const assets = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  // Força a nova versão a ser instalada imediatamente
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Limpa caches antigos para liberar espaço e atualizar o Pix
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  // Garante que o Service Worker controle a página imediatamente
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
