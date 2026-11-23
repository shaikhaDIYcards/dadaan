/* دَدَن is closed until launch. This replaces the offline-cache worker of the game: it deletes what earlier visits
   cached on the device, sends any open page back to the network (which now answers with the closed page), and
   removes itself. It has no fetch handler, so nothing is served from a cache again. */
self.addEventListener("install", function () { self.skipWaiting(); });

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) { return Promise.all(keys.map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.clients.claim(); })
      .then(function () { return self.clients.matchAll({ type: "window" }); })
      .then(function (list) { return Promise.all(list.map(function (c) { return c.navigate(c.url).catch(function () {}); })); })
      .then(function () { return self.registration.unregister(); })
      .catch(function () { return self.registration.unregister(); })
  );
});
