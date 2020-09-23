const cachePrefix = 'cache-v';
const cacheNum = 1;
const cacheName = cachePrefix + cacheNum;
const headers = new Headers();
headers.set('Cache-Control','max-age=86400');
const precacheResources = [
    '/js/main.min.js',
    '/',
    '/css/styles.min.css',
    '/images/icons/android-chrome-192x192.png',
    '/images/icons/android-chrome-512x512.png',
    '/images/icons/favicon.ico',
    '/images/icons/favicon-16x16.png',
    '/images/icons/favicon-32x32.png',
    '/font/Barlow-Light.ttf',
    '/font/Barlow-Medium.ttf',
    '/font/Barlow-Regular.ttf',
    // new Request('http://localhost:3000/api/images/single?format=portrait', {headers: headers})
    new Request('https://beiboot.herokuapp.com/api/images/single?format=portrait', {headers: headers})
];
// fetch('http://localhost:3000/api/images/single?format=portrait').then(response => response.json()).then(data => precacheResources.push(data.imagePath));
fetch('https://beiboot.herokuapp.com/api/images/single?format=portrait').then(response => response.json()).then(data => precacheResources.push(data.imagePath));

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

    const cacheWhitelist = [cacheName];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
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