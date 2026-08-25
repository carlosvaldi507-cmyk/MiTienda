// =====================================================
// MI TIENDA
// SISTEMA GENERAL
// =====================================================


// =====================================================
// CONFIGURACIÓN GENERAL
// =====================================================

const NUMERO_WHATSAPP = "50576823472";

const MONTO_ENVIO_GRATIS = 5000;


// =====================================================
// CARRITO
// =====================================================

function normalizarCarrito(valor) {

    if (!Array.isArray(valor)) {
        return [];
    }

    return valor.reduce(function (productosValidos, producto) {

        const precio = Number(producto?.precio);
        const cantidad = Number(producto?.cantidad);

        const cantidadNormalizada =
            Math.floor(cantidad);

        if (
            typeof producto?.nombre !== "string" ||
            !Number.isFinite(precio) ||
            !Number.isFinite(cantidad) ||
            cantidadNormalizada <= 0
        ) {
            return productosValidos;
        }

        productosValidos.push({

            nombre:
                producto.nombre,

            precio:
                precio,

            cantidad:
                cantidadNormalizada

        });

        return productosValidos;

    }, []);

}


function obtenerCarritoGuardado() {

    try {

        return normalizarCarrito(
            JSON.parse(
                localStorage.getItem("carrito") || "[]"
            )
        );

    } catch (error) {

        console.warn(
            "No se pudo leer el carrito guardado.",
            error
        );

        return [];

    }

}


let carrito =
    obtenerCarritoGuardado();


let cuponAplicado =
    localStorage.getItem("cuponMiTienda") || "";


// =====================================================
// RESUMEN DE COMPRA
// =====================================================

function obtenerResumenCompra() {

    const subtotal =
        carrito.reduce(
            function (total, producto) {

                return total +
                    (
                        producto.precio *
                        producto.cantidad
                    );

            },
            0
        );


    const descuento =
        cuponAplicado === "BIENVENIDA10"
            ? Math.round(
                subtotal * 0.10
            )
            : 0;


    return {

        subtotal:
            subtotal,

        descuento:
            descuento,

        total:
            Math.max(
                0,
                subtotal - descuento
            )

    };

}


// =====================================================
// PAÍS Y MONEDA
// =====================================================
//
// Los precios originales de los productos están
// almacenados en CÓRDOBAS NICARAGÜENSES (NIO).
//
// tasa = cantidad aproximada de moneda extranjera
// equivalente a 1 C$.
//
// Son tasas de referencia.
// No representan una cotización bancaria en tiempo real.
// =====================================================

const configuracionMonedas = {

    NI: {

        pais:
            "Nicaragua",

        bandera:
            "🇳🇮",

        moneda:
            "NIO",

        simbolo:
            "C$",

        locale:
            "es-NI",

        tasa:
            1

    },


    US: {

        pais:
            "Estados Unidos",

        bandera:
            "🇺🇸",

        moneda:
            "USD",

        simbolo:
            "US$",

        locale:
            "en-US",

        // 1 NIO ≈ 0.02725 USD

        tasa:
            0.02725

    },


    CA: {

        pais:
            "Canadá",

        bandera:
            "🇨🇦",

        moneda:
            "CAD",

        simbolo:
            "CA$",

        locale:
            "en-CA",

        // 1 NIO ≈ 0.0373 CAD

        tasa:
            0.0373

    },


    MX: {

        pais:
            "México",

        bandera:
            "🇲🇽",

        moneda:
            "MXN",

        simbolo:
            "MX$",

        locale:
            "es-MX",

        tasa:
            0.543

    },


    CR: {

        pais:
            "Costa Rica",

        bandera:
            "🇨🇷",

        moneda:
            "CRC",

        simbolo:
            "₡",

        locale:
            "es-CR",

        tasa:
            13.65

    },


    HN: {

        pais:
            "Honduras",

        bandera:
            "🇭🇳",

        moneda:
            "HNL",

        simbolo:
            "L",

        locale:
            "es-HN",

        tasa:
            0.684

    },


    GT: {

        pais:
            "Guatemala",

        bandera:
            "🇬🇹",

        moneda:
            "GTQ",

        simbolo:
            "Q",

        locale:
            "es-GT",

        tasa:
            0.211

    },


    PA: {

        pais:
            "Panamá",

        bandera:
            "🇵🇦",

        moneda:
            "USD",

        simbolo:
            "B/.",

        locale:
            "es-PA",

        // Panamá utiliza USD.
        // 1 NIO ≈ 0.02725 USD.

        tasa:
            0.02725

    },


    CO: {

        pais:
            "Colombia",

        bandera:
            "🇨🇴",

        moneda:
            "COP",

        simbolo:
            "COP$",

        locale:
            "es-CO",

        tasa:
            110

    },


    BR: {

        pais:
            "Brasil",

        bandera:
            "🇧🇷",

        moneda:
            "BRL",

        simbolo:
            "R$",

        locale:
            "pt-BR",

        tasa:
            0.15

    },


    ES: {

        pais:
            "España",

        bandera:
            "🇪🇸",

        moneda:
            "EUR",

        simbolo:
            "€",

        locale:
            "es-ES",

        tasa:
            0.0235

    },


    GB: {

        pais:
            "Reino Unido",

        bandera:
            "🇬🇧",

        moneda:
            "GBP",

        simbolo:
            "£",

        locale:
            "en-GB",

        tasa:
            0.0202

    },


    JP: {

        pais:
            "Japón",

        bandera:
            "🇯🇵",

        moneda:
            "JPY",

        simbolo:
            "¥",

        locale:
            "ja-JP",

        tasa:
            4.05

    },


    CN: {

        pais:
            "China",

        bandera:
            "🇨🇳",

        moneda:
            "CNY",

        simbolo:
            "¥",

        locale:
            "zh-CN",

        tasa:
            0.196

    },


    TW: {

        pais:
            "Taiwán",

        bandera:
            "🇹🇼",

        moneda:
            "TWD",

        simbolo:
            "NT$",

        locale:
            "zh-TW",

        tasa:
            0.86

    },


    HK: {

        pais:
            "Hong Kong",

        bandera:
            "🇭🇰",

        moneda:
            "HKD",

        simbolo:
            "HK$",

        locale:
            "zh-HK",

        tasa:
            0.211

    }

};


// =====================================================
// PAÍS ACTUAL
// =====================================================

let paisSeleccionado =
    localStorage.getItem(
        "paisMiTienda"
    ) || "NI";


if (
    !configuracionMonedas[
        paisSeleccionado
    ]
) {

    paisSeleccionado =
        "NI";

}


// =====================================================
// OBTENER MONEDA ACTUAL
// =====================================================

function obtenerMonedaActual() {

    return (
        configuracionMonedas[
            paisSeleccionado
        ] ||
        configuracionMonedas.NI
    );

}


// =====================================================
// CONVERTIR PRECIO
// =====================================================

function convertirPrecio(
    precioCordobas
) {

    const moneda =
        obtenerMonedaActual();


    const precio =
        Number(
            precioCordobas
        ) || 0;


    return (
        precio *
        moneda.tasa
    );

}


// =====================================================
// FORMATEAR MONEDA
// =====================================================

function formatoMoneda(
    valor
) {

    const moneda =
        obtenerMonedaActual();


    const convertido =
        convertirPrecio(
            valor
        );


    const decimales =
        moneda.moneda === "NIO"
            ? 0
            : moneda.moneda === "JPY"
                ? 0
                : 2;


    const numero =
        convertido.toLocaleString(
            moneda.locale,
            {

                minimumFractionDigits:
                    decimales,

                maximumFractionDigits:
                    decimales

            }
        );


    return (
        moneda.simbolo +
        " " +
        numero
    );

}


// =====================================================
// CAMBIAR PAÍS
// =====================================================

// =====================================================
// CAMBIAR PAÍS / MONEDA
// =====================================================

function cambiarPais(codigoPais) {

    // Verificar que la moneda exista
    if (
        !configuracionMonedas[codigoPais]
    ) {
        return;
    }


    // =================================================
    // ACTUALIZAR SISTEMA PRINCIPAL
    // =================================================

    paisSeleccionado =
        codigoPais;


    localStorage.setItem(
        "paisMiTienda",
        codigoPais
    );


    // =================================================
    // SINCRONIZAR SISTEMA INTERNACIONAL
    // =================================================

    if (
        window.MiTiendaInternacional &&
        typeof window.MiTiendaInternacional.cambiarPais ===
        "function"
    ) {

        window.MiTiendaInternacional.cambiarPais(
            codigoPais
        );

    }


    // =================================================
    // ACTUALIZAR SELECTOR
    // =================================================

    actualizarSelectorMoneda();


    // =================================================
    // ACTUALIZAR PRECIOS DE PRODUCTOS
    // =================================================

    actualizarPreciosPagina();


    // =================================================
    // ACTUALIZAR CARRITO
    // =================================================

    if (
        typeof mostrarCarrito ===
        "function"
    ) {

        mostrarCarrito();

    }


    // =================================================
    // ACTUALIZAR CONTADOR
    // =================================================

    actualizarContador();

}


// =====================================================
// SELECTOR DE MONEDA
// =====================================================

function crearSelectorMoneda() {

    // =================================================
    // LIMPIAR SELECTORES DE MONEDA DUPLICADOS
    // =================================================

    const selectores =
        Array.from(
            document.querySelectorAll(
                "#selector-moneda, [data-selector-moneda]"
            )
        );

    let selector =
        selectores[0] || null;


    // =================================================
    // ELIMINAR LOS DUPLICADOS
    // =================================================

    selectores.forEach(
        function (elemento, indice) {

            if (indice > 0) {

                elemento.remove();

            }

        }
    );


    // =================================================
    // SI NO EXISTE, CREAR UNO
    // =================================================

    if (!selector) {

        selector =
            document.createElement(
                "select"
            );

        selector.id =
            "selector-moneda";

        selector.setAttribute(
            "aria-label",
            "Seleccionar país y moneda"
        );


        Object.keys(
            configuracionMonedas
        ).forEach(
            function (codigo) {

                const moneda =
                    configuracionMonedas[
                        codigo
                    ];

                const opcion =
                    document.createElement(
                        "option"
                    );

                opcion.value =
                    codigo;

                opcion.textContent =
                    moneda.bandera +
                    " " +
                    moneda.pais +
                    " (" +
                    moneda.moneda +
                    ")";

                selector.appendChild(
                    opcion
                );

            }
        );


        const lugar =
            document.querySelector(
                ".selector-idioma"
            ) ||
            document.querySelector(
                "header"
            ) ||
            document.body;


        lugar.appendChild(
            selector
        );

    }


    // =================================================
    // ASEGURAR ID ÚNICO
    // =================================================

    selector.id =
        "selector-moneda";


    // =================================================
    // CONECTAR EVENTOS
    // =================================================

   selector.addEventListener(
    "change",
    function () {

        cambiarPais(
            this.value
        );

    }
);

actualizarSelectorMoneda();


}


