// sw.js

// --- CONFIGURAÇÃO (Versão 8) ---
const NOME_CACHE = 'dashboard-lb-v9'; 

// Adicionei "?v=8" para combinar com o manifesto
const ARQUIVOS_PARA_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon_any_192.png?v=9',
  './icon_maskable_192.png?v=9',
  './icon_any_512.png?v=9',
  './icon_maskable_512.png?v=9'
];

// --- INSTALAÇÃO ---
self.addEventListener('install', event => {
  console.log('SW: Instalando versão ' + NOME_CACHE);
  event.waitUntil(
    caches.open(NOME_CACHE)
      .then(cache => {
        console.log('SW: Baixando arquivos da versão 9...');
        return cache.addAll(ARQUIVOS_PARA_CACHE);
      })
  );
});

// --- ATIVAÇÃO (LIMPEZA DE CACHES VELHOS) ---
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== NOME_CACHE) {
            console.log('SW: Apagando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// --- INTERCEPTAR REQUISIÇÕES ---
self.addEventListener('fetch', event => {
  event.respondWith(
    // Tenta a rede primeiro (Network First)
    fetch(event.request).catch(() => {
      // Se estiver offline, busca no cache.
      // ignora o "?v=8" se o navegador pedir sem ele
      return caches.match(event.request, {ignoreSearch: true});
    })
  );
});

// --- OUVIR MENSAGEM DO BOTÃO ---
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
