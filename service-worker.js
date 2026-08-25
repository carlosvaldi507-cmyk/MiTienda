// =====================================================
// MI TIENDA - SERVICE WORKER
// ACTUALIZACIÓN AUTOMÁTICA Y CACHÉ INTELIGENTE
// =====================================================

const CACHE_VERSION = "mi-tienda-v11";


// =====================================================
// ARCHIVOS BÁSICOS
// =====================================================

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
// ARCHIVOS QUE SIEMPRE DEBEN ACTUALIZARSE
// =====================================================

const ARCHIVOS_SIEMPRE_ACTUALIZADOS = [
    "/",
    "/index.html",
    "/catalogo.html",
    "/style.css",
    "/script.js"
];


// =====================================================
// INSTALACIÓN
// =====================================================

self.addEventListener("install", event => {

    console.log(
        "[Mi Tienda] Instalando:",
        CACHE_VERSION
    );

    event.waitUntil(

        caches.open(CACHE_VERSION)

            .then(cache => {

                return cache.addAll(ARCHIVOS);

            })

            .then(() => {

                // Activar inmediatamente
                return self.skipWaiting();

            })

            .catch(error => {

                console.error(
                    "[Mi Tienda] Error instalando caché:",
                    error
                );

            })

    );

});


// =====================================================
// ACTIVACIÓN
// =====================================================

self.addEventListener("activate", event => {

    console.log(
        "[Mi Tienda] Activando:",
        CACHE_VERSION
    );

    event.waitUntil(

        caches.keys()

            .then(keys => {

                return Promise.all(

                    keys
                        .filter(key => {

                            return (
                                key.startsWith("mi-tienda-") &&
                                key !== CACHE_VERSION
                            );

                        })

                        .map(key => {

                            console.log(
                                "[Mi Tienda] Eliminando caché antigua:",
                                key
                            );

                            return caches.delete(key);

                        })

                );

            })

            .then(() => {

                return self.clients.claim();

            })

    );

});


// =====================================================
// MENSAJES
// =====================================================

self.addEventListener("message", event => {

    if (
        event.data &&
        event.data.type === "SKIP_WAITING"
    ) {

        self.skipWaiting();

    }

});


// =====================================================
// DETERMINAR SI EL RECURSO DEBE ACTUALIZARSE
// =====================================================

function esArchivoActualizable(request) {

    const url =
        new URL(
            request.url
        );

    const pathname =
        url.pathname;


    return (
        ARCHIVOS_SIEMPRE_ACTUALIZADOS.includes(
            pathname
        )
    );

}


// =====================================================
// GUARDAR EN CACHÉ
// =====================================================

async function guardarEnCache(
    request,
    response
) {

    if (
        !response ||
        !response.ok
    ) {

        return;

    }


    try {

        const cache =
            await caches.open(
                CACHE_VERSION
            );


        await cache.put(
            request,
            response.clone()
        );

    } catch (error) {

        console.warn(
            "[Mi Tienda] No se pudo guardar:",
            error
        );

    }

}


// =====================================================
// OBTENER ARCHIVO DESDE CACHÉ
// =====================================================

async function obtenerDesdeCache(
    request
) {

    try {

        return await caches.match(
            request
        );

    } catch (error) {

        console.warn(
            "[Mi Tienda] Error leyendo caché:",
            error
        );

        return null;

    }

}


// =====================================================
// PÁGINA OFFLINE
// =====================================================

