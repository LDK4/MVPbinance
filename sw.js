const CACHE_NAME = 'mvp-balance-v2';
const assets = [
  '/',
  '/index.html',
  '/manifest.json'
  // Adicione aqui o caminho dos seus ícones se tiver, ex: '/icon.png'
];

// 1. Instalação: Salva os arquivos novos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache v2 instalado com sucesso');
      return cache.addAll(assets);
    })
  );
  // Força o Service Worker novo a assumir o controle imediatamente
  self.skipWaiting();
});

// 2. Ativação: Deleta o cache antigo (v1) para não ocupar espaço
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Garante que o SW controle as abas abertas imediatamente
  self.clients.claim();
});

// 3. Estratégia: Tenta buscar na rede primeiro para ter o saldo atualizado. 
// Se estiver offline, busca no cache.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