// =====================================================
// ACTUALIZAR SELECTOR
// =====================================================

function actualizarSelectorMoneda() {

    const selector =
        document.getElementById(
            "selector-moneda"
        );


    if (selector) {

        selector.value =
            paisSeleccionado;

    }


    document
        .querySelectorAll(
            "[data-pais]"
        )
        .forEach(
            function (boton) {

                boton.classList.toggle(
                    "pais-activo",
                    boton.dataset.pais ===
                    paisSeleccionado
                );

            }
        );

}


// =====================================================
// ACTUALIZAR PRECIOS
// =====================================================

function actualizarPreciosPagina() {

    const botones =
        document.querySelectorAll(
            ".agregar-carrito"
        );


    botones.forEach(
        function (boton) {

            const precio =
                Number(
                    boton.dataset.precio
                );


            if (
                !Number.isFinite(
                    precio
                )
            ) {

                return;

            }


            const tarjeta =
                boton.closest(
                    ".producto"
                );


            if (!tarjeta) {

                return;

            }


            const precioElemento =
                tarjeta.querySelector(
                    "strong"
                );


            if (
                precioElemento
            ) {

                precioElemento.textContent =
                    formatoMoneda(
                        precio
                    );

            }

        }
    );

}


// =====================================================
// GUARDAR CARRITO
// =====================================================

function guardarCarrito() {

    try {

        localStorage.setItem(
            "carrito",
            JSON.stringify(
                carrito
            )
        );

    } catch (error) {

        console.error(
            "No se pudo guardar el carrito.",
            error
        );

    }

}


// =====================================================
// CANTIDAD DEL CARRITO
// =====================================================

function obtenerCantidadCarrito() {

    return carrito.reduce(
        function (
            total,
            producto
        ) {

            return total +
                Number(
                    producto.cantidad ||
                    0
                );

        },
        0
    );

}


// =====================================================
// CONTADOR
// =====================================================

// =====================================================
// CONTADOR Y VISIBILIDAD DEL CARRITO FLOTANTE
// =====================================================

function actualizarContador() {

    const cantidad =
        obtenerCantidadCarrito();


    // =================================================
    // CONTADOR DEL CARRITO PRINCIPAL
    // =================================================

    const contador =
        document.getElementById(
            "contador-carrito"
        );


    if (contador) {

        contador.textContent =
            cantidad;

    }


    // =================================================
    // CONTADOR DEL CARRITO FLOTANTE
    // =================================================

    const contadorFlotante =
        document.getElementById(
            "contador-carrito-flotante"
        );


    if (contadorFlotante) {

        contadorFlotante.textContent =
            cantidad;

    }


    // =================================================
    // MOSTRAR / OCULTAR CARRITO FLOTANTE
    // =================================================

    const carritoFlotante =
        document.getElementById(
            "carrito-flotante"
        );


    if (carritoFlotante) {

        if (cantidad > 0) {

            // Hay productos:
            // mostrar carrito flotante

            carritoFlotante.style.setProperty(
                "display",
                "flex",
                "important"
            );

            carritoFlotante.setAttribute(
                "aria-hidden",
                "false"
            );

        } else {

            // No hay productos:
            // ocultar carrito flotante

            carritoFlotante.style.setProperty(
                "display",
                "none",
                "important"
            );

            carritoFlotante.setAttribute(
                "aria-hidden",
                "true"
            );

        }

    }

}

// =====================================================
// CARRITO COMPARTIDO
// =====================================================

function obtenerEnlaceCarrito() {

    try {

        const datos =
            encodeURIComponent(
                btoa(
                    unescape(
                        encodeURIComponent(
                            JSON.stringify(
                                carrito
                            )
                        )
                    )
                )
            );


        const url =
            new URL(
                window.location.href
            );


        url.searchParams.set(
            "carrito",
            datos
        );


        return url.toString();

    } catch (error) {

        return window.location.href;

    }

}


// =====================================================
// CARGAR CARRITO COMPARTIDO
// =====================================================

function cargarCarritoCompartido() {

    const codigo =
        new URLSearchParams(
            window.location.search
        ).get(
            "carrito"
        );


    if (!codigo) {

        return;

    }


    try {

        const recibido =
            normalizarCarrito(
                JSON.parse(
                    decodeURIComponent(
                        escape(
                            atob(
                                decodeURIComponent(
                                    codigo
                                )
                            )
                        )
                    )
                )
            );


        if (
            !recibido.length
        ) {

            return;

        }


        carrito =
            recibido;


        guardarCarrito();


        window.history.replaceState(
            {},
            document.title,
            window.location.pathname +
            window.location.hash
        );


    } catch (error) {

        console.warn(
            "No se pudo cargar el carrito compartido.",
            error
        );

    }

}


// =====================================================
// CARRITO FLOTANTE
// =====================================================

function configurarControlesCarritoFlotante() {

    const botonFlotante =
        document.getElementById(
            "carrito-flotante"
        );


    const botonVerCarrito =
        document.getElementById(
            "ver-carrito-notificacion"
        );


    if (
        botonFlotante &&
        botonFlotante.dataset.carritoConfigurado !==
        "true"
    ) {

        botonFlotante.dataset.carritoConfigurado =
            "true";


        botonFlotante.addEventListener(
            "click",
            abrirCarrito
        );

    }


    if (
        botonVerCarrito &&
        botonVerCarrito.dataset.carritoConfigurado !==
        "true"
    ) {

        botonVerCarrito.dataset.carritoConfigurado =
            "true";


        botonVerCarrito.addEventListener(
            "click",
            function () {

                abrirCarrito();

                ocultarNotificacion();

            }
        );

    }

}


// =====================================================
// CREAR CARRITO FLOTANTE
// =====================================================

function crearCarritoFlotante() {

    if (
        document.getElementById(
            "carrito-flotante"
        )
    ) {

        configurarControlesCarritoFlotante();

        actualizarContador();

        return;

    }


    const estilos =
        document.createElement(
            "style"
        );


    estilos.id =
        "estilos-carrito-flotante";


    estilos.textContent = `

        .carrito-flotante {

    position: fixed !important;

    right: 20px !important;

    bottom: 105px !important;

    width: 62px;

    height: 62px;

    border: none;

    border-radius: 50%;

    background: #0d5c72;

    color: white;

    display: flex;

    align-items: center;

    justify-content: center;

    cursor: pointer;

    z-index: 99990;

    box-shadow:
        0 8px 25px rgba(0,0,0,0.25);

    transition:
        transform .2s ease,
        box-shadow .2s ease;

}

        .carrito-flotante:hover {

            transform:
                translateY(-4px);

        }


        .icono-carrito-flotante {

            font-size:27px;

        }


        .contador-carrito-flotante {

            position:absolute;

            top:-4px;

            right:-4px;

            min-width:26px;

            height:26px;

            padding:0 6px;

            border-radius:50px;

            background:#f5a623;

            color:white;

            border:2px solid white;

            display:flex;

            align-items:center;

            justify-content:center;

            font-size:12px;

            font-weight:800;

        }


        .carrito-flotante.animar {

            animation:
                rebote-carrito .45s ease;

        }


        @keyframes rebote-carrito {

            0% {
                transform:scale(1);
            }

            35% {
                transform:scale(1.18);
            }

            65% {
                transform:scale(.94);
            }

            100% {
                transform:scale(1);
            }

        }


        .notificacion-carrito {

            position:fixed;

            right:20px;

            bottom:95px;

            width:min(
                380px,
                calc(100% - 30px)
            );

            padding:14px;

            background:white;

            border:
                1px solid #e5e9eb;

            border-radius:16px;

            box-shadow:
                0 12px 35px rgba(0,0,0,.18);

            display:flex;

            align-items:center;

            gap:12px;

            z-index:9999;

            opacity:0;

            visibility:hidden;

            transform:
                translateY(15px);

            transition:.25s ease;

        }


        .notificacion-carrito.mostrar {

            opacity:1;

            visibility:visible;

            transform:
                translateY(0);

        }


        .notificacion-icono {

            width:40px;

            height:40px;

            min-width:40px;

            border-radius:50%;

            background:#25d366;

            color:white;

            display:flex;

            align-items:center;

            justify-content:center;

            font-size:21px;

            font-weight:800;

        }


        .notificacion-texto {

            flex:1;

            min-width:0;

            display:flex;

            flex-direction:column;

            gap:3px;

        }


        .notificacion-texto strong {

            color:#123b4a;

            font-size:14px;

        }


        .notificacion-texto span {

            color:#697b83;

            font-size:13px;

            white-space:nowrap;

            overflow:hidden;

            text-overflow:ellipsis;

        }


        .ver-carrito-notificacion {

            border:none;

            border-radius:9px;

            padding:9px 12px;

            background:#0d5c72;

            color:white;

            font-size:12px;

            font-weight:700;

            cursor:pointer;

            white-space:nowrap;

        }


        @media(max-width:600px) {

    .carrito-flotante {

        width: 58px;
        height: 58px;
        right: 14px;
        bottom: 88px !important;
        z-index: 99990;

    }

    .notificacion-carrito {

        right: 15px;
        bottom: 82px;
        width: calc(100% - 30px);

    }

}

    `;


    document.head.appendChild(
        estilos
    );


    const boton =
        document.createElement(
            "button"
        );


    boton.id =
        "carrito-flotante";


    boton.className =
        "carrito-flotante";


    boton.type =
        "button";


    boton.setAttribute(
        "aria-label",
        "Abrir carrito"
    );


    boton.innerHTML = `

        <span
            class="icono-carrito-flotante"
        >
            🛒
        </span>


        <span
            id="contador-carrito-flotante"
            class="contador-carrito-flotante"
        >
            0
        </span>

    `;


    document.body.appendChild(
        boton
    );


    const notificacion =
        document.createElement(
            "div"
        );


    notificacion.id =
        "notificacion-carrito";


    notificacion.className =
        "notificacion-carrito";


    notificacion.setAttribute(
        "role",
        "status"
    );


    notificacion.setAttribute(
        "aria-live",
        "polite"
    );


    notificacion.innerHTML = `

        <div class="notificacion-icono">
            ✓
        </div>


        <div class="notificacion-texto">

            <strong>
                Producto agregado
            </strong>


            <span
                id="nombre-producto-agregado"
            >
                Producto
            </span>

        </div>


        <button
            id="ver-carrito-notificacion"
            type="button"
            class="ver-carrito-notificacion"
        >
            Ver carrito
        </button>

    `;


    document.body.appendChild(
        notificacion
    );


    configurarControlesCarritoFlotante();

    actualizarContador();

}


