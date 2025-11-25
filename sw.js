// sw.js

// --- CONFIGURAÇÃO (Versão 7) ---
const NOME_CACHE = 'dashboard-lb-v7'; 

// Adicionei "?v=7" para forçar o navegador a baixar os ícones novos agora
const ARQUIVOS_PARA_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon_any_192.png?v=7',
  './icon_maskable_192.png?v=7',
  './icon_any_512.png?v=7',
  './icon_maskable_512.png?v=7'
];

// --- INSTALAÇÃO ---
self.addEventListener('install', event => {
  console.log('SW: Instalando versão ' + NOME_CACHE);
  event.waitUntil(
    caches.open(NOME_CACHE)
      .then(cache => {
        console.log('SW: Baixando arquivos da versão 7...');
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
      // "ignoreSearch: true" permite encontrar "icon.png?v=7" mesmo pedindo só "icon.png"
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
