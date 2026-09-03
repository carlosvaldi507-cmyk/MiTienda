// NICHI - retiro definitivo del caché PWA.
// Esta versión elimina cachés de entregas anteriores y se desregistra.
// La tienda se sirve siempre desde la red para no mezclar interfaces antiguas.
const PREFIJOS_CACHE_ANTIGUA = ["nichi-", "todo-klick-", "mi-tienda-"];

self.addEventListener("install", function (evento) {
    evento.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function (evento) {
    evento.waitUntil((async function () {
        const claves = await caches.keys();
        await Promise.all(claves.filter(function (clave) {
            return PREFIJOS_CACHE_ANTIGUA.some(function (prefijo) {
                return clave.startsWith(prefijo);
            });
        }).map(function (clave) {
            return caches.delete(clave);
        }));

        await self.clients.claim();
        const ventanas = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
        await self.registration.unregister();

        ventanas.forEach(function (ventana) {
            ventana.postMessage({ type: "NICHI_CACHE_RETIRADA" });
        });
    })());
});
