// sw.js

// --- CONFIGURAÇÃO ---
// Mudei para v5 para garantir um novo teste limpo
const NOME_CACHE = 'dashboard-lb-v5'; 

// --- CORREÇÃO CRÍTICA ---
// Usei ponto-barra (./) para garantir que ele ache os arquivos 
// mesmo se o site não estiver na raiz do domínio.
const ARQUIVOS_PARA_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon_any_192.png',
  './icon_maskable_192.png',
  './icon_any_512.png',
  './icon_maskable_512.png'
];

// --- INSTALAÇÃO ---
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando versão ' + NOME_CACHE);
  
  event.waitUntil(
    caches.open(NOME_CACHE)
      .then(cache => {
        console.log('Service Worker: Baixando arquivos...');
        return cache.addAll(ARQUIVOS_PARA_CACHE);
      })
      .catch(error => {
        // Isso vai aparecer no console se algum arquivo estiver com nome errado
        console.error('ERRO CRÍTICO NA INSTALAÇÃO (Verifique os nomes dos arquivos):', error);
      })
  );
});

// --- ATIVAÇÃO (LIMPEZA) ---
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== NOME_CACHE) {
            console.log('Service Worker: Limpando cache antigo');
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
    // Estratégia: Network First (Tenta internet, se falhar vai pro cache)
    // Isso é melhor para o seu Iframe não ficar preso em cache velho
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// --- OUVIR MENSAGEM DO SITE ---
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
