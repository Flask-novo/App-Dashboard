self.addEventListener('install', event => {
  // Força o service worker a se tornar ativo imediatamente
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Garante que o service worker controle a página imediatamente
  clients.claim();
});

self.addEventListener('fetch', event => {
  // Não faz nada especial com as requisições, deixa a internet cuidar de tudo.
  // Isso é ideal para iframes.
  return;
});