// =====================================================
// ABRIR CARRITO
// =====================================================

function abrirCarrito() {

    const ventana =
        document.getElementById(
            "ventana-carrito"
        );


    if (!ventana) {

        return;

    }


    ventana.style.display =
        "flex";


    mostrarCarrito();

}


// =====================================================
// NOTIFICACIÓN DE PRODUCTO
// =====================================================

let temporizadorNotificacion;


function mostrarNotificacionProducto(
    nombre
) {

    const notificacion =
        document.getElementById(
            "notificacion-carrito"
        );


    const nombreElemento =
        document.getElementById(
            "nombre-producto-agregado"
        );


    if (
        !notificacion ||
        !nombreElemento
    ) {

        return;

    }


    nombreElemento.textContent =
        nombre;


    notificacion.classList.add(
        "mostrar"
    );


    const boton =
        document.getElementById(
            "carrito-flotante"
        );


    if (boton) {

        boton.classList.remove(
            "animar"
        );


        void boton.offsetWidth;


        boton.classList.add(
            "animar"
        );

    }


    clearTimeout(
        temporizadorNotificacion
    );


    temporizadorNotificacion =
        setTimeout(
            ocultarNotificacion,
            3500
        );

}


function ocultarNotificacion() {

    const notificacion =
        document.getElementById(
            "notificacion-carrito"
        );


    if (notificacion) {

        notificacion.classList.remove(
            "mostrar"
        );

    }

}


// =====================================================
// BOTONES AGREGAR AL CARRITO
// =====================================================

function configurarBotonesAgregar() {

    const botones =
        document.querySelectorAll(
            ".agregar-carrito"
        );


    botones.forEach(
        function (boton) {

            if (
                boton.dataset.carritoConfigurado ===
                "true"
            ) {

                return;

            }


            boton.dataset.carritoConfigurado =
                "true";


            boton.addEventListener(
                "click",
                function () {

                    const nombre =
                        boton.dataset.nombre ||
                        boton.closest(
                            ".producto"
                        )
                        ?.querySelector(
                            "h3"
                        )
                        ?.textContent
                        ?.trim() ||
                        "Producto";


                    const precio =
                        Number(
                            boton.dataset.precio
                        );


                    if (
                        !Number.isFinite(
                            precio
                        )
                    ) {

                        console.error(
                            "El producto no tiene un precio válido."
                        );

                        return;

                    }


                    const existente =
                        carrito.find(
                            function (
                                producto
                            ) {

                                return (
                                    producto.nombre ===
                                    nombre
                                );

                            }
                        );


                    if (existente) {

                        existente.cantidad++;

                    } else {

                        carrito.push({

                            nombre:
                                nombre,

                            precio:
                                precio,

                            cantidad:
                                1

                        });

                    }


                    guardarCarrito();

                    actualizarContador();

                    mostrarCarrito();

                    mostrarNotificacionProducto(
                        nombre
                    );

                }
            );

        }
    );

}


// =====================================================
// BOTÓN PRINCIPAL DEL CARRITO
// =====================================================

const botonCarrito =
    document.getElementById(
        "boton-carrito"
    );


const ventanaCarrito =
    document.getElementById(
        "ventana-carrito"
    );


if (
    botonCarrito &&
    ventanaCarrito
) {

    botonCarrito.addEventListener(
        "click",
        abrirCarrito
    );

}


// =====================================================
// CERRAR CARRITO
// =====================================================

const cerrarCarrito =
    document.getElementById(
        "cerrar-carrito"
    );


if (
    cerrarCarrito &&
    ventanaCarrito
) {

    cerrarCarrito.addEventListener(
        "click",
        function () {

            ventanaCarrito.style.display =
                "none";

        }
    );

}


if (ventanaCarrito) {

    ventanaCarrito.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target ===
                ventanaCarrito
            ) {

                ventanaCarrito.style.display =
                    "none";

            }

        }
    );

}


// =====================================================
// IDIOMAS
// =====================================================

