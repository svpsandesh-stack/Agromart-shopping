const CACHE_NAME = "agromart-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png"
];

// INSTALL SERVICE WORKER

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    }).catch(error => {
      console.error("Cache installation error:", error);
    })
  );

  self.skipWaiting();
});

// ACTIVATE SERVICE WORKER

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );

  self.clients.claim();
});

// FETCH FILES

self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {

      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(response => {

        if (
          response &&
          response.status === 200 &&
          response.type === "basic"
        ) {
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }

        return response;
      });

    }).catch(() => {
      if (event.request.mode === "navigate") {
        return caches.match("./index.html");
      }

      return new Response("You are offline.", {
        status: 503,
        headers: {
          "Content-Type": "text/plain"
        }
      });
    })
  );

});
