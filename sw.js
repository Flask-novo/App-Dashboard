// --- CONFIGURAÇÃO DASHBOARD ---
const CACHE_NAME = 'dashboard-lb-v10'; 

// SEM o "?v=10" para bater certo com o manifesto e os arquivos reais
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Nomes exatos dos arquivos na pasta (sem "novo_" se os arquivos não tiverem "novo_")
  './icon_any_192.png',
  './icon_maskable_192.png',
  './icon_any_512.png',
  './icon_maskable_512.png'
];

// 1. INSTALAÇÃO
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto: ' + CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. ATIVAÇÃO (Limpeza de caches antigos)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Se não for o cache v10 do Dashboard, apaga!
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. INTERCEPTAÇÃO (A Mágica da Atualização)
self.addEventListener('fetch', event => {
  
  // REGRA DE OURO: O arquivo versao.json NUNCA pode vir do cache.
  // Tem de vir da internet para o aviso de atualização aparecer na hora.
  if (event.request.url.includes('versao.json')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Se offline, retorna 0 para não dar erro
        return new Response(JSON.stringify({ versao_atual: 0 }), {
            headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Para o resto (Imagens, Site), usa o Cache para ser rápido
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
