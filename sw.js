const CACHE_NAME = 'flt-v3.00004';
const ASSETS = [
    './',
    './index.html',
    './css/styles.css',
    './js/supabase.js',
    './js/auth.js',
    './js/data.js',
    './js/storage.js',
    './js/dashboard.js',
    './js/weighin.js',
    './js/gym.js',
    './js/analytics.js',
    './js/meals.js',
    './js/program.js',
    './js/exercises.js',
    './js/settings.js',
    './js/goals.js',
    './js/app.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // Always fetch from network for Supabase + CDN requests
    if (event.request.url.includes('supabase.co') ||
        event.request.url.includes('cdn.jsdelivr.net')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cached => cached || fetch(event.request))
    );
});
