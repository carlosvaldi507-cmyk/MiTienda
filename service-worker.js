// =====================================================
// MI TIENDA - SERVICE WORKER
// ACTUALIZACIÓN AUTOMÁTICA Y CACHÉ INTELIGENTE
// =====================================================

// Cambia este identificador en cada publicación. Nunca se mezclan archivos
// de dos versiones distintas de la tienda.
const CACHE_VERSION = "todo-klick-v65";


// =====================================================
// ARCHIVOS BÁSICOS
// =====================================================

const ARCHIVOS = [
    "./",
    "./index.html",
    "./catalogo.html",
    "./firebase-config.js?v=1.0.1",
    "./firebase-cloud.js?v=1.1.1",
    "./style.css?v=1.9.5",
    "./script.js?v=2.0.5",
    "./productos.js?v=1.9.1",
    "./funciones-inteligentes.js?v=1.4.5",
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
    "/script.js",
    "/productos.js"
    ,"/funciones-inteligentes.js"
];


// =====================================================
// INSTALACIÓN
// =====================================================

self.addEventListener("install", event => {

    console.log(
        "[Todo Klick] Instalando:",
        CACHE_VERSION
    );

    event.waitUntil(

        caches.open(CACHE_VERSION)

            .then(async cache => {

                // Cada archivo se obtiene desde la red. Así una nueva caché
                // no puede quedar formada con copias antiguas del navegador.
                await Promise.all(ARCHIVOS.map(async archivo => {
                    const respuesta = await fetch(
                        new Request(archivo, { cache: "no-store" })
                    );

                    if (!respuesta.ok) {
                        throw new Error(`No se pudo precargar ${archivo}.`);
                    }

                    await cache.put(archivo, respuesta);
                }));

            })

            .then(() => {

                // Activar inmediatamente
                return self.skipWaiting();

            })

            .catch(error => {

                console.error(
                    "[Todo Klick] Error instalando caché:",
                    error
                );

                throw error;

            })

    );

});

// =====================================================
// ACTIVACIÓN
// =====================================================

self.addEventListener("activate", event => {

    console.log(
        "[Todo Klick] Activando:",
        CACHE_VERSION
    );


    event.waitUntil(

        caches.keys()

            .then(keys => {

                return Promise.all(

                    keys
                        .filter(key => {

                            return (
                                (
                                    key.startsWith("mi-tienda-") ||
                                    key.startsWith("todo-klick-")
                                ) &&
                                key !== CACHE_VERSION
                            );

                        })

                        .map(key => {

                            console.log(
                                "[Todo Klick] Eliminando caché antigua:",
                                key
                            );

                            return caches.delete(key);

                        })

                );

            })

            .then(() => {

                // Tomar el control de las páginas inmediatamente
                return self.clients.claim();

            })

            .then(() => {

                // Avisar a las páginas que existe una nueva versión
                return avisarActualizacion();

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

    const nombreArchivo =
        pathname.split("/").pop();


    return (
        request.mode === "navigate" ||
        pathname.endsWith("/") ||
        ARCHIVOS_SIEMPRE_ACTUALIZADOS.some(function (archivo) {
            return archivo !== "/" &&
                archivo.split("/").pop() === nombreArchivo;
        })
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
            "[Todo Klick] No se pudo guardar:",
            error
        );

    }

}


// =====================================================
// OBTENER ARCHIVO DESDE CACHÉ
// =====================================================

async function obtenerDesdeCache(
    request,
    ignorarVersion = false
) {

    try {

        const cache = await caches.open(CACHE_VERSION);

        return await cache.match(
            request,
            { ignoreSearch: ignorarVersion }
        );

    } catch (error) {

        console.warn(
            "[Todo Klick] Error leyendo caché:",
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

            <title>Todo Klick</title>

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
                    Todo Klick
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
        // IMÁGENES DE PRODUCTO / MARCA
        // NETWORK FIRST PARA MOSTRAR ACTUALIZACIONES
        // =================================================

        if (
            request.destination === "image"
        ) {

            event.respondWith(

                (async () => {

                    try {

                        const solicitud = new Request(
                            request,
                            { cache: "reload" }
                        );

                        const respuesta = await fetch(solicitud);
                        const tipoContenido = respuesta.headers.get("Content-Type") || "";

                        if (
                            !respuesta.ok ||
                            !tipoContenido.toLowerCase().startsWith("image/")
                        ) {
                            throw new Error("El servidor no devolvió una imagen válida.");
                        }

                        await guardarEnCache(request, respuesta);
                        return respuesta;

                    } catch (error) {

                        const cache = await obtenerDesdeCache(request, true);

                        if (cache) {
                            return cache;
                        }

                        return new Response("", {
                            status: 503,
                            statusText: "Imagen no disponible"
                        });

                    }

                })()

            );

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
                            "[Todo Klick] Sin Internet. Buscando copia guardada."
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
        // ICONOS Y OTROS RECURSOS
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
            await self.clients.matchAll({
                type: "window",
                includeUncontrolled: true
            });


        clientes.forEach(cliente => {

            cliente.postMessage({

                type: "NUEVA_VERSION_DISPONIBLE",

                version: CACHE_VERSION

            });

        });


    } catch (error) {

        console.warn(
            "[Todo Klick] No se pudo avisar actualización:",
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
            "[Todo Klick] Nueva versión activada:",
            CACHE_VERSION
        );

    }
);
