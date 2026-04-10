const CACHE_NAME = "calcvision-v1";
const PRECACHE = ["/", "/index.html", "/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  // Skip chrome-extension or other non-http schemes
  if (!e.request.url.startsWith("http")) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return res;
        })
        .catch((err) => {
          if (cached) return cached;
          // If navigation request fails, try returning index.html for SPA
          if (e.request.mode === "navigate") {
            return caches.match("/index.html");
          }
          throw err;
        });

      return cached || fetched;
    })
  );
});