const traducciones = {

    es: {

        nombre:
            "Español",

        ofertaSuperior:
            "Ofertas especiales de Mi Tienda",

        eslogan:
            "Soluciones para tu hogar y negocio",

        entrar:
            "Entrar",

        carrito:
            "Carrito",

        inicio:
            "Inicio",

        categorias:
            "Categorías",

        promociones:
            "Promociones",

        catalogo:
            "Catálogo",

        comprar:
            "Comprar",

        oferta:
            "OFERTA",

        tituloOferta:
            "Grandes promociones",

        textoOferta:
            "Encuentra productos de calidad para tu hogar y negocio.",

        comprarAhora:
            "Comprar ahora →",

        seguridad:
            "SEGURIDAD",

        tituloSeguridad:
            "Protege lo que más importa",

        textoSeguridad:
            "Soluciones de seguridad para tu hogar y negocio.",

        verProductos:
            "Ver productos",

        herramientas:
            "HERRAMIENTAS",

        tituloHerramientas:
            "Todo para tus proyectos",

        textoHerramientas:
            "Encuentra herramientas para instalación y mantenimiento.",

        verCatalogo:
            "Ver catálogo →",

        explora:
            "EXPLORA",

        tituloCategorias:
            "Compra por categorías",

        ferreteria:
            "Ferretería",

        herramientasCategoria:
            "Herramientas",

        electrico:
            "Eléctrico",

        hogar:
            "Hogar",

        bano:
            "Baño",

        destacados:
            "DESTACADOS",

        productosDestacados:
            "Productos destacados",

        descripcionDestacados:
            "Algunos de nuestros productos disponibles.",

        agregarCarrito:
            "Agregar al carrito",

        verCatalogoCompleto:
            "Ver catálogo completo →",

        necesitasAyuda:
            "¿NECESITAS AYUDA?",

        estamosAyudarte:
            "Estamos para ayudarte",

        textoWhatsApp:
            "Consulta disponibilidad, precios o realiza tu pedido directamente por WhatsApp.",

        escribirWhatsApp:
            "Escribir por WhatsApp",

        miCarrito:
            "🛒 Mi carrito",

        carritoVacio:
            "Tu carrito está vacío.",

        total:
            "Total:",

        finalizarWhatsApp:
            "Finalizar compra por WhatsApp",

        atencionCliente:
            "Atención al cliente",

        comoComprar:
            "Cómo comprar",

        contactarnos:
            "Contactarnos",

        preguntas:
            "Preguntas frecuentes",

        terminos:
            "Términos y condiciones",

        miTienda:
            "Mi tienda",

        productos:
            "Productos",

        informacion:
            "Información",

        sobreNosotros:
            "Sobre nosotros",

        formasPago:
            "Formas de pago",

        informacionEnvio:
            "Información de envío",

        privacidad:
            "Política de privacidad",

        contacto:
            "Contacto",

        whatsapp:
            "WhatsApp",

        facebook:
            "Facebook",

        instagram:
            "Instagram",

        escribenos:
            "Escríbenos",

        derechos:
            "© 2026 Mi Tienda — Todos los derechos reservados",

        comprasSeguras:
            "Compras fáciles, rápidas y seguras."

    },


    en: {

        nombre:
            "English",

        ofertaSuperior:
            "Special offers from My Store",

        eslogan:
            "Solutions for your home and business",

        entrar:
            "Login",

        carrito:
            "Cart",

        inicio:
            "Home",

        categorias:
            "Categories",

        promociones:
            "Promotions",

        catalogo:
            "Catalog",

        comprar:
            "Shop",

        oferta:
            "OFFER",

        tituloOferta:
            "Great promotions",

        textoOferta:
            "Find quality products for your home and business.",

        comprarAhora:
            "Shop now →",

        seguridad:
            "SECURITY",

        tituloSeguridad:
            "Protect what matters most",

        textoSeguridad:
            "Security solutions for your home and business.",

        verProductos:
            "View products",

        herramientas:
            "TOOLS",

        tituloHerramientas:
            "Everything for your projects",

        textoHerramientas:
            "Find tools for installation and maintenance.",

        verCatalogo:
            "View catalog →",

        explora:
            "EXPLORE",

        tituloCategorias:
            "Shop by category",

        ferreteria:
            "Hardware",

        herramientasCategoria:
            "Tools",

        electrico:
            "Electrical",

        hogar:
            "Home",

        bano:
            "Bathroom",

        destacados:
            "FEATURED",

        productosDestacados:
            "Featured products",

        descripcionDestacados:
            "Some of our available products.",

        agregarCarrito:
            "Add to cart",

        verCatalogoCompleto:
            "View full catalog →",

        necesitasAyuda:
            "NEED HELP?",

        estamosAyudarte:
            "We're here to help",

        textoWhatsApp:
            "Check availability, prices or place your order directly through WhatsApp.",

        escribirWhatsApp:
            "Chat on WhatsApp",

        miCarrito:
            "🛒 My cart",

        carritoVacio:
            "Your cart is empty.",

        total:
            "Total:",

        finalizarWhatsApp:
            "Checkout via WhatsApp",

        atencionCliente:
            "Customer service",

        comoComprar:
            "How to buy",

        contactarnos:
            "Contact us",

        preguntas:
            "Frequently asked questions",

        terminos:
            "Terms and conditions",

        miTienda:
            "My store",

        productos:
            "Products",

        informacion:
            "Information",

        sobreNosotros:
            "About us",

        formasPago:
            "Payment methods",

        informacionEnvio:
            "Shipping information",

        privacidad:
            "Privacy policy",

        contacto:
            "Contact",

        whatsapp:
            "WhatsApp",

        facebook:
            "Facebook",

        instagram:
            "Instagram",

        escribenos:
            "Contact us",

        derechos:
            "© 2026 My Store — All rights reserved",

        comprasSeguras:
            "Easy, fast and secure shopping."

    },


    fr: {

        nombre:
            "Français",

        ofertaSuperior:
            "Offres spéciales de Ma Boutique",

        eslogan:
            "Solutions pour votre maison et votre entreprise",

        entrar:
            "Connexion",

        carrito:
            "Panier",

        inicio:
            "Accueil",

        categorias:
            "Catégories",

        promociones:
            "Promotions",

        catalogo:
            "Catalogue",

        comprar:
            "Acheter",

        oferta:
            "OFFRE",

        tituloOferta:
            "Grandes promotions",

        textoOferta:
            "Trouvez des produits de qualité pour votre maison et votre entreprise.",

        comprarAhora:
            "Acheter maintenant →",

        seguridad:
            "SÉCURITÉ",

        tituloSeguridad:
            "Protégez ce qui compte le plus",

        textoSeguridad:
            "Solutions pour votre maison et votre entreprise.",

        verProductos:
            "Voir les produits",

        herramientas:
            "OUTILS",

        tituloHerramientas:
            "Tout pour vos projets",

        textoHerramientas:
            "Trouvez des outils pour l'installation et la maintenance.",

        verCatalogo:
            "Voir le catalogue →",

        explora:
            "EXPLORER",

        tituloCategorias:
            "Acheter par catégorie",

        ferreteria:
            "Quincaillerie",

        herramientasCategoria:
            "Outils",

        electrico:
            "Électrique",

        hogar:
            "Maison",

        bano:
            "Salle de bain",

        destacados:
            "EN VEDETTE",

        productosDestacados:
            "Produits en vedette",

        descripcionDestacados:
            "Quelques-uns de nos produits disponibles.",

        agregarCarrito:
            "Ajouter au panier",

        verCatalogoCompleto:
            "Voir le catalogue complet →",

        necesitasAyuda:
            "BESOIN D'AIDE ?",

        estamosAyudarte:
            "Nous sommes là pour vous aider",

        textoWhatsApp:
            "Consultez la disponibilité, les prix ou passez votre commande directement sur WhatsApp.",

        escribirWhatsApp:
            "Écrire sur WhatsApp",

        miCarrito:
            "🛒 Mon panier",

        carritoVacio:
            "Votre panier est vide.",

        total:
            "Total:",

        finalizarWhatsApp:
            "Commander via WhatsApp",

        atencionCliente:
            "Service client",

        comoComprar:
            "Comment acheter",

        contactarnos:
            "Nous contacter",

        preguntas:
            "Questions fréquentes",

        terminos:
            "Conditions générales",

        miTienda:
            "Ma boutique",

        productos:
            "Produits",

        informacion:
            "Informations",

        sobreNosotros:
            "À propos de nous",

        formasPago:
            "Modes de paiement",

        informacionEnvio:
            "Informations de livraison",

        privacidad:
            "Politique de confidentialité",

        contacto:
            "Contact",

        whatsapp:
            "WhatsApp",

        facebook:
            "Facebook",

        instagram:
            "Instagram",

        escribenos:
            "Écrivez-nous",

        derechos:
            "© 2026 Ma Boutique — Tous droits réservés",

        comprasSeguras:
            "Achats simples, rapides et sécurisés."

    },


    pt: {

        nombre:
            "Português",

        ofertaSuperior:
            "Ofertas especiais da Minha Loja",

        eslogan:
            "Soluções para sua casa e seu negócio",

        entrar:
            "Entrar",

        carrito:
            "Carrinho",

        inicio:
            "Início",

        categorias:
            "Categorias",

        promociones:
            "Promoções",

        catalogo:
            "Catálogo",

        comprar:
            "Comprar",

        oferta:
            "OFERTA",

        tituloOferta:
            "Grandes promoções",

        textoOferta:
            "Encontre produtos de qualidade para sua casa e seu negócio.",

        comprarAhora:
            "Comprar agora →",

        seguridad:
            "SEGURANÇA",

        tituloSeguridad:
            "Proteja o que mais importa",

        textoSeguridad:
            "Soluções para sua casa e seu negócio.",

        verProductos:
            "Ver produtos",

        herramientas:
            "FERRAMENTAS",

        tituloHerramientas:
            "Tudo para seus projetos",

        textoHerramientas:
            "Encontre ferramentas para instalação e manutenção.",

        verCatalogo:
            "Ver catálogo →",

        explora:
            "EXPLORE",

        tituloCategorias:
            "Compre por categoria",

        ferreteria:
            "Ferragens",

        herramientasCategoria:
            "Ferramentas",

        electrico:
            "Elétrico",

        hogar:
            "Casa",

        bano:
            "Banheiro",

        destacados:
            "DESTAQUES",

        productosDestacados:
            "Produtos em destaque",

        descripcionDestacados:
            "Alguns dos nossos produtos disponíveis.",

        agregarCarrito:
            "Adicionar ao carrinho",

        verCatalogoCompleto:
            "Ver catálogo completo →",

        necesitasAyuda:
            "PRECISA DE AJUDA?",

        estamosAyudarte:
            "Estamos aqui para ajudar",

        textoWhatsApp:
            "Consulte disponibilidade, preços ou faça seu pedido diretamente pelo WhatsApp.",

        escribirWhatsApp:
            "Escrever no WhatsApp",

        miCarrito:
            "🛒 Meu carrinho",

        carritoVacio:
            "Seu carrinho está vazio.",

        total:
            "Total:",

        finalizarWhatsApp:
            "Finalizar compra pelo WhatsApp",

        atencionCliente:
            "Atendimento ao cliente",

        comoComprar:
            "Como comprar",

        contactarnos:
            "Entre em contato",

        preguntas:
            "Perguntas frequentes",

        terminos:
            "Termos e condições",

        miTienda:
            "Minha loja",

        productos:
            "Produtos",

        informacion:
            "Informações",

        sobreNosotros:
            "Sobre nós",

        formasPago:
            "Formas de pagamento",

        informacionEnvio:
            "Informações de envio",

        privacidad:
            "Política de privacidade",

        contacto:
            "Contato",

        whatsapp:
            "WhatsApp",

        facebook:
            "Facebook",

        instagram:
            "Instagram",

        escribenos:
            "Fale conosco",

        derechos:
            "© 2026 Minha Loja — Todos os direitos reservados",

        comprasSeguras:
            "Compras fáceis, rápidas e seguras."

    },


    zh: {

        nombre:
            "中文",

        ofertaSuperior:
            "Mi Tienda 特别优惠",

        eslogan:
            "为您的家庭和企业提供解决方案",

        entrar:
            "登录",

        carrito:
            "购物车",

        inicio:
            "首页",

        categorias:
            "分类",

        promociones:
            "促销",

        catalogo:
            "目录",

        comprar:
            "购买",

        oferta:
            "优惠",

        tituloOferta:
            "超值促销",

        textoOferta:
            "为您的家庭和企业寻找优质产品。",

        comprarAhora:
            "立即购买 →",

        seguridad:
            "安全",

        tituloSeguridad:
            "保护最重要的事物",

        textoSeguridad:
            "为您的家庭和企业提供安全解决方案。",

        verProductos:
            "查看产品",

        herramientas:
            "工具",

        tituloHerramientas:
            "满足您的项目需求",

        textoHerramientas:
            "寻找安装和维护所需的工具。",

        verCatalogo:
            "查看目录 →",

        explora:
            "探索",

        tituloCategorias:
            "按分类购买",

        ferreteria:
            "五金",

        herramientasCategoria:
            "工具",

        electrico:
            "电气",

        hogar:
            "家居",

        bano:
            "浴室",

        destacados:
            "精选",

        productosDestacados:
            "精选产品",

        descripcionDestacados:
            "部分可购买的产品。",

        agregarCarrito:
            "加入购物车",

        verCatalogoCompleto:
            "查看完整目录 →",

        necesitasAyuda:
            "需要帮助吗？",

        estamosAyudarte:
            "我们随时为您提供帮助",

        textoWhatsApp:
            "查询库存、价格或直接通过 WhatsApp 下单。",

        escribirWhatsApp:
            "通过 WhatsApp 联系",

        miCarrito:
            "🛒 我的购物车",

        carritoVacio:
            "您的购物车为空。",

        total:
            "总计：",

        finalizarWhatsApp:
            "通过 WhatsApp 完成购买",

        atencionCliente:
            "客户服务",

        comoComprar:
            "如何购买",

        contactarnos:
            "联系我们",

        preguntas:
            "常见问题",

        terminos:
            "条款和条件",

        miTienda:
            "我的商店",

        productos:
            "产品",

        informacion:
            "信息",

        sobreNosotros:
            "关于我们",

        formasPago:
            "付款方式",

        informacionEnvio:
            "配送信息",

        privacidad:
            "隐私政策",

        contacto:
            "联系",

        whatsapp:
            "WhatsApp",

        facebook:
            "Facebook",

        instagram:
            "Instagram",

        escribenos:
            "联系我们",

        derechos:
            "© 2026 Mi Tienda — 保留所有权利",

        comprasSeguras:
            "简单、快速、安全的购物。"

    }

};


// =====================================================
// IDIOMA ACTUAL
// =====================================================

let idiomaActual =
    localStorage.getItem(
        "idioma"
    ) || "es";


if (
    !traducciones[
        idiomaActual
    ]
) {

    idiomaActual =
        "es";

}


// =====================================================
// TRADUCCIÓN
// =====================================================

function t(
    clave
) {

    return (
        traducciones[
            idiomaActual
        ]?.[clave] ||

        traducciones.es[
            clave
        ] ||

        clave
    );

}


// =====================================================
// CAMBIAR IDIOMA
// =====================================================

function cambiarIdioma(
    idioma
) {

    if (
        !traducciones[
            idioma
        ]
    ) {

        idioma =
            "es";

    }


    idiomaActual =
        idioma;


    localStorage.setItem(
        "idioma",
        idioma
    );


    const idiomaSeleccionado =
        traducciones[
            idioma
        ];


    document
        .querySelectorAll(
            "[data-text]"
        )
        .forEach(
            function (elemento) {

                const clave =
                    elemento.dataset.text;


                if (
                    idiomaSeleccionado[
                        clave
                    ]
                ) {

                    elemento.textContent =
                        idiomaSeleccionado[
                            clave
                        ];

                }

            }
        );


    if (buscador) {

        const placeholders = {

            es:
                "¿Qué estás buscando?",

            en:
                "What are you looking for?",

            fr:
                "Que recherchez-vous ?",

            pt:
                "O que você está procurando?",

            zh:
                "您在寻找什么？"

        };


        buscador.placeholder =
            placeholders[
                idioma
            ] ||
            placeholders.es;

    }


    const boton =
        document.getElementById(
            "boton-idioma"
        );


    if (boton) {

        boton.textContent =
            "🌐 " +
            idiomaSeleccionado.nombre +
            " ▾";

    }


    document
        .querySelectorAll(
            "[data-idioma]"
        )
        .forEach(
            function (elemento) {

                elemento.classList.toggle(
                    "idioma-activo",
                    elemento.dataset.idioma ===
                    idioma
                );

            }
        );


    document.documentElement.lang =
        idioma;


    document.documentElement.dir =
        "ltr";


    if (
        document.getElementById(
            "lista-carrito"
        )
    ) {

        mostrarCarrito();

    }


    actualizarAsistenteIdioma();

}


// =====================================================
// AGREGAR CHINO
// =====================================================