function crearPaginaOffline() {

    return new Response(

        `<!DOCTYPE html>

        <html lang="es">

        <head>

            <meta charset="UTF-8">

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <meta
                name="theme-color"
                content="#0d5c72"
            >

            <title>Mi Tienda</title>

            <style>

                * {
                    box-sizing: border-box;
                }

                body {

                    margin: 0;

                    min-height: 100vh;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    padding: 24px;

                    font-family:
                        Arial,
                        sans-serif;

                    background:
                        #f5f8fa;

                    color:
                        #123b4a;

                    text-align:
                        center;

                }

                .offline {

                    width:
                        min(
                            420px,
                            100%
                        );

                    background:
                        white;

                    padding:
                        32px 24px;

                    border-radius:
                        20px;

                    box-shadow:
                        0 12px 35px
                        rgba(
                            0,
                            0,
                            0,
                            .12
                        );

                }

                .icono {

                    font-size:
                        52px;

                    margin-bottom:
                        14px;

                }

                h1 {

                    margin:
                        0 0 10px;

                }

                p {

                    color:
                        #65757d;

                    line-height:
                        1.5;

                }

                button {

                    border:
                        0;

                    border-radius:
                        10px;

                    padding:
                        12px 20px;

                    background:
                        #0d5c72;

                    color:
                        white;

                    font-weight:
                        700;

                    cursor:
                        pointer;

                }

            </style>

        </head>

        <body>

            <main class="offline">

                <div class="icono">
                    📡
                </div>

                <h1>
                    Mi Tienda
                </h1>

                <p>
                    No hay conexión a Internet.
                </p>

                <p>
                    Comprueba tu conexión e inténtalo nuevamente.
                </p>

                <button
                    onclick="location.reload()"
                >
                    Reintentar
                </button>

            </main>

        </body>

        </html>`,

        {
            status: 503,

            headers: {
                "Content-Type":
                    "text/html; charset=utf-8"
            }

        }

    );

}


// =====================================================
// FETCH
// =====================================================

self.addEventListener(
    "fetch",
    event => {

        const request =
            event.request;


        // Solo GET

        if (
            request.method !== "GET"
        ) {

            return;

        }


        const url =
            new URL(
                request.url
            );


        // Solo archivos de nuestra página

        if (
            url.origin !==
            self.location.origin
        ) {

            return;

        }


        // =================================================
        // NAVEGACIÓN / HTML / CSS / JS
        // NETWORK FIRST
        // =================================================

        if (
            request.mode === "navigate" ||
            esArchivoActualizable(
                request
            )
        ) {

            event.respondWith(

                (async () => {

                    try {

                        const solicitud =
                            new Request(
                                request,
                                {
                                    cache:
                                        "no-store"
                                }
                            );


                        const respuesta =
                            await fetch(
                                solicitud
                            );


                        if (
                            respuesta &&
                            respuesta.ok
                        ) {

                            await guardarEnCache(
                                request,
                                respuesta
                            );

                        }


                        return respuesta;

                    } catch (error) {

                        console.warn(
                            "[Mi Tienda] Sin Internet. Buscando copia guardada."
                        );


                        const cache =
                            await obtenerDesdeCache(
                                request
                            );


                        if (cache) {

                            return cache;

                        }


                        // Para cualquier navegación,
                        // intentar index.html.

                        if (
                            request.mode ===
                            "navigate"
                        ) {

                            const index =
                                await obtenerDesdeCache(
                                    new Request(
                                        "./index.html"
                                    )
                                );


                            if (index) {

                                return index;

                            }

                        }


                        return crearPaginaOffline();

                    }

                })()

            );


            return;

        }


        // =================================================
        // IMÁGENES, ICONOS Y OTROS RECURSOS
        // CACHE FIRST
        // =================================================

        event.respondWith(

            (async () => {

                const cache =
                    await obtenerDesdeCache(
                        request
                    );


                if (cache) {

                    return cache;

                }


                try {

                    const respuesta =
                        await fetch(
                            request
                        );


                    if (
                        respuesta &&
                        respuesta.ok
                    ) {

                        await guardarEnCache(
                            request,
                            respuesta
                        );

                    }


                    return respuesta;

                } catch (error) {

                    return new Response(
                        "",
                        {
                            status: 503
                        }
                    );

                }

            })()

        );

    }
);


// =====================================================
// AVISAR A LAS PÁGINAS ABIERTAS
// =====================================================

async function avisarActualizacion() {

    try {

        const clientes =
            await self.clients.matchAll(
                {
                    type:
                        "window",

                    includeUncontrolled:
                        true
                }
            );


        clientes.forEach(
            cliente => {

                cliente.postMessage({

                    type:
                        "NUEVA_VERSION_DISPONIBLE",

                    version:
                        CACHE_VERSION

                });

            }
        );

    } catch (error) {

        console.warn(
            "[Mi Tienda] No se pudo avisar actualización:",
            error
        );

    }

}


// =====================================================
// CONTROL DE ACTIVACIÓN
// =====================================================

self.addEventListener(
    "controllerchange",
    () => {

        console.log(
            "[Mi Tienda] Nueva versión activada:",
            CACHE_VERSION
        );

    }
);