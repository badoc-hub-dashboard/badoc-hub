const CACHE = "badoc-hub-v31-linehaul-town-fix";
const APP_SHELL = [
  "./",
  "./manifest.webmanifest",
  "./badoc-hub-icon.png",
  "./spx-logo-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Always fetch HTML/favicons fresh so deployments are not hidden by the PWA cache.
  const isHtml = request.mode === "navigate" || request.destination === "document";
  const isIcon = request.destination === "image" && (
    url.pathname.endsWith("badoc-hub-icon.png") ||
    url.pathname.endsWith("spx-logo-512.png")
  );

  if (isHtml || isIcon) {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