function agregarIdiomaChino() {

    const menu =
        document.getElementById(
            "menu-idiomas"
        );


    if (!menu) {

        return;

    }


    if (
        menu.querySelector(
            '[data-idioma="zh"]'
        )
    ) {

        return;

    }


    const boton =
        document.createElement(
            "button"
        );


    boton.type =
        "button";


    boton.dataset.idioma =
        "zh";


    boton.textContent =
        "中文";


    boton.addEventListener(
        "click",
        function () {

            cambiarIdioma(
                "zh"
            );


            menu.classList.remove(
                "abierto"
            );

        }
    );


    menu.appendChild(
        boton
    );

}


// =====================================================
// MENÚ DE IDIOMAS
// =====================================================

function configurarMenuIdiomas() {

    const boton =
        document.getElementById(
            "boton-idioma"
        );


    const menu =
        document.getElementById(
            "menu-idiomas"
        );


    if (
        !boton ||
        !menu
    ) {

        agregarIdiomaChino();

        return;

    }


    agregarIdiomaChino();


    if (
        boton.dataset.idiomaConfigurado !==
        "true"
    ) {

        boton.dataset.idiomaConfigurado =
            "true";


        boton.addEventListener(
            "click",
            function (evento) {

                evento.stopPropagation();


                menu.classList.toggle(
                    "abierto"
                );

            }
        );

    }


    menu
        .querySelectorAll(
            "[data-idioma]"
        )
        .forEach(
            function (opcion) {

                if (
                    opcion.dataset.idiomaConfigurado ===
                    "true"
                ) {

                    return;

                }


                opcion.dataset.idiomaConfigurado =
                    "true";


                opcion.addEventListener(
                    "click",
                    function () {

                        cambiarIdioma(
                            opcion.dataset.idioma
                        );


                        menu.classList.remove(
                            "abierto"
                        );

                    }
                );

            }
        );


    if (
        !document.body.dataset.menuIdiomaConfigurado
    ) {

        document.body.dataset.menuIdiomaConfigurado =
            "true";


        document.addEventListener(
            "click",
            function (evento) {

                if (
                    !evento.target.closest(
                        ".selector-idioma"
                    )
                ) {

                    menu.classList.remove(
                        "abierto"
                    );

                }

            }
        );

    }

}


// =====================================================
// CARRITO Y RESUMEN
// =====================================================

function corregirSimboloDuplicado() {

    const total =
        document.getElementById(
            "total-carrito"
        );


    if (!total) {

        return;

    }


    const contenedor =
        total.parentElement;


    if (!contenedor) {

        return;

    }


    Array.from(
        contenedor.childNodes
    )
    .forEach(
        function (nodo) {

            if (
                nodo.nodeType ===
                Node.TEXT_NODE
            ) {

                const texto =
                    nodo.textContent.trim();


                if (
                    /^(C\$|US\$|CA\$|MX\$|COP\$|R\$|B\/\.|₡|Q|L|€|£|¥|NT\$|HK\$)\s*$/
                        .test(
                            texto
                        )
                ) {

                    nodo.remove();

                }

            }

        }
    );

}


// =====================================================
// RESUMEN
// =====================================================

function actualizarResumenCarrito() {

    const contenido =
        document.querySelector(
            ".carrito-contenido"
        );


    const totalCarrito =
        document.getElementById(
            "total-carrito"
        );


    if (
        !contenido ||
        !totalCarrito
    ) {

        return;

    }


    let resumen =
        document.getElementById(
            "resumen-compra"
        );


    if (!resumen) {

        resumen =
            document.createElement(
                "section"
            );


        resumen.id =
            "resumen-compra";


        resumen.className =
            "resumen-compra";


        const contenedorTotal =
            totalCarrito.closest(
                ".total-carrito"
            );


        if (contenedorTotal) {

            contenedorTotal.before(
                resumen
            );

        } else {

            contenido.appendChild(
                resumen
            );

        }

    }


    const datos =
        obtenerResumenCompra();


    const faltante =
        Math.max(
            0,
            MONTO_ENVIO_GRATIS -
            datos.subtotal
        );


    const porcentaje =
        datos.subtotal
            ? Math.min(
                100,
                (
                    datos.subtotal /
                    MONTO_ENVIO_GRATIS
                ) *
                100
            )
            : 0;


    const textos = {

        cupon:

            idiomaActual === "zh"
                ? "您有优惠券吗？"
                : idiomaActual === "en"
                    ? "Do you have a coupon?"
                    : idiomaActual === "fr"
                        ? "Vous avez un coupon ?"
                        : idiomaActual === "pt"
                            ? "Você tem um cupom?"
                            : "¿Tienes un cupón?",


        aplicar:

            idiomaActual === "zh"
                ? "应用"
                : idiomaActual === "en"
                    ? "Apply"
                    : idiomaActual === "fr"
                        ? "Appliquer"
                        : idiomaActual === "pt"
                            ? "Aplicar"
                            : "Aplicar",


        subtotal:

            idiomaActual === "zh"
                ? "小计"
                : idiomaActual === "en"
                    ? "Subtotal"
                    : "Subtotal",


        descuento:

            idiomaActual === "zh"
                ? "折扣"
                : idiomaActual === "en"
                    ? "Discount"
                    : idiomaActual === "fr"
                        ? "Réduction"
                        : idiomaActual === "pt"
                            ? "Desconto"
                            : "Descuento"

    };


    resumen.innerHTML = `

        <div
            class="beneficio-envio ${
                faltante === 0 &&
                datos.subtotal
                    ? "completo"
                    : ""
            }"
        >

            <span>

                ${
                    faltante === 0 &&
                    datos.subtotal

                        ? "✓ " +

                          (
                            idiomaActual === "zh"
                                ? "已解锁免费配送"
                                : idiomaActual === "en"
                                    ? "Free shipping unlocked"
                                    : idiomaActual === "fr"
                                        ? "Livraison gratuite débloquée"
                                        : idiomaActual === "pt"
                                            ? "Frete grátis desbloqueado"
                                            : "Envío gratis desbloqueado"
                          )

                        : (

                            idiomaActual === "zh"

                                ? "还差 " +
                                  formatoMoneda(
                                      faltante
                                  ) +
                                  " 即可免费配送"

                                : idiomaActual === "en"

                                    ? "Only " +
                                      formatoMoneda(
                                          faltante
                                      ) +
                                      " left for free shipping"

                                    : idiomaActual === "fr"

                                        ? "Il vous manque " +
                                          formatoMoneda(
                                              faltante
                                          ) +
                                          " pour la livraison gratuite"

                                        : idiomaActual === "pt"

                                            ? "Faltam " +
                                              formatoMoneda(
                                                  faltante
                                              ) +
                                              " para frete grátis"

                                            : "Te faltan " +
                                              formatoMoneda(
                                                  faltante
                                              ) +
                                              " para envío gratis"

                          )

                }

            </span>


            <div>

                <i
                    style="width:${porcentaje}%"
                ></i>

            </div>

        </div>


        <div class="cupon-compra">

            <label
                for="codigo-cupon"
            >
                ${textos.cupon}
            </label>


            <div>

                <input
                    id="codigo-cupon"
                    type="text"
                    value="${cuponAplicado}"
                    placeholder="Ej. BIENVENIDA10"
                    maxlength="20"
                    autocomplete="off"
                >


                <button
                    id="aplicar-cupon"
                    type="button"
                >
                    ${textos.aplicar}
                </button>

            </div>


            <small id="mensaje-cupon">

                ${
                    cuponAplicado

                        ? (

                            idiomaActual === "zh"
                                ? "优惠券 BIENVENIDA10 已应用：10% 折扣。"
                                : idiomaActual === "en"
                                    ? "Coupon BIENVENIDA10 applied: 10% discount."
                                    : idiomaActual === "fr"
                                        ? "Coupon BIENVENIDA10 appliqué : 10 % de réduction."
                                        : idiomaActual === "pt"
                                            ? "Cupom BIENVENIDA10 aplicado: 10% de desconto."
                                            : "Cupón BIENVENIDA10 aplicado: 10% de descuento."

                          )

                        : (

                            idiomaActual === "zh"
                                ? "使用 BIENVENIDA10 可享受 10% 折扣。"
                                : idiomaActual === "en"
                                    ? "Use BIENVENIDA10 and receive 10% off."
                                    : idiomaActual === "fr"
                                        ? "Utilisez BIENVENIDA10 et obtenez 10 % de réduction."
                                        : idiomaActual === "pt"
                                            ? "Use BIENVENIDA10 e receba 10% de desconto."
                                            : "Usa BIENVENIDA10 y recibe 10% de descuento."

                          )

                }

            </small>

        </div>


        <div class="desglose-compra">

            <span>

                ${textos.subtotal}

                <b>
                    ${formatoMoneda(
                        datos.subtotal
                    )}
                </b>

            </span>


            ${
                datos.descuento

                    ? `

                        <span
                            class="descuento"
                        >

                            ${textos.descuento}

                            <b>
                                − ${formatoMoneda(
                                    datos.descuento
                                )}
                            </b>

                        </span>

                    `

                    : ""
            }

        </div>


        <button
            id="vaciar-carrito"
            class="vaciar-carrito"
            type="button"
            ${carrito.length ? "" : "disabled"}
        >

            ${
                idiomaActual === "zh"
                    ? "清空购物车"
                    : idiomaActual === "en"
                        ? "Empty cart"
                        : idiomaActual === "fr"
                            ? "Vider le panier"
                            : idiomaActual === "pt"
                                ? "Esvaziar carrinho"
                                : "Vaciar carrito"
            }

        </button>


        <button
            id="compartir-carrito"
            class="compartir-carrito"
            type="button"
            ${carrito.length ? "" : "disabled"}
        >

            ↗

            ${
                idiomaActual === "zh"
                    ? "分享购物车"
                    : idiomaActual === "en"
                        ? "Share this cart"
                        : idiomaActual === "fr"
                            ? "Partager ce panier"
                            : idiomaActual === "pt"
                                ? "Compartilhar carrinho"
                                : "Compartir este carrito"
            }

        </button>

    `;


    totalCarrito.textContent =
        formatoMoneda(
            datos.total
        );


    corregirSimboloDuplicado();


    const botonCupon =
        document.getElementById(
            "aplicar-cupon"
        );


    if (botonCupon) {

        botonCupon.addEventListener(
            "click",
            function () {

                const campo =
                    document.getElementById(
                        "codigo-cupon"
                    );


                const mensaje =
                    document.getElementById(
                        "mensaje-cupon"
                    );


                const codigo =
                    campo.value
                        .trim()
                        .toUpperCase();


                if (
                    codigo ===
                    "BIENVENIDA10"
                ) {

                    cuponAplicado =
                        codigo;


                    localStorage.setItem(
                        "cuponMiTienda",
                        codigo
                    );


                    actualizarResumenCarrito();

                } else {

                    cuponAplicado =
                        "";


                    localStorage.removeItem(
                        "cuponMiTienda"
                    );


                    mensaje.textContent =
                        codigo
                            ? "Ese cupón no es válido. Prueba BIENVENIDA10."
                            : "Ingresa un cupón para aplicarlo.";

                }

            }
        );

    }


    const vaciar =
        document.getElementById(
            "vaciar-carrito"
        );


    if (vaciar) {

        vaciar.addEventListener(
            "click",
            function () {

                if (
                    !carrito.length
                ) {

                    return;

                }


                const confirmar =
                    window.confirm(
                        idiomaActual === "zh"
                            ? "确定要清空购物车吗？"
                            : idiomaActual === "en"
                                ? "Do you want to empty your cart?"
                                : "¿Quieres quitar todos los productos del carrito?"
                    );


                if (!confirmar) {

                    return;

                }


                carrito = [];


                guardarCarrito();

                actualizarContador();

                mostrarCarrito();

            }
        );

    }


    const compartir =
        document.getElementById(
            "compartir-carrito"
        );


    if (compartir) {

        compartir.addEventListener(
            "click",
            async function () {

                if (
                    !carrito.length
                ) {

                    return;

                }


                const enlace =
                    obtenerEnlaceCarrito();


                try {

                    if (
                        navigator.share
                    ) {

                        await navigator.share({

                            title:
                                "Mi carrito de Mi Tienda",

                            text:
                                "Te comparto estos productos.",

                            url:
                                enlace

                        });

                    } else if (
                        navigator.clipboard
                    ) {

                        await navigator.clipboard.writeText(
                            enlace
                        );


                        this.textContent =
                            "✓ Enlace copiado";


                        setTimeout(
                            function () {

                                actualizarResumenCarrito();

                            },
                            2200
                        );

                    } else {

                        window.prompt(
                            "Copia este enlace:",
                            enlace
                        );

                    }

                } catch (error) {

                    if (
                        error.name !==
                        "AbortError"
                    ) {

                        window.prompt(
                            "Copia este enlace:",
                            enlace
                        );

                    }

                }

            }
        );

    }

}


