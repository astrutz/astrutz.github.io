const cacheName = 'cache-v1';
const precacheResources = [
    '/js/main.min.js',
    '/',
    '/css/styles.min.css',
    '/images/icons/android-chrome-192x192.png',
    '/images/icons/android-chrome-512x512.png',
    '/images/icons/favicon.ico',
    '/images/icons/favicon-16x16.png',
    '/images/icons/favicon-32x32.png',
];

self.addEventListener('install', event => {
    console.log('Service worker', 'installed', event);
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                const b = cache.addAll(precacheResources);
                console.log(cache);
                return b;
            })
    );
});

self.addEventListener('activate', event => {
    console.log('Service worker',  'activated', event);
});

self.addEventListener('fetch', event => {
    console.log('Service worker',  'fetched:', event.request.url);
    event.respondWith(caches.match(event.request)
        .then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        })
    );
});