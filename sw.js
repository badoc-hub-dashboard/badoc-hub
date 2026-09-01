const CACHE="badoc-hub-v15-offline";
const APP=["./","./index.html","./manifest.webmanifest","./badoc-hub-icon.png","./spx-logo-192.png","./spx-logo-512.png","./favicon.ico"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;const u=new URL(e.request.url);if(u.origin!==self.location.origin)return;e.respondWith(fetch(e.request,{cache:"no-store"}).catch(()=>caches.match(e.request)));});
