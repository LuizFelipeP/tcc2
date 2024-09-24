const cacheName = 'pwa-cache-v1';
const assetsToCache = [
  '/',
  '/index.html',
  'add-expense.html',
  'dashboard.html',
  'add-expense.js',
  'script.js',
  'dashboard.js',
  'style.css',


  // Adicione aqui todos os arquivos que deseja manter em cache
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        console.log('Abrindo cache e armazenando arquivos');
        return cache.addAll(assetsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch(() => {
        return caches.match('/offline.html');
      })
  );
});
