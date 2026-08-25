const CACHE_VERSION = "mi-tienda-v7";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./catalogo.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./mi-fondo.png",
    "./icon-192.png",
    "./icon-512.png"
];


// =====================================================
// INSTALACIÓN
// =====================================================

self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_VERSION)
            .then(cache => {

                return cache.addAll(ARCHIVOS);

            })

    );

});


// =====================================================
// ACTIVAR NUEVA VERSIÓN
// =====================================================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(keys => {

                return Promise.all(

                    keys
                        .filter(key => key !== CACHE_VERSION)
                        .map(key => caches.delete(key))

                );

            })
            .then(() => {

                return self.clients.claim();

            })

    );

});


// =====================================================
// RESPUESTAS
// =====================================================

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {

        return;

    }

    event.respondWith(

        fetch(event.request)
            .then(response => {

                const copia = response.clone();

                if (!response.ok) {

                    return response;

                }

                event.waitUntil(
                    caches.open(CACHE_VERSION)
                        .then(cache => {

                            return cache.put(
                                event.request,
                                copia
                            );

                        })
                );

                return response;

            })
            .catch(() => {

                return caches.match(
                    event.request
                );

            })

    );

});