// =====================================================
// MOSTRAR CARRITO
// =====================================================

function mostrarCarrito() {

    const lista =
        document.getElementById(
            "lista-carrito"
        );


    const totalElemento =
        document.getElementById(
            "total-carrito"
        );


    if (
        !lista ||
        !totalElemento
    ) {

        return;

    }


    lista.innerHTML =
        "";


    if (
        !carrito.length
    ) {

        lista.innerHTML = `

            <p class="carrito-vacio">

                ${t(
                    "carritoVacio"
                )}

            </p>

        `;


        totalElemento.textContent =
            formatoMoneda(
                0
            );


        actualizarResumenCarrito();

        corregirSimboloDuplicado();

        return;

    }


    let total =
        0;


    carrito.forEach(
        function (
            producto,
            indice
        ) {

            const subtotal =
                producto.precio *
                producto.cantidad;


            total +=
                subtotal;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "item-carrito";


            item.innerHTML = `

                <div class="info-producto">

                    <strong
                        class="nombre-producto"
                    ></strong>


                    <span>

                        ${formatoMoneda(
                            producto.precio
                        )}

                    </span>

                </div>


                <div class="controles-cantidad">

                    <button
                        onclick="disminuirCantidad(${indice})"
                        type="button"
                    >
                        −
                    </button>


                    <span>
                        ${producto.cantidad}
                    </span>


                    <button
                        onclick="aumentarCantidad(${indice})"
                        type="button"
                    >
                        +
                    </button>

                </div>


                <div class="subtotal">

                    ${formatoMoneda(
                        subtotal
                    )}

                </div>


                <button
                    class="eliminar-producto"
                    onclick="eliminarProducto(${indice})"
                    type="button"
                    aria-label="Eliminar producto"
                >
                    🗑️
                </button>

            `;


            item.querySelector(
                ".nombre-producto"
            ).textContent =
                producto.nombre;


            lista.appendChild(
                item
            );

        }
    );


    totalElemento.textContent =
        formatoMoneda(
            total
        );


    actualizarResumenCarrito();

    corregirSimboloDuplicado();

}


// =====================================================
// CANTIDADES
// =====================================================

function aumentarCantidad(
    indice
) {

    if (
        !carrito[indice]
    ) {

        return;

    }


    carrito[indice].cantidad++;


    guardarCarrito();

    actualizarContador();

    mostrarCarrito();

}


function disminuirCantidad(
    indice
) {

    if (
        !carrito[indice]
    ) {

        return;

    }


    carrito[indice].cantidad--;


    if (
        carrito[indice].cantidad <=
        0
    ) {

        carrito.splice(
            indice,
            1
        );

    }


    guardarCarrito();

    actualizarContador();

    mostrarCarrito();

}


function eliminarProducto(
    indice
) {

    if (
        !carrito[indice]
    ) {

        return;

    }


    carrito.splice(
        indice,
        1
    );


    guardarCarrito();

    actualizarContador();

    mostrarCarrito();

}


// =====================================================
// CHECKOUT
// =====================================================

function abrirCheckout() {

    if (
        !carrito.length
    ) {

        alert(
            idiomaActual === "zh"
                ? "您的购物车为空。"
                : idiomaActual === "en"
                    ? "Your cart is empty."
                    : "Tu carrito está vacío."
        );


        return;

    }


    let checkout =
        document.getElementById(
            "checkout-datos"
        );


    if (!checkout) {

        checkout =
            document.createElement(
                "div"
            );


        checkout.id =
            "checkout-datos";


        checkout.className =
            "checkout-datos";


        checkout.innerHTML = `

            <form
                class="checkout-form"
            >

                <button
                    class="checkout-cerrar"
                    type="button"
                    aria-label="Cerrar"
                >
                    ×
                </button>


                <span class="checkout-paso">
                    ÚLTIMO PASO
                </span>


                <h2>
                    ¿Dónde entregamos tu pedido?
                </h2>


                <p>
                    Estos datos se incluirán en tu mensaje de WhatsApp para confirmar la compra.
                </p>


                <label>

                    Nombre completo

                    <input
                        name="nombre"
                        required
                        autocomplete="name"
                        placeholder="Tu nombre"
                    >

                </label>


                <label>

                    Teléfono

                    <input
                        name="telefono"
                        required
                        inputmode="tel"
                        autocomplete="tel"
                        placeholder="Ej. 8888 8888"
                    >

                </label>


                <label>

                    Dirección de entrega

                    <textarea
                        name="direccion"
                        required
                        rows="3"
                        placeholder="Barrio, ciudad y una referencia"
                    ></textarea>

                </label>


                <label>

                    Método de entrega

                    <select
                        name="entrega"
                    >

                        <option>
                            Entrega a domicilio
                        </option>

                        <option>
                            Retiro en tienda
                        </option>

                    </select>

                </label>


                <label>

                    Nota para el pedido

                    <input
                        name="nota"
                        maxlength="180"
                        placeholder="Opcional"
                    >

                </label>


                <button
                    class="confirmar-pedido"
                    type="submit"
                >
                    Continuar a WhatsApp
                </button>

            </form>

        `;


        document.body.appendChild(
            checkout
        );


        checkout
            .querySelector(
                ".checkout-cerrar"
            )
            .addEventListener(
                "click",
                function () {

                    checkout.classList.remove(
                        "visible"
                    );

                }
            );


        checkout.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target ===
                    checkout
                ) {

                    checkout.classList.remove(
                        "visible"
                    );

                }

            }
        );


        checkout
            .querySelector(
                "form"
            )
            .addEventListener(
                "submit",
                function (evento) {

                    evento.preventDefault();


                    if (
                        !evento.currentTarget.reportValidity()
                    ) {

                        return;

                    }


                    const cliente =
                        new FormData(
                            evento.currentTarget
                        );


                    const resumen =
                        obtenerResumenCompra();


                    let mensaje =
                        "Hola, quiero realizar el siguiente pedido:\n\n";


                    carrito.forEach(
                        function (
                            producto
                        ) {

                            mensaje +=
                                "• " +
                                producto.nombre +
                                " x" +
                                producto.cantidad +
                                " - " +
                                formatoMoneda(
                                    producto.precio *
                                    producto.cantidad
                                ) +
                                "\n";

                        }
                    );


                    mensaje +=
                        "\nSubtotal: " +
                        formatoMoneda(
                            resumen.subtotal
                        );


                    if (
                        resumen.descuento
                    ) {

                        mensaje +=
                            "\nDescuento (" +
                            cuponAplicado +
                            "): -" +
                            formatoMoneda(
                                resumen.descuento
                            );

                    }


                    mensaje +=
                        "\nTotal: " +
                        formatoMoneda(
                            resumen.total
                        );


                    mensaje +=
                        "\n\nDATOS DE ENTREGA";


                    mensaje +=
                        "\nNombre: " +
                        cliente.get(
                            "nombre"
                        );


                    mensaje +=
                        "\nTeléfono: " +
                        cliente.get(
                            "telefono"
                        );


                    mensaje +=
                        "\nEntrega: " +
                        cliente.get(
                            "entrega"
                        );


                    mensaje +=
                        "\nDirección: " +
                        cliente.get(
                            "direccion"
                        );


                    if (
                        cliente.get(
                            "nota"
                        )
                    ) {

                        mensaje +=
                            "\nNota: " +
                            cliente.get(
                                "nota"
                            );

                    }


                    const url =
                        "https://wa.me/" +
                        NUMERO_WHATSAPP +
                        "?text=" +
                        encodeURIComponent(
                            mensaje
                        );


                    window.open(
                        url,
                        "_blank",
                        "noopener"
                    );


                    checkout.classList.remove(
                        "visible"
                    );

                }
            );

    }


    checkout.classList.add(
        "visible"
    );


    const nombre =
        checkout.querySelector(
            "input[name='nombre']"
        );


    if (nombre) {

        nombre.focus();

    }

}


// =====================================================
// FINALIZAR COMPRA
// =====================================================

const finalizarCompra =
    document.getElementById(
        "finalizar-compra"
    );


if (
    finalizarCompra
) {

    finalizarCompra.addEventListener(
        "click",
        abrirCheckout
    );

}


// =====================================================
// BUSCADOR
// =====================================================

const buscador =
    document.getElementById(
        "buscador"
    );


if (buscador) {

    buscador.addEventListener(
        "input",
        function () {

            const texto =
                buscador.value
                    .toLowerCase()
                    .trim();


            document
                .querySelectorAll(
                    ".producto"
                )
                .forEach(
                    function (
                        producto
                    ) {

                        const titulo =
                            producto.querySelector(
                                "h3"
                            );


                        if (!titulo) {

                            return;

                        }


                        const nombre =
                            titulo.textContent
                                .toLowerCase();


                        producto.style.display =
                            nombre.includes(
                                texto
                            )
                                ? ""
                                : "none";

                    }
                );

        }
    );

}


