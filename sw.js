const CACHE = "badoc-hub-v15-3d-spx";
const APP_SHELL = ["./","./index.html","./manifest.webmanifest","./spx-logo-192.png","./spx-logo-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin!==self.location.origin)return;
  e.respondWith(fetch(r).catch(()=>caches.match(r)));
});
