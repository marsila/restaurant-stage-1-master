var staticCacheName = "cache-v1";

/* These resources will be downloaded and cached by the service worker
   during the installation process.*/
var filesToCache = [
  '/',
  '/restaurant.html',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/js/dbhelper.js',
  '/css/styles.css',
  '/css/responsive-styles.css',
  '/data/restaurants.json',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg'
];

//Handling install event.
self.addEventListener('install', (event) => {
  console.log('in install!');
  event.waitUntil(
    //open a cache
    caches.open(staticCacheName)
    .then((cache) => {
      //cache our files.
      return cache.addAll(filesToCache);
    })
  );
});

//Deleting data from the cache.
self.addEventListener('activate', (event) => {
  console.log('activate event in progress!');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('cache-') &&
            cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

//Caching requests
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.open(staticCacheName).then((cache) => {
    return cache.match(event.request).then((response) => {
      return response || fetch(event.request).then((response) => {
        cache.put(event.request, response.clone());
        return response;
      });
    });
  }))
});