// =====================================================
// CARRUSEL
// =====================================================

const slides =
    document.querySelectorAll(
        ".slide"
    );


const indicadores =
    document.querySelectorAll(
        ".indicador"
    );


const botonAnterior =
    document.getElementById(
        "slide-anterior"
    );


const botonSiguiente =
    document.getElementById(
        "slide-siguiente"
    );


let slideActual =
    0;


function mostrarSlide(
    indice
) {

    if (
        !slides.length
    ) {

        return;

    }


    if (
        indice < 0
    ) {

        indice =
            slides.length -
            1;

    }


    if (
        indice >=
        slides.length
    ) {

        indice =
            0;

    }


    slideActual =
        indice;


    slides.forEach(
        function (
            slide,
            i
        ) {

            slide.classList.toggle(
                "activo",
                i === slideActual
            );

        }
    );


    indicadores.forEach(
        function (
            indicador,
            i
        ) {

            indicador.classList.toggle(
                "activo",
                i === slideActual
            );

        }
    );

}


if (
    botonAnterior
) {

    botonAnterior.addEventListener(
        "click",
        function () {

            mostrarSlide(
                slideActual -
                1
            );

        }
    );

}


if (
    botonSiguiente
) {

    botonSiguiente.addEventListener(
        "click",
        function () {

            mostrarSlide(
                slideActual +
                1
            );

        }
    );

}


indicadores.forEach(
    function (
        indicador
    ) {

        indicador.addEventListener(
            "click",
            function () {

                mostrarSlide(
                    Number(
                        indicador.dataset.slide
                    )
                );

            }
        );

    }
);


if (
    slides.length >
    1
) {

    setInterval(
        function () {

            mostrarSlide(
                slideActual +
                1
            );

        },
        6000
    );

}


// =====================================================
// EXPLORADOR DE PRODUCTOS
// =====================================================

function configurarExploradorProductos() {

    const contenedor =
        document.querySelector(
            ".productos-container"
        );


    if (
        !contenedor ||
        document.getElementById(
            "herramientas-catalogo"
        )
    ) {

        return;

    }


    let favoritos;


    try {

        favoritos =
            JSON.parse(
                localStorage.getItem(
                    "favoritosMiTienda"
                ) || "[]"
            );

    } catch (error) {

        favoritos =
            [];

    }


    const tarjetas =
        Array.from(
            contenedor.querySelectorAll(
                ".producto"
            )
        );


    const categorias =
        [
            ...new Set(
                tarjetas
                    .map(
                        function (
                            tarjeta
                        ) {

                            return tarjeta
                                .querySelector(
                                    ".producto-categoria"
                                )
                                ?.textContent
                                .trim();

                        }
                    )
                    .filter(
                        Boolean
                    )
            )
        ];


    const herramientas =
        document.createElement(
            "div"
        );


    herramientas.id =
        "herramientas-catalogo";


    herramientas.className =
        "herramientas-catalogo";


    herramientas.innerHTML = `

        <div class="chips-categorias">

            <button
                type="button"
                class="activo"
                data-filtro="todos"
            >
                Todos
            </button>


            ${
                categorias
                    .map(
                        function (
                            categoria
                        ) {

                            return `

                                <button
                                    type="button"
                                    data-filtro="${categoria}"
                                >
                                    ${categoria}
                                </button>

                            `;

                        }
                    )
                    .join("")
            }


            <button
                type="button"
                data-filtro="favoritos"
            >
                ♡ Favoritos
            </button>

        </div>


        <label
            class="ordenar-productos"
        >

            Ordenar


            <select>

                <option
                    value="relevancia"
                >
                    Relevancia
                </option>


                <option
                    value="menor"
                >
                    Menor precio
                </option>


                <option
                    value="mayor"
                >
                    Mayor precio
                </option>

            </select>

        </label>

    `;


    contenedor.before(
        herramientas
    );


    tarjetas.forEach(
        function (
            tarjeta
        ) {

            const nombre =
                tarjeta
                    .querySelector(
                        "h3"
                    )
                    ?.textContent
                    .trim() ||
                "";


            const boton =
                document.createElement(
                    "button"
                );


            boton.type =
                "button";


            boton.className =
                "favorito-producto";


            boton.setAttribute(
                "aria-label",
                "Añadir a favoritos"
            );


            function pintarFavorito() {

                const activo =
                    favoritos.includes(
                        nombre
                    );


                boton.classList.toggle(
                    "activo",
                    activo
                );


                boton.textContent =
                    activo
                        ? "♥"
                        : "♡";


                boton.setAttribute(
                    "aria-pressed",
                    String(
                        activo
                    )
                );

            }


            boton.addEventListener(
                "click",
                function () {

                    favoritos =
                        favoritos.includes(
                            nombre
                        )

                            ? favoritos.filter(
                                function (
                                    item
                                ) {

                                    return (
                                        item !==
                                        nombre
                                    );

                                }
                            )

                            : favoritos.concat(
                                nombre
                            );


                    localStorage.setItem(
                        "favoritosMiTienda",
                        JSON.stringify(
                            favoritos
                        )
                    );


                    pintarFavorito();

                    aplicarFiltro();

                }
            );


            tarjeta
                .querySelector(
                    ".producto-imagen"
                )
                ?.appendChild(
                    boton
                );


            pintarFavorito();

        }
    );


    let filtro =
        "todos";


    function aplicarFiltro() {

        tarjetas.forEach(
            function (
                tarjeta
            ) {

                const nombre =
                    tarjeta
                        .querySelector(
                            "h3"
                        )
                        ?.textContent
                        .trim() ||
                    "";


                const categoria =
                    tarjeta
                        .querySelector(
                            ".producto-categoria"
                        )
                        ?.textContent
                        .trim();


                tarjeta.hidden =
                    !(
                        filtro ===
                        "todos" ||

                        (
                            filtro ===
                            "favoritos" &&

                            favoritos.includes(
                                nombre
                            )
                        ) ||

                        (
                            filtro !==
                            "favoritos" &&

                            filtro !==
                            "todos" &&

                            categoria ===
                            filtro
                        )
                    );

            }
        );

    }


    herramientas
        .querySelectorAll(
            "[data-filtro]"
        )
        .forEach(
            function (
                boton
            ) {

                boton.addEventListener(
                    "click",
                    function () {

                        filtro =
                            boton.dataset.filtro;


                        herramientas
                            .querySelectorAll(
                                "[data-filtro]"
                            )
                            .forEach(
                                function (
                                    item
                                ) {

                                    item.classList.toggle(
                                        "activo",
                                        item ===
                                        boton
                                    );

                                }
                            );


                        aplicarFiltro();

                    }
                );

            }
        );


    const orden =
        herramientas.querySelector(
            "select"
        );


    if (orden) {

        orden.addEventListener(
            "change",
            function (
                evento
            ) {

                const modo =
                    evento.target.value;


                tarjetas
                    .sort(
                        function (
                            a,
                            b
                        ) {

                            const precioA =
                                Number(
                                    a.querySelector(
                                        ".agregar-carrito"
                                    )
                                    ?.dataset
                                    .precio ||
                                    0
                                );


                            const precioB =
                                Number(
                                    b.querySelector(
                                        ".agregar-carrito"
                                    )
                                    ?.dataset
                                    .precio ||
                                    0
                                );


                            if (
                                modo ===
                                "menor"
                            ) {

                                return (
                                    precioA -
                                    precioB
                                );

                            }


                            if (
                                modo ===
                                "mayor"
                            ) {

                                return (
                                    precioB -
                                    precioA
                                );

                            }


                            return 0;

                        }
                    )
                    .forEach(
                        function (
                            tarjeta
                        ) {

                            contenedor.appendChild(
                                tarjeta
                            );

                        }
                    );

            }
        );

    }

}


// =====================================================
// ASISTENTE VIRTUAL
// =====================================================

let asistenteReferencia =
    null;


