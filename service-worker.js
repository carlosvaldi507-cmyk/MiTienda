const CACHE_NAME = "mi-tienda-v1";

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

self.addEventListener("install", function(evento) {

    evento.waitUntil(

        caches.open(CACHE_NAME)
            .then(function(cache) {

                return cache.addAll(ARCHIVOS);

            })

    );

});


self.addEventListener("activate", function(evento) {

    evento.waitUntil(

        caches.keys().then(function(claves) {

            return Promise.all(

                claves
                    .filter(function(clave) {

                        return clave !== CACHE_NAME;

                    })
                    .map(function(clave) {

                        return caches.delete(clave);

                    })

            );

        })

    );

});


self.addEventListener("fetch", function(evento) {

    evento.respondWith(

        caches.match(evento.request)
            .then(function(respuesta) {

                if (respuesta) {

                    return respuesta;

                }

                return fetch(evento.request);

            })

    );

});