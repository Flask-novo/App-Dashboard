// sw.js

// --- CONFIGURAÇÃO ---
// Mude 'v1' para 'v2' quando quiser forçar a atualização no celular do usuário
const NOME_CACHE = 'dashboard-lb-v4'; 

// Lista exata dos arquivos do seu manifesto para garantir que baixam rápido
const ARQUIVOS_PARA_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon_any_192.png',
  '/icon_maskable_192.png',
  '/icon_any_512.png',
  '/icon_maskable_512.png'
];

// --- INSTALAÇÃO ---
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando versão ' + NOME_CACHE);
  event.waitUntil(
    caches.open(NOME_CACHE)
      .then(cache => {
        console.log('Service Worker: Fazendo cache dos arquivos');
        return cache.addAll(ARQUIVOS_PARA_CACHE);
      })
  );
});

// --- ATIVAÇÃO (LIMPEZA) ---
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          // Se o cache não for o atual (v1), apaga ele para liberar espaço
          if (cache !== NOME_CACHE) {
            console.log('Service Worker: Limpando cache antigo');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Garante controle imediato
  self.clients.claim();
});

// --- INTERCEPTAR REQUISIÇÕES ---
self.addEventListener('fetch', event => {
  event.respondWith(
    // Tenta buscar na rede primeiro, se falhar (offline), vai no cache
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// --- OUVIR MENSAGEM DO SITE ---
// Isso permite que o botão "Atualizar" funcione
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