function crearAsistenteVirtual() {

    if (
        document.getElementById(
            "asistente-virtual"
        )
    ) {

        return;

    }


    const asistente =
        document.createElement(
            "section"
        );


    asistente.id =
        "asistente-virtual";


    asistente.className =
        "asistente-virtual";


    asistente.innerHTML = `

        <button
            class="asistente-boton"
            type="button"
            aria-label="Abrir asistente virtual"
            aria-expanded="false"
        >

            <span
                aria-hidden="true"
            >
                ✦
            </span>


            <span
                class="asistente-boton-texto"
            >
                Ayuda
            </span>

        </button>


        <div
            class="asistente-panel"
            aria-hidden="true"
        >

            <div
                class="asistente-encabezado"
            >

                <div>

                    <strong>
                        Asistente de Mi Tienda
                    </strong>


                    <span>

                        <i></i>

                        En línea para ayudarte

                    </span>

                </div>


                <button
                    class="asistente-cerrar"
                    type="button"
                    aria-label="Cerrar asistente"
                >
                    ×
                </button>

            </div>


            <div
                class="asistente-mensajes"
                aria-live="polite"
            >

                <p
                    class="mensaje-asistente"
                >
                    ¡Hola! Puedo ayudarte a encontrar productos, explicarte cómo comprar o abrir tu carrito.
                </p>

            </div>


            <div
                class="asistente-sugerencias"
            >

                <button
                    type="button"
                    data-consulta="¿Cómo compro?"
                >
                    Cómo comprar
                </button>


                <button
                    type="button"
                    data-consulta="Ver carrito"
                >
                    Ver carrito
                </button>


                <button
                    type="button"
                    data-consulta="¿Qué productos tienen?"
                >
                    Productos
                </button>

            </div>


            <form
                class="asistente-formulario"
            >

                <label
                    class="sr-only"
                    for="asistente-consulta"
                >
                    Escribe tu consulta
                </label>


                <input
                    id="asistente-consulta"
                    type="text"
                    maxlength="180"
                    placeholder="Escribe tu consulta…"
                    autocomplete="off"
                >


                <button
                    type="submit"
                    aria-label="Enviar consulta"
                >
                    ➜
                </button>

            </form>

        </div>

    `;


    document.body.appendChild(
        asistente
    );


    const boton =
        asistente.querySelector(
            ".asistente-boton"
        );


    const panel =
        asistente.querySelector(
            ".asistente-panel"
        );


    const cerrar =
        asistente.querySelector(
            ".asistente-cerrar"
        );


    const formulario =
        asistente.querySelector(
            ".asistente-formulario"
        );


    const entrada =
        asistente.querySelector(
            "#asistente-consulta"
        );


    const mensajes =
        asistente.querySelector(
            ".asistente-mensajes"
        );


    const productosDisponibles =
        Array.from(
            document.querySelectorAll(
                ".producto"
            )
        )
        .map(
            function (
                producto
            ) {

                const nombre =
                    producto
                        .querySelector(
                            "h3"
                        )
                        ?.textContent
                        .trim() ||
                    "";


                const descripcion =
                    producto
                        .querySelector(
                            "p"
                        )
                        ?.textContent
                        .trim() ||
                    "";


                return {

                    nombre:
                        nombre,

                    descripcion:
                        descripcion,

                    busqueda:
                        nombre
                            .toLowerCase()
                            .normalize(
                                "NFD"
                            )
                            .replace(
                                /[\u0300-\u036f]/g,
                                ""
                            )

                };

            }
        );


    function cambiarEstado(
        abierto
    ) {

        asistente.classList.toggle(
            "abierto",
            abierto
        );


        boton.setAttribute(
            "aria-expanded",
            String(
                abierto
            )
        );


        panel.setAttribute(
            "aria-hidden",
            String(
                !abierto
            )
        );


        if (abierto) {

            entrada.focus();

        }

    }


    function agregarMensaje(
        texto,
        clase
    ) {

        const mensaje =
            document.createElement(
                "p"
            );


        mensaje.className =
            clase;


        mensaje.textContent =
            texto;


        mensajes.appendChild(
            mensaje
        );


        mensajes.scrollTop =
            mensajes.scrollHeight;

    }


    function responderConsulta(
        consulta
    ) {

        const texto =
            consulta
                .toLowerCase()
                .normalize(
                    "NFD"
                )
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                );


        const producto =
            productosDisponibles.find(
                function (
                    item
                ) {

                    return (
                        item.busqueda &&
                        texto.includes(
                            item.busqueda
                        )
                    );

                }
            );


        if (
            texto.includes(
                "carrito"
            )
        ) {

            agregarMensaje(

                idiomaActual === "zh"
                    ? "我打开您的购物车，您可以查看商品。"
                    : "Abro tu carrito para que revises tus productos.",

                "mensaje-asistente"

            );


            abrirCarrito();

            return;

        }


        if (
            texto.includes(
                "compr"
            ) ||
            texto.includes(
                "pedido"
            )
        ) {

            agregarMensaje(

                idiomaActual === "zh"
                    ? "选择产品，加入购物车，然后通过 WhatsApp 完成订单。"
                    : "Elige un producto, agrégalo al carrito y después finaliza tu compra por WhatsApp.",

                "mensaje-asistente"

            );


            return;

        }


        if (producto) {

            agregarMensaje(

                producto.nombre +
                ": " +
                producto.descripcion +
                ". " +

                (
                    idiomaActual === "zh"
                        ? "您可以从产品卡片加入购物车。"
                        : "Puedes agregarlo al carrito desde su tarjeta."
                ),

                "mensaje-asistente"

            );


            return;

        }


        if (
            texto.includes(
                "precio"
            ) ||
            texto.includes(
                "cuanto"
            ) ||
            texto.includes(
                "costo"
            )
        ) {

            agregarMensaje(

                idiomaActual === "zh"
                    ? "每个产品都会显示价格。您也可以更改国家/货币来查看换算后的价格。"
                    : "Cada producto muestra su precio. También puedes cambiar el país y la moneda para ver la conversión.",

                "mensaje-asistente"

            );


            return;

        }


        if (
            texto.includes(
                "envio"
            ) ||
            texto.includes(
                "entrega"
            )
        ) {

            agregarMensaje(

                idiomaActual === "zh"
                    ? "结账时填写您的配送信息，我们会通过 WhatsApp 确认订单。"
                    : "Al finalizar la compra podrás indicar tus datos de entrega y confirmar el pedido por WhatsApp.",

                "mensaje-asistente"

            );


            return;

        }


        if (
            texto.includes(
                "pago"
            )
        ) {

            agregarMensaje(

                idiomaActual === "zh"
                    ? "完成订单后，我们会通过 WhatsApp 告知您可用的付款方式。"
                    : "Al finalizar el pedido te confirmaremos por WhatsApp los métodos de pago disponibles.",

                "mensaje-asistente"

            );


            return;

        }


        if (
            texto.includes(
                "hola"
            ) ||
            texto.includes(
                "buenas"
            )
        ) {

            agregarMensaje(

                idiomaActual === "zh"
                    ? "您好。我可以帮助您了解产品、价格、购物车和订单。"
                    : "Hola. Puedo ayudarte con productos, precios, compras y tu carrito.",

                "mensaje-asistente"

            );


            return;

        }


        agregarMensaje(

            idiomaActual === "zh"
                ? "我可以帮助您了解产品、价格、付款、配送和购物车。"
                : "Puedo orientarte sobre productos, precios, pagos, envíos y el carrito.",

            "mensaje-asistente"

        );

    }


    boton.addEventListener(
        "click",
        function () {

            cambiarEstado(
                !asistente.classList.contains(
                    "abierto"
                )
            );

        }
    );


    cerrar.addEventListener(
        "click",
        function () {

            cambiarEstado(
                false
            );

        }
    );


    formulario.addEventListener(
        "submit",
        function (
            evento
        ) {

            evento.preventDefault();


            const consulta =
                entrada.value.trim();


            if (!consulta) {

                return;

            }


            agregarMensaje(
                consulta,
                "mensaje-cliente"
            );


            entrada.value =
                "";


            responderConsulta(
                consulta
            );

        }
    );


    asistente
        .querySelectorAll(
            "[data-consulta]"
        )
        .forEach(
            function (
                sugerencia
            ) {

                sugerencia.addEventListener(
                    "click",
                    function () {

                        const consulta =
                            sugerencia.dataset.consulta;


                        agregarMensaje(
                            consulta,
                            "mensaje-cliente"
                        );


                        responderConsulta(
                            consulta
                        );

                    }
                );

            }
        );


    asistenteReferencia =
        asistente;

}


// =====================================================
// IDIOMA DEL ASISTENTE
// =====================================================

function actualizarAsistenteIdioma() {

    if (
        !asistenteReferencia
    ) {

        return;

    }


    const boton =
        asistenteReferencia.querySelector(
            ".asistente-boton-texto"
        );


    const input =
        asistenteReferencia.querySelector(
            "#asistente-consulta"
        );


    const encabezado =
        asistenteReferencia.querySelector(
            ".asistente-encabezado strong"
        );


    if (
        idiomaActual ===
        "zh"
    ) {

        if (boton) {

            boton.textContent =
                "帮助";

        }


        if (input) {

            input.placeholder =
                "输入您的问题…";

        }


        if (encabezado) {

            encabezado.textContent =
                "Mi Tienda 助手";

        }

    } else {

        if (boton) {

            boton.textContent =
                "Ayuda";

        }


        if (input) {

            input.placeholder =
                "Escribe tu consulta…";

        }


        if (encabezado) {

            encabezado.textContent =
                "Asistente de Mi Tienda";

        }

    }

}


// =====================================================
// SERVICE WORKER / PWA
// =====================================================
//
// Esta parte trabaja junto con el nuevo
// service-worker.js.
//
// IMPORTANTE:
// service-worker.js debe estar en la misma carpeta
// que este script.js.
// =====================================================

if (
    "serviceWorker" in navigator
) {

    let recargaPorActualizacion =
        false;


    navigator.serviceWorker.addEventListener(
        "controllerchange",
        function () {

            if (
                recargaPorActualizacion
            ) {

                return;

            }


            recargaPorActualizacion =
                true;


            console.log(
                "[Mi Tienda] Nueva versión aplicada."
            );


            window.location.reload();

        }
    );


    navigator.serviceWorker.addEventListener(
        "message",
        function (
            evento
        ) {

            if (
                evento.data &&
                evento.data.type ===
                "NUEVA_VERSION_DISPONIBLE"
            ) {

                console.log(
                    "[Mi Tienda] Nueva versión disponible:",
                    evento.data.version
                );

            }

        }
    );


    window.addEventListener(
        "load",
        async function () {

            try {

                const registro =
                    await navigator.serviceWorker.register(
                        "./service-worker.js",
                        {
                            updateViaCache:
                                "none"
                        }
                    );


                console.log(
                    "[Mi Tienda] Service Worker registrado."
                );


                await registro.update();


                registro.addEventListener(
                    "updatefound",
                    function () {

                        const nuevoWorker =
                            registro.installing;


                        if (
                            !nuevoWorker
                        ) {

                            return;

                        }


                        nuevoWorker.addEventListener(
                            "statechange",
                            function () {

                                if (
                                    nuevoWorker.state ===
                                    "installed" &&

                                    navigator.serviceWorker.controller
                                ) {

                                    console.log(
                                        "[Mi Tienda] Nueva versión encontrada."
                                    );


                                    nuevoWorker.postMessage({

                                        type:
                                            "SKIP_WAITING"

                                    });

                                }

                            }
                        );

                    }
                );


            } catch (
                error
            ) {

                console.error(
                    "[Mi Tienda] Error con Service Worker:",
                    error
                );

            }

        }
    );

}


// =====================================================
// SINCRONIZAR ENTRE PESTAÑAS
// =====================================================

window.addEventListener(
    "storage",
    function (
        evento
    ) {

        if (
            evento.key ===
            "carrito"
        ) {

            carrito =
                obtenerCarritoGuardado();


            actualizarContador();

            mostrarCarrito();

        }


        if (
            evento.key ===
            "paisMiTienda"
        ) {

            paisSeleccionado =
                evento.newValue ||
                "NI";


            if (
                !configuracionMonedas[
                    paisSeleccionado
                ]
            ) {

                paisSeleccionado =
                    "NI";

            }


            actualizarSelectorMoneda();

            actualizarPreciosPagina();

            mostrarCarrito();

        }


        if (
            evento.key ===
            "idioma"
        ) {

            cambiarIdioma(
                evento.newValue ||
                "es"
            );

        }

    }
);


// =====================================================
// INICIALIZACIÓN
// =====================================================

function iniciarTienda() {

    cargarCarritoCompartido();


    crearCarritoFlotante();


    crearAsistenteVirtual();


    configurarBotonesAgregar();


    configurarExploradorProductos();


    configurarMenuIdiomas();


    crearSelectorMoneda();


    cambiarIdioma(
        idiomaActual
    );


    actualizarPreciosPagina();


    actualizarContador();


    mostrarCarrito();


    actualizarSelectorMoneda();

}


// =====================================================
// ARRANCAR
// =====================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarTienda
    );

} else {

    iniciarTienda();

}
