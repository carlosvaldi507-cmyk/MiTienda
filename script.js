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
// FORMATO DE PRECIOS EN CÓRDOBAS
// =====================================================

function formatoMoneda(precio) {

    const numero = Number(precio);

    if (!Number.isFinite(numero)) {
        return "C$ 0.00";
    }

    return "C$ " + numero.toLocaleString(
        "es-NI",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}

// =====================================================
// CARRITO
// =====================================================

function normalizarCarrito(valor) {

    if (!Array.isArray(valor)) {
        return [];
    }

    return valor.reduce(function (productosValidos, producto) {

        const cantidad = Number(producto?.cantidad);

        const productoCatalogo =
            Array.isArray(window.productos)
                ? window.productos.find(function (item) {
                    const mismoId = producto?.id != null &&
                        String(item.id) === String(producto.id);

                    return (mismoId || item.nombre === producto?.nombre) && item.stock;
                })
                : null;

        const cantidadNormalizada =
            Math.floor(cantidad);

        if (
            !productoCatalogo ||
            !Number.isFinite(cantidad) ||
            cantidadNormalizada <= 0
        ) {
            return productosValidos;
        }

        productosValidos.push({

            id:
                productoCatalogo.id,

            nombre:
                productoCatalogo.nombre,

            precio:
                productoCatalogo.precio,

            cantidad:
                Math.min(cantidadNormalizada, 99)

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

// El carrito acompaña al cliente durante una semana; no debe perder una compra por una pausa corta.
const DURACION_CARRITO = 7 * 24 * 60 * 60 * 1000;
const AVISO_CARRITO = 24 * 60 * 60 * 1000;
const CLAVE_EXPIRACION = "expiracionCarrito";
const CLAVE_AVISO = "recordatorioCarritoMostrado";
let intervaloVigenciaCarrito;

function limpiarVigenciaCarrito() {
    localStorage.removeItem(CLAVE_EXPIRACION);
    localStorage.removeItem(CLAVE_AVISO);
}

function obtenerExpiracionCarrito() {
    let expiracion = Number(localStorage.getItem(CLAVE_EXPIRACION));
    if (carrito.length && (!Number.isFinite(expiracion) || expiracion <= 0)) {
        expiracion = Date.now() + DURACION_CARRITO;
        localStorage.setItem(CLAVE_EXPIRACION, String(expiracion));
        localStorage.removeItem(CLAVE_AVISO);
    }
    return expiracion || 0;
}

function mostrarAvisoVigencia(mensaje) {
    if (window.todoKlickNotificaciones) {
        window.todoKlickNotificaciones.agregar("Aviso importante", mensaje, "\ud83d\udd14");
        return;
    }
    const aviso = document.createElement("div");
    aviso.className = "notificacion-carrito mostrar";
    aviso.setAttribute("role", "alert");
    aviso.innerHTML = '<div class="notificacion-icono">&#9201;</div><div class="notificacion-texto"><strong></strong></div>';
    aviso.querySelector("strong").textContent = mensaje;
    document.body.appendChild(aviso);
    setTimeout(function () {
        aviso.classList.remove("mostrar");
        setTimeout(function () { aviso.remove(); }, 350);
    }, 6000);
}

function actualizarVigenciaCarrito() {
    const panel = document.getElementById("tiempo-carrito");
    const cuenta = document.getElementById("cuenta-regresiva-carrito");
    if (!carrito.length) {
        limpiarVigenciaCarrito();
        if (panel) panel.hidden = true;
        return;
    }
    const restante = obtenerExpiracionCarrito() - Date.now();
    if (restante <= 0) {
        carrito = [];
        limpiarVigenciaCarrito();
        guardarCarrito();
        actualizarContador();
        mostrarCarrito();
        mostrarAvisoVigencia("El tiempo de tu carrito termin\u00f3 y los productos fueron retirados.");
        return;
    }
    if (panel && cuenta) {
        const segundos = Math.ceil(restante / 1000);
        cuenta.textContent = String(Math.floor(segundos / 60)).padStart(2, "0") + ":" + String(segundos % 60).padStart(2, "0");
        panel.hidden = false;
        panel.classList.toggle("recordatorio", restante <= AVISO_CARRITO);
    }
    if (restante <= AVISO_CARRITO && localStorage.getItem(CLAVE_AVISO) !== "true") {
        localStorage.setItem(CLAVE_AVISO, "true");
        mostrarAvisoVigencia("Tu carrito vence mañana. Finaliza tu compra para conservar tus productos.");
    }
}

function iniciarVigenciaCarrito() {
    actualizarVigenciaCarrito();
    clearInterval(intervaloVigenciaCarrito);
    intervaloVigenciaCarrito = setInterval(actualizarVigenciaCarrito, 1000);
}


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

        if (carrito.length) {
            obtenerExpiracionCarrito();
        } else {
            limpiarVigenciaCarrito();
        }

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

    const contadorMovil = document.querySelector('[data-accion-movil="carrito"] em');
    if (contadorMovil) {
        contadorMovil.textContent = cantidad;
        contadorMovil.hidden = cantidad === 0;
    }


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

        contador.hidden = cantidad === 0;

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

        contadorFlotante.hidden = cantidad === 0;

    }


    // =================================================
    // MOSTRAR / OCULTAR CARRITO FLOTANTE
    // =================================================

    const carritoFlotante =
        document.getElementById(
            "carrito-flotante"
        );


    if (carritoFlotante) {

        if (window.matchMedia("(max-width: 700px)").matches) {

            carritoFlotante.style.setProperty(
                "display",
                "none",
                "important"
            );

            carritoFlotante.setAttribute(
                "aria-hidden",
                "true"
            );

        } else if (cantidad > 0) {

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
            hidden
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

                    const id =
                        boton.dataset.id;

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


                    const productoCatalogo =
                        Array.isArray(window.productos)
                            ? window.productos.find(function (producto) {
                                return (
                                    (id && String(producto.id) === String(id)) ||
                                    producto.nombre === nombre
                                ) && producto.stock;
                            })
                            : null;

                    const precio =
                        Number(productoCatalogo?.precio);


                    if (
                        !Number.isFinite(
                            precio
                        )
                    ) {

                        console.error(
                            "El producto no está disponible en el catálogo."
                        );

                        return;

                    }


                    const existente =
                        carrito.find(
                            function (
                                producto
                            ) {

                                return (
                                    String(producto.id) ===
                                    String(productoCatalogo.id)
                                );

                            }
                        );


                    if (existente) {

                        existente.cantidad = Math.min(
                            existente.cantidad + 1,
                            99
                        );

                    } else {

                        carrito.push({

                            id:
                                productoCatalogo.id,

                            nombre:
                                productoCatalogo.nombre,

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
            "Ofertas especiales de Todo Klick",

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
            "Todo Klick",

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
            "© 2026 Todo Klick — Todos los derechos reservados",

        comprasSeguras:
            "Compras fáciles, rápidas y seguras."

    },


    en: {

        nombre:
            "English",

        ofertaSuperior:
            "Special offers from Todo Klick",

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
            "Todo Klick",

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
            "© 2026 Todo Klick — All rights reserved",

        comprasSeguras:
            "Easy, fast and secure shopping."

    },


    fr: {

        nombre:
            "Français",

        ofertaSuperior:
            "Offres spéciales de Todo Klick",

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
            "Todo Klick",

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
            "© 2026 Todo Klick — Tous droits réservés",

        comprasSeguras:
            "Achats simples, rapides et sécurisés."

    },


    pt: {

        nombre:
            "Português",

        ofertaSuperior:
            "Ofertas especiais da Todo Klick",

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
            "Todo Klick",

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
            "© 2026 Todo Klick — Todos os direitos reservados",

        comprasSeguras:
            "Compras fáceis, rápidas e seguras."

    },


    zh: {

        nombre:
            "中文",

        ofertaSuperior:
            "Todo Klick 特别优惠",

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
            "Todo Klick",

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
            "© 2026 Todo Klick — 保留所有权利",

        comprasSeguras:
            "简单、快速、安全的购物。"

    }

};

// Textos de componentes dinámicos y formularios. Se mantienen junto al
// diccionario principal para que ninguna parte interactiva quede en español.
Object.assign(traducciones.es, {
    buscarPlaceholder: "¿Qué estás buscando?", buscar: "Buscar", cerrar: "Cerrar", abrirCarrito: "Abrir carrito",
    catalogoTitulo: "Catálogo de productos", catalogoDescripcion: "Encuentra productos para tu hogar y negocio.",
    categoria: "Categoría", todasCategorias: "Todas las categorías", ordenar: "Ordenar", relevancia: "Relevancia",
    masRecientes: "Más recientes", menorPrecio: "Menor precio", mayorPrecio: "Mayor precio", mostrar: "Mostrar",
    mostrandoProductos: "Mostrando {desde}–{hasta} de {total} productos", sinResultados: "No encontramos productos con esos criterios.",
    anterior: "Anterior", siguiente: "Siguiente", paginaAnterior: "Página anterior", paginaSiguiente: "Página siguiente",
    disponible: "Disponible", agotado: "Agotado", estrellasDeCinco: "{valor} de 5 estrellas", general: "General",
    ayuda: "Ayuda", asistenteTitulo: "Asistente Todo Klick", asistenteEnLinea: "En línea para ayudarte",
    saludoAsistente: "¡Hola! Cuéntame qué necesitas y te ayudaré a encontrarlo, comprarlo o revisar tu carrito.",
    comoComprar: "Cómo comprar", verCarrito: "Ver carrito", productos: "Productos", escribeConsulta: "Escribe tu consulta…",
    enviarConsulta: "Enviar consulta", respuestaCarrito: "Abro tu carrito para que revises tus productos.",
    respuestaCompra: "Elige un producto, agrégalo al carrito y después finaliza tu compra por WhatsApp.",
    respuestaProducto: "Puedes agregarlo al carrito desde su tarjeta.",
    respuestaDefault: "Puedo ayudarte con productos, precios, disponibilidad, compras o tu carrito. ¿Qué necesitas?",
    eliminarProducto: "Eliminar producto", confirmarVaciar: "¿Quieres quitar todos los productos del carrito?"
});

Object.assign(traducciones.en, {
    buscarPlaceholder: "What are you looking for?", buscar: "Search", cerrar: "Close", abrirCarrito: "Open cart",
    catalogoTitulo: "Product catalog", catalogoDescripcion: "Find products for your home and business.",
    categoria: "Category", todasCategorias: "All categories", ordenar: "Sort", relevancia: "Relevance",
    masRecientes: "Newest", menorPrecio: "Lowest price", mayorPrecio: "Highest price", mostrar: "Show",
    mostrandoProductos: "Showing {desde}–{hasta} of {total} products", sinResultados: "No products match those filters.",
    anterior: "Previous", siguiente: "Next", paginaAnterior: "Previous page", paginaSiguiente: "Next page",
    disponible: "Available", agotado: "Out of stock", estrellasDeCinco: "{valor} out of 5 stars", general: "General",
    ayuda: "Help", asistenteTitulo: "Todo Klick Assistant", asistenteEnLinea: "Online and ready to help",
    saludoAsistente: "Hi! Tell me what you need and I’ll help you find it, buy it, or review your cart.",
    comoComprar: "How to buy", verCarrito: "View cart", productos: "Products", escribeConsulta: "Type your question…",
    enviarConsulta: "Send question", respuestaCarrito: "I’ll open your cart so you can review your products.",
    respuestaCompra: "Choose a product, add it to your cart, then complete your order through WhatsApp.",
    respuestaProducto: "You can add it to your cart from its product card.",
    respuestaDefault: "I can help with products, prices, availability, orders, or your cart. What do you need?",
    eliminarProducto: "Remove product", confirmarVaciar: "Do you want to remove every product from your cart?"
});

Object.assign(traducciones.fr, {
    buscarPlaceholder: "Que recherchez-vous ?", buscar: "Rechercher", cerrar: "Fermer", abrirCarrito: "Ouvrir le panier",
    catalogoTitulo: "Catalogue de produits", catalogoDescripcion: "Trouvez des produits pour votre maison et votre entreprise.",
    categoria: "Catégorie", todasCategorias: "Toutes les catégories", ordenar: "Trier", relevancia: "Pertinence",
    masRecientes: "Plus récents", menorPrecio: "Prix croissant", mayorPrecio: "Prix décroissant", mostrar: "Afficher",
    mostrandoProductos: "Affichage de {desde} à {hasta} sur {total} produits", sinResultados: "Aucun produit ne correspond à ces critères.",
    anterior: "Précédent", siguiente: "Suivant", paginaAnterior: "Page précédente", paginaSiguiente: "Page suivante",
    disponible: "Disponible", agotado: "Épuisé", estrellasDeCinco: "{valor} étoiles sur 5", general: "Général",
    ayuda: "Aide", asistenteTitulo: "Assistant Todo Klick", asistenteEnLinea: "En ligne pour vous aider",
    saludoAsistente: "Bonjour ! Dites-moi ce dont vous avez besoin et je vous aiderai à le trouver, l’acheter ou vérifier votre panier.",
    comoComprar: "Comment acheter", verCarrito: "Voir le panier", productos: "Produits", escribeConsulta: "Écrivez votre question…",
    enviarConsulta: "Envoyer la question", respuestaCarrito: "J’ouvre votre panier pour que vous puissiez vérifier vos produits.",
    respuestaCompra: "Choisissez un produit, ajoutez-le au panier, puis terminez votre commande sur WhatsApp.",
    respuestaProducto: "Vous pouvez l’ajouter au panier depuis sa fiche.",
    respuestaDefault: "Je peux vous aider avec les produits, les prix, la disponibilité, les commandes ou le panier. Que recherchez-vous ?",
    eliminarProducto: "Supprimer le produit", confirmarVaciar: "Voulez-vous retirer tous les produits du panier ?"
});

Object.assign(traducciones.pt, {
    buscarPlaceholder: "O que você está procurando?", buscar: "Buscar", cerrar: "Fechar", abrirCarrito: "Abrir carrinho",
    catalogoTitulo: "Catálogo de produtos", catalogoDescripcion: "Encontre produtos para sua casa e seu negócio.",
    categoria: "Categoria", todasCategorias: "Todas as categorias", ordenar: "Ordenar", relevancia: "Relevância",
    masRecientes: "Mais recentes", menorPrecio: "Menor preço", mayorPrecio: "Maior preço", mostrar: "Mostrar",
    mostrandoProductos: "Mostrando {desde}–{hasta} de {total} produtos", sinResultados: "Nenhum produto corresponde a esses filtros.",
    anterior: "Anterior", siguiente: "Próximo", paginaAnterior: "Página anterior", paginaSiguiente: "Próxima página",
    disponible: "Disponível", agotado: "Esgotado", estrellasDeCinco: "{valor} de 5 estrelas", general: "Geral",
    ayuda: "Ajuda", asistenteTitulo: "Assistente Todo Klick", asistenteEnLinea: "Online para ajudar você",
    saludoAsistente: "Olá! Conte o que você precisa e eu ajudarei a encontrar, comprar ou revisar seu carrinho.",
    comoComprar: "Como comprar", verCarrito: "Ver carrinho", productos: "Produtos", escribeConsulta: "Digite sua pergunta…",
    enviarConsulta: "Enviar pergunta", respuestaCarrito: "Vou abrir seu carrinho para você revisar os produtos.",
    respuestaCompra: "Escolha um produto, adicione ao carrinho e finalize o pedido pelo WhatsApp.",
    respuestaProducto: "Você pode adicioná-lo ao carrinho pelo cartão do produto.",
    respuestaDefault: "Posso ajudar com produtos, preços, disponibilidade, pedidos ou seu carrinho. O que você precisa?",
    eliminarProducto: "Remover produto", confirmarVaciar: "Deseja remover todos os produtos do carrinho?"
});

Object.assign(traducciones.zh, {
    buscarPlaceholder: "您在寻找什么？", buscar: "搜索", cerrar: "关闭", abrirCarrito: "打开购物车",
    catalogoTitulo: "商品目录", catalogoDescripcion: "查找适合家庭和企业的商品。",
    categoria: "分类", todasCategorias: "所有分类", ordenar: "排序", relevancia: "相关性",
    masRecientes: "最新商品", menorPrecio: "价格从低到高", mayorPrecio: "价格从高到低", mostrar: "显示数量",
    mostrandoProductos: "正在显示第 {desde}–{hasta} 件，共 {total} 件商品", sinResultados: "没有符合这些条件的商品。",
    anterior: "上一页", siguiente: "下一页", paginaAnterior: "上一页", paginaSiguiente: "下一页",
    disponible: "有货", agotado: "缺货", estrellasDeCinco: "5 星中获得 {valor} 星", general: "综合",
    ayuda: "帮助", asistenteTitulo: "Todo Klick 助手", asistenteEnLinea: "在线为您服务",
    saludoAsistente: "您好！请告诉我您的需求，我可以帮您查找商品、购买商品或查看购物车。",
    comoComprar: "如何购买", verCarrito: "查看购物车", productos: "商品", escribeConsulta: "请输入您的问题…",
    enviarConsulta: "发送问题", respuestaCarrito: "我将打开购物车，方便您查看商品。",
    respuestaCompra: "选择商品并加入购物车，然后通过 WhatsApp 完成订单。",
    respuestaProducto: "您可以在商品卡片上将其加入购物车。",
    respuestaDefault: "我可以帮助您了解商品、价格、库存、订单或购物车。请问您需要什么？",
    eliminarProducto: "移除商品", confirmarVaciar: "您要清空购物车中的所有商品吗？"
});

Object.assign(traducciones.es, { ultimoPaso:"ÚLTIMO PASO", entregaTitulo:"¿Dónde entregamos tu pedido?", entregaIntro:"Estos datos se incluirán en tu mensaje de WhatsApp para confirmar la compra.", nombreCompleto:"Nombre completo", tuNombre:"Tu nombre", telefono:"Teléfono", direccionEntrega:"Dirección de entrega", direccionEjemplo:"Barrio, ciudad y una referencia", metodoEntrega:"Método de entrega", domicilio:"Entrega a domicilio", retiro:"Retiro en tienda", notaPedido:"Nota para el pedido", opcional:"Opcional", continuarWhatsApp:"Continuar a WhatsApp" });
Object.assign(traducciones.en, { ultimoPaso:"FINAL STEP", entregaTitulo:"Where should we deliver your order?", entregaIntro:"These details will be included in your WhatsApp message to confirm the purchase.", nombreCompleto:"Full name", tuNombre:"Your name", telefono:"Phone number", direccionEntrega:"Delivery address", direccionEjemplo:"Neighborhood, city, and a nearby landmark", metodoEntrega:"Delivery method", domicilio:"Home delivery", retiro:"Store pickup", notaPedido:"Order note", opcional:"Optional", continuarWhatsApp:"Continue to WhatsApp" });
Object.assign(traducciones.fr, { ultimoPaso:"DERNIÈRE ÉTAPE", entregaTitulo:"Où devons-nous livrer votre commande ?", entregaIntro:"Ces informations seront ajoutées à votre message WhatsApp pour confirmer l’achat.", nombreCompleto:"Nom complet", tuNombre:"Votre nom", telefono:"Téléphone", direccionEntrega:"Adresse de livraison", direccionEjemplo:"Quartier, ville et point de repère", metodoEntrega:"Mode de livraison", domicilio:"Livraison à domicile", retiro:"Retrait en magasin", notaPedido:"Note de commande", opcional:"Facultatif", continuarWhatsApp:"Continuer sur WhatsApp" });
Object.assign(traducciones.pt, { ultimoPaso:"ÚLTIMA ETAPA", entregaTitulo:"Onde devemos entregar seu pedido?", entregaIntro:"Esses dados serão incluídos na mensagem do WhatsApp para confirmar a compra.", nombreCompleto:"Nome completo", tuNombre:"Seu nome", telefono:"Telefone", direccionEntrega:"Endereço de entrega", direccionEjemplo:"Bairro, cidade e um ponto de referência", metodoEntrega:"Método de entrega", domicilio:"Entrega em domicílio", retiro:"Retirada na loja", notaPedido:"Observação do pedido", opcional:"Opcional", continuarWhatsApp:"Continuar no WhatsApp" });
Object.assign(traducciones.zh, { ultimoPaso:"最后一步", entregaTitulo:"您的订单要送到哪里？", entregaIntro:"这些信息将包含在 WhatsApp 消息中，以便确认购买。", nombreCompleto:"姓名", tuNombre:"请输入姓名", telefono:"电话号码", direccionEntrega:"配送地址", direccionEjemplo:"社区、城市和附近地标", metodoEntrega:"配送方式", domicilio:"送货上门", retiro:"到店自取", notaPedido:"订单备注", opcional:"选填", continuarWhatsApp:"前往 WhatsApp" });

Object.assign(traducciones.es, { opcionesTitulo:"Más formas de comprar", opcionesDescripcion:"Elige una herramienta cuando la necesites.", opcionCategorias:"Explorar categorías", opcionInteligente:"Compra inteligente", opcionBeneficios:"Ventajas de comprar aquí", cerrarOpcion:"Cerrar opción", productosEnInicio:"Productos para ti", cargarMas:"Mostrar más productos", resumenInicio:"Mostrando {visibles} de {total} productos" });
Object.assign(traducciones.en, { opcionesTitulo:"More ways to shop", opcionesDescripcion:"Choose a tool whenever you need it.", opcionCategorias:"Browse categories", opcionInteligente:"Smart shopping", opcionBeneficios:"Shopping benefits", cerrarOpcion:"Close option", productosEnInicio:"Products for you", cargarMas:"Show more products", resumenInicio:"Showing {visibles} of {total} products" });
Object.assign(traducciones.fr, { opcionesTitulo:"D’autres façons d’acheter", opcionesDescripcion:"Choisissez un outil lorsque vous en avez besoin.", opcionCategorias:"Explorer les catégories", opcionInteligente:"Achat intelligent", opcionBeneficios:"Avantages de la boutique", cerrarOpcion:"Fermer l’option", productosEnInicio:"Produits pour vous", cargarMas:"Afficher plus de produits", resumenInicio:"Affichage de {visibles} produits sur {total}" });
Object.assign(traducciones.pt, { opcionesTitulo:"Mais formas de comprar", opcionesDescripcion:"Escolha uma ferramenta quando precisar.", opcionCategorias:"Explorar categorias", opcionInteligente:"Compra inteligente", opcionBeneficios:"Vantagens de comprar aqui", cerrarOpcion:"Fechar opção", productosEnInicio:"Produtos para você", cargarMas:"Mostrar mais produtos", resumenInicio:"Mostrando {visibles} de {total} produtos" });
Object.assign(traducciones.zh, { opcionesTitulo:"更多购物方式", opcionesDescripcion:"需要时请选择相应工具。", opcionCategorias:"浏览分类", opcionInteligente:"智能购物", opcionBeneficios:"购物优势", cerrarOpcion:"关闭选项", productosEnInicio:"为您推荐的商品", cargarMas:"显示更多商品", resumenInicio:"正在显示 {visibles} 件，共 {total} 件商品" });

Object.assign(traducciones.es, { imagenNoDisponible: "Imagen próximamente" });
Object.assign(traducciones.en, { imagenNoDisponible: "Image coming soon" });
Object.assign(traducciones.fr, { imagenNoDisponible: "Image bientôt disponible" });
Object.assign(traducciones.pt, { imagenNoDisponible: "Imagem em breve" });
Object.assign(traducciones.zh, { imagenNoDisponible: "图片即将上线" });


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

function tf(clave, valores) {
    return Object.entries(valores || {}).reduce(function (texto, entrada) {
        return texto.replaceAll("{" + entrada[0] + "}", String(entrada[1]));
    }, t(clave));
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

    if (buscador) {
        buscador.placeholder = t("buscarPlaceholder");
    }

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (elemento) {
        elemento.placeholder = t(elemento.dataset.i18nPlaceholder);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (elemento) {
        elemento.setAttribute("aria-label", t(elemento.dataset.i18nAria));
    });

    document.getElementById("checkout-datos")?.remove();

    if (document.getElementById("lista-productos")) {
        if (document.getElementById("herramientas-catalogo")) {
            estadoCatalogo.categoria = "todos";
            estadoCatalogo.pagina = 1;
            document.getElementById("herramientas-catalogo").remove();
            document.getElementById("paginacion-catalogo")?.remove();
            configurarExploradorProductos();
        } else {
            mostrarProductos();
        }
    }

    renderizarCategoriasInicio();

    if (asistenteReferencia) {
        asistenteReferencia.remove();
        asistenteReferencia = null;
        crearAsistenteVirtual();
        actualizarAsistenteIdioma();
    }

    window.dispatchEvent(new CustomEvent("idiomaCambiado", { detail: { idioma: idioma } }));

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
                                "Mi carrito de Todo Klick",

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
                    aria-label="${t("eliminarProducto")}"
                >
                    🗑️
                </button>

            `;


            item.querySelector(
                ".nombre-producto"
            ).textContent =
                nombreProductoLocalizado(producto.id, producto.nombre);


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

const CLAVE_PEDIDOS = "pedidosTodoKlick";
const CLAVE_DATOS_CLIENTE = "datosClienteTodoKlick";

function obtenerPedidosGuardados() {
    try {
        const pedidos = JSON.parse(localStorage.getItem(CLAVE_PEDIDOS) || "[]");
        return Array.isArray(pedidos) ? pedidos : [];
    } catch (error) {
        return [];
    }
}

function crearNumeroPedido() {
    const fecha = new Date();
    const dia = String(fecha.getFullYear()).slice(-2) + String(fecha.getMonth() + 1).padStart(2, "0") + String(fecha.getDate()).padStart(2, "0");
    return "TK-" + dia + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

function guardarPedidoPendiente(cliente, resumen) {
    const pedido = {
        numero: crearNumeroPedido(),
        fecha: new Date().toISOString(),
        clienteUid: window.todoKlickNube?.usuario?.uid || "",
        estado: "Pendiente de confirmaci\u00f3n",
        cliente: {
            nombre: String(cliente.get("nombre") || ""),
            telefono: String(cliente.get("telefono") || ""),
            direccion: String(cliente.get("direccion") || ""),
            entrega: String(cliente.get("entrega") || "")
        },
        productos: carrito.map(function (producto) {
            return { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: producto.cantidad };
        }),
        total: resumen.total
    };
    const pedidos = obtenerPedidosGuardados();
    pedidos.unshift(pedido);
    localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos.slice(0, 25)));
    return pedido;
}

function abrirCheckout() {

    if (
        !carrito.length
    ) {

        alert(t("carritoVacio"));


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
                    aria-label="${t("cerrar")}"
                >
                    ×
                </button>


                <span class="checkout-paso">
                    ${t("ultimoPaso")}
                </span>


                <h2>
                    ${t("entregaTitulo")}
                </h2>


                <p>
                    ${t("entregaIntro")}
                </p>

                <aside class="checkout-resumen-pedido" aria-live="polite">
                    <h3>Resumen de tu pedido</h3>
                    <div id="checkout-resumen-lineas"></div>
                    <p>El costo y el tiempo de entrega se confirman contigo por WhatsApp.</p>
                </aside>


                <label>

                    ${t("nombreCompleto")}

                    <input
                        name="nombre"
                        required
                        autocomplete="name"
                        placeholder="${t("tuNombre")}"
                    >

                </label>

                <label class="guardar-datos-checkout">
                    <input type="checkbox" name="guardarDatos" checked>
                    <span>Guardar mis datos para la pr\u00f3xima compra</span>
                </label>


                <label>

                    ${t("telefono")}

                    <input
                        name="telefono"
                        required
                        minlength="8"
                        pattern="[0-9+() -]{8,20}"
                        inputmode="tel"
                        autocomplete="tel"
                        placeholder="Ej. 8888 8888"
                    >

                </label>


                <label class="campo-direccion-checkout">

                    ${t("direccionEntrega")}

                    <textarea
                        name="direccion"
                        required
                        rows="3"
                        placeholder="${t("direccionEjemplo")}"
                    ></textarea>

                </label>


                <label>

                    ${t("metodoEntrega")}

                    <select
                        name="entrega"
                    >

                        <option>
                            ${t("domicilio")}
                        </option>

                        <option>
                            ${t("retiro")}
                        </option>

                    </select>

                </label>


                <label>

                    ${t("notaPedido")}

                    <input
                        name="nota"
                        maxlength="180"
                        placeholder="${t("opcional")}"
                    >

                </label>


                <button
                    class="confirmar-pedido"
                    type="submit"
                >
                    ${t("continuarWhatsApp")}
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

                    const pedido = guardarPedidoPendiente(cliente, resumen);

                    if (window.todoKlickNube?.usuario?.uid) {
                        window.todoKlickNube.guardarPedido(pedido).catch(function (error) {
                            console.warn("El pedido quedó guardado en este dispositivo; no se pudo sincronizar todavía.", error);
                        });
                    }

                    if (cliente.get("guardarDatos")) {
                        localStorage.setItem(CLAVE_DATOS_CLIENTE, JSON.stringify({
                            nombre: cliente.get("nombre"),
                            telefono: cliente.get("telefono"),
                            direccion: cliente.get("direccion"),
                            entrega: cliente.get("entrega")
                        }));
                    } else {
                        localStorage.removeItem(CLAVE_DATOS_CLIENTE);
                    }


                    let mensaje =
                        "Hola, quiero confirmar el pedido " + pedido.numero + ":\n\n";


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

                    mensaje += "\n\nEl costo y tiempo de entrega se confirman por WhatsApp.";


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
                        (cliente.get("direccion") || "No aplica (retiro en tienda)");


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

                    mostrarAvisoVigencia("Pedido " + pedido.numero + " guardado. Completa la confirmaci\u00f3n en WhatsApp.");

                }
            );

    }


    checkout.classList.add(
        "visible"
    );

    const resumenCheckout = obtenerResumenCompra();
    const lineasResumen = checkout.querySelector("#checkout-resumen-lineas");
    if (lineasResumen) {
        const unidades = carrito.reduce(function (total, producto) {
            return total + (Number(producto.cantidad) || 0);
        }, 0);
        lineasResumen.innerHTML = `<span><b>${unidades} producto${unidades === 1 ? "" : "s"}</b><strong>${formatoMoneda(resumenCheckout.total)}</strong></span>${resumenCheckout.descuento ? `<span>Descuento <strong>-${formatoMoneda(resumenCheckout.descuento)}</strong></span>` : ""}`;
    }

    const selectorEntrega = checkout.querySelector("[name='entrega']");
    const campoDireccion = checkout.querySelector(".campo-direccion-checkout");
    const entradaDireccion = checkout.querySelector("[name='direccion']");
    function actualizarCamposEntrega() {
        const esRetiro = selectorEntrega && selectorEntrega.value === t("retiro");
        if (campoDireccion) campoDireccion.hidden = esRetiro;
        if (entradaDireccion) entradaDireccion.required = !esRetiro;
    }
    if (selectorEntrega) selectorEntrega.onchange = actualizarCamposEntrega;

    try {
        const guardados = JSON.parse(localStorage.getItem(CLAVE_DATOS_CLIENTE) || "null");
        if (guardados) {
            checkout.querySelector("[name='nombre']").value = guardados.nombre || "";
            checkout.querySelector("[name='telefono']").value = guardados.telefono || "";
            checkout.querySelector("[name='direccion']").value = guardados.direccion || "";
            checkout.querySelector("[name='entrega']").value = guardados.entrega || checkout.querySelector("[name='entrega']").value;
        }
    } catch (error) {
        localStorage.removeItem(CLAVE_DATOS_CLIENTE);
    }

    actualizarCamposEntrega();


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
// EXPLORADOR HISTÓRICO DE PRODUCTOS
// =====================================================

function configurarExploradorProductosLegacy() {

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
                        Asistente Todo Klick
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


        const palabrasCarrito = ["carrito", "cart", "panier", "carrinho", "购物车"];
        const palabrasCompra = ["compr", "buy", "order", "achat", "achet", "commande", "pedido", "购买", "订单"];

        if (palabrasCarrito.some(function (palabra) { return texto.includes(palabra); })) {
            agregarMensaje(t("respuestaCarrito"), "mensaje-asistente");
            abrirCarrito();
            return;
        }

        if (palabrasCompra.some(function (palabra) { return texto.includes(palabra); })) {
            agregarMensaje(t("respuestaCompra"), "mensaje-asistente");
            return;
        }

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

                t("respuestaProducto"),

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
                    ? "每个产品都显示尼加拉瓜科多巴的价格。您可以将产品加入购物车，然后通过 WhatsApp 完成购买。"
                    : "Cada producto muestra su precio en córdobas nicaragüenses. Puedes agregarlo al carrito y finalizar tu compra por WhatsApp.",

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


        agregarMensaje(t("respuestaDefault"), "mensaje-asistente");

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
// IDIOMA HISTÓRICO DEL ASISTENTE
// =====================================================

function actualizarAsistenteIdiomaLegacy() {

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
                "Todo Klick 助手";

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
                "Asistente Todo Klick";

        }

    }

}

// =====================================================
// PORTADA CENTRADA EN PRODUCTOS
// Las funciones complementarias permanecen disponibles bajo demanda.
// =====================================================

function configurarInicioPriorizado() {
    const esPortada = !/catalogo\.html$/i.test(window.location.pathname);
    const productosSeccion = document.getElementById("productos");
    const carrusel = document.querySelector(".carrusel");

    if (!esPortada || !productosSeccion || !carrusel || document.getElementById("opciones-compra-inicio")) {
        return;
    }

    document.body.classList.add("pagina-inicio");

    productosSeccion.classList.add("productos-principales-inicio");
    carrusel.before(productosSeccion);

    const accionesProductos = productosSeccion.querySelector(".boton-ver-catalogo");
    if (accionesProductos) {
        accionesProductos.classList.add("acciones-productos-inicio");
        const resumenProductos = document.createElement("p");
        resumenProductos.id = "resumen-productos-inicio";
        resumenProductos.className = "resumen-productos-inicio";

        const cargarMas = document.createElement("button");
        cargarMas.id = "cargar-mas-productos-inicio";
        cargarMas.type = "button";
        cargarMas.className = "cargar-mas-productos-inicio";
        cargarMas.textContent = t("cargarMas");
        cargarMas.addEventListener("click", function () {
            estadoCatalogo.limiteInicio += 24;
            mostrarProductos();
        });

        accionesProductos.prepend(cargarMas);
        accionesProductos.before(resumenProductos);
    }

    const buscadorInicio = document.getElementById("buscador");
    if (buscadorInicio) {
        buscadorInicio.addEventListener("input", function () {
            estadoCatalogo.busqueda = buscadorInicio.value;
            estadoCatalogo.limiteInicio = 24;
            mostrarProductos();
        });
    }

    const categoriasDisponibles = [];
    const categoriasVistas = new Set();
    (window.productos || []).forEach(function (producto) {
        if (producto.activo === false) return;

        const categoria = localizarProducto(producto).categoria;
        const clave = normalizarTextoCatalogo(categoria);
        if (!clave || categoriasVistas.has(clave)) return;

        categoriasVistas.add(clave);
        categoriasDisponibles.push({ clave: clave, nombre: categoria });
    });

    if (categoriasDisponibles.length) {
        const exploradorCategorias = document.createElement("section");
        exploradorCategorias.id = "explorador-categorias-inicio";
        exploradorCategorias.className = "explorador-categorias-inicio";
        exploradorCategorias.innerHTML = `
            <button type="button" class="abrir-explorador-categorias" aria-expanded="false" aria-controls="panel-categorias-inicio-rapido">
                <span aria-hidden="true">☰</span>
                <span>${t("opcionCategorias")}</span>
                <small>${categoriasDisponibles.length}</small>
            </button>
            <div id="panel-categorias-inicio-rapido" class="panel-categorias-inicio-rapido" hidden>
                <p>${t("tituloCategorias")}</p>
                <div class="chips-categorias-inicio">
                    <button type="button" class="activo" data-categoria-inicio="todos">${t("todasCategorias")}</button>
                    ${categoriasDisponibles.map(function (categoria) {
                        return `<button type="button" data-categoria-inicio="${escaparHTMLCatalogo(categoria.clave)}">${escaparHTMLCatalogo(categoria.nombre)}</button>`;
                    }).join("")}
                </div>
            </div>`;

        productosSeccion.querySelector(".seccion-titulo")?.after(exploradorCategorias);

        const abrirExplorador = exploradorCategorias.querySelector(".abrir-explorador-categorias");
        const panelExplorador = exploradorCategorias.querySelector(".panel-categorias-inicio-rapido");

        abrirExplorador.addEventListener("click", function () {
            const abrir = panelExplorador.hidden;
            panelExplorador.hidden = !abrir;
            abrirExplorador.setAttribute("aria-expanded", String(abrir));
        });

        exploradorCategorias.querySelectorAll("[data-categoria-inicio]").forEach(function (boton) {
            boton.addEventListener("click", function () {
                estadoCatalogo.categoria = boton.dataset.categoriaInicio;
                estadoCatalogo.limiteInicio = 24;
                exploradorCategorias.querySelectorAll("[data-categoria-inicio]").forEach(function (opcion) {
                    opcion.classList.toggle("activo", opcion === boton);
                });
                mostrarProductos();
                panelExplorador.hidden = true;
                abrirExplorador.setAttribute("aria-expanded", "false");
                document.getElementById("lista-productos")?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });
    }

}

// En el catálogo completo, el cliente elige primero cómo desea comprar.
function configurarOpcionesCatalogo() {
    Object.assign(traducciones.es, { eligeComoComprar:"Elige c\u00f3mo quieres comprar", eligeComoComprarDescripcion:"Selecciona una opci\u00f3n para comenzar.", opcionTodos:"Ver todos los productos" });
    Object.assign(traducciones.en, { eligeComoComprar:"Choose how you want to shop", eligeComoComprarDescripcion:"Select an option to begin.", opcionTodos:"View all products" });
    Object.assign(traducciones.fr, { eligeComoComprar:"Choisissez comment acheter", eligeComoComprarDescripcion:"S\u00e9lectionnez une option pour commencer.", opcionTodos:"Voir tous les produits" });
    Object.assign(traducciones.pt, { eligeComoComprar:"Escolha como quer comprar", eligeComoComprarDescripcion:"Selecione uma op\u00e7\u00e3o para come\u00e7ar.", opcionTodos:"Ver todos os produtos" });
    Object.assign(traducciones.zh, { eligeComoComprar:"\u9009\u62e9\u8d2d\u7269\u65b9\u5f0f", eligeComoComprarDescripcion:"\u8bf7\u9009\u62e9\u4e00\u4e2a\u9009\u9879\u5f00\u59cb\u3002", opcionTodos:"\u67e5\u770b\u6240\u6709\u5546\u54c1" });
    if (!/catalogo\.html$/i.test(window.location.pathname)) return;

    const productosSeccion = document.getElementById("productos");
    const lista = document.getElementById("lista-productos");
    const titulo = productosSeccion?.querySelector(".seccion-titulo");
    if (!productosSeccion || !lista || !titulo || document.getElementById("opciones-catalogo")) return;

    const opciones = document.createElement("section");
    opciones.id = "opciones-catalogo";
    opciones.className = "opciones-compra-inicio opciones-catalogo";
    opciones.innerHTML = `
        <div class="opciones-compra-encabezado">
            <h2 data-text="eligeComoComprar">${t("eligeComoComprar")}</h2>
            <p data-text="eligeComoComprarDescripcion">${t("eligeComoComprarDescripcion")}</p>
        </div>
        <div class="selector-funciones-inicio" role="tablist" aria-label="${t("eligeComoComprar")}">
            <button type="button" data-opcion-catalogo="todos" data-text="opcionTodos">${t("opcionTodos")}</button>
            <button type="button" data-opcion-catalogo="categorias" data-text="opcionCategorias">${t("opcionCategorias")}</button>
            <button type="button" data-opcion-catalogo="inteligente" data-text="opcionInteligente">${t("opcionInteligente")}</button>
        </div>
        <div id="categorias-opcion-catalogo" class="categorias-opcion-catalogo" hidden></div>
        <div id="panel-compra-inteligente-inicio" class="panel-funcion-inicio" hidden></div>`;

    titulo.after(opciones);
    productosSeccion.classList.remove("catalogo-sin-seleccion");
    lista.hidden = false;

    const categoriasPanel = opciones.querySelector("#categorias-opcion-catalogo");
    const categorias = [];
    const vistas = new Set();
    (window.productos || []).forEach(function (producto) {
        const clave = normalizarTextoCatalogo(producto.categoria);
        if (!vistas.has(clave)) {
            vistas.add(clave);
            categorias.push({ clave: clave, nombre: producto.categoria });
        }
    });
    categoriasPanel.innerHTML = categorias.map(function (categoria) {
        return `<button type="button" data-categoria-elegida="${escaparHTMLCatalogo(categoria.clave)}">${escaparHTMLCatalogo(categoria.nombre)}</button>`;
    }).join("");

    function cerrarOpciones() {
        categoriasPanel.hidden = true;
        opciones.querySelector("#panel-compra-inteligente-inicio").hidden = true;
        opciones.classList.remove("modo-inteligente-abierto");
        opciones.querySelectorAll("[data-opcion-catalogo]").forEach(function (boton) {
            boton.classList.remove("activo");
        });
    }

    opciones.querySelectorAll("[data-opcion-catalogo]").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const opcion = boton.dataset.opcionCatalogo;
            cerrarOpciones();
            boton.classList.add("activo");
            productosSeccion.classList.add("catalogo-sin-seleccion");
            lista.hidden = opcion !== "todos";
            if (opcion === "todos") {
                productosSeccion.classList.remove("catalogo-sin-seleccion");
                estadoCatalogo.categoria = "todos";
                estadoCatalogo.pagina = 1;
                mostrarProductos();
            } else if (opcion === "categorias") {
                categoriasPanel.hidden = false;
            } else {
                productosSeccion.classList.add("catalogo-sin-seleccion");
                const panelInteligente = opciones.querySelector("#panel-compra-inteligente-inicio");
                opciones.classList.add("modo-inteligente-abierto");
                panelInteligente.hidden = false;
                setTimeout(function () {
                    panelInteligente.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 0);
            }
        });
    });

    categoriasPanel.addEventListener("click", function (evento) {
        const boton = evento.target.closest("[data-categoria-elegida]");
        if (!boton) return;
        estadoCatalogo.categoria = boton.dataset.categoriaElegida;
        estadoCatalogo.pagina = 1;
        productosSeccion.classList.remove("catalogo-sin-seleccion");
        lista.hidden = false;
        mostrarProductos();
        lista.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

function renderizarCategoriasInicio() {
    const contenedor = document.querySelector("#categorias .categorias-container");
    if (!contenedor || !Array.isArray(window.productos)) return;

    const iconos = ["🏠", "🔧", "🔌", "📷", "💾", "🎁", "🧸", "📦"];
    const categorias = [];
    const conocidas = new Set();

    window.productos.forEach(function (producto) {
        const clave = normalizarTextoCatalogo(producto.categoria);
        if (!clave || conocidas.has(clave) || producto.activo === false) return;
        conocidas.add(clave);
        categorias.push({
            clave: clave,
            nombre: localizarProducto(producto).categoria
        });
    });

    contenedor.innerHTML = "";
    categorias.forEach(function (categoria, indice) {
        const boton = document.createElement("button");
        boton.className = "categoria";
        boton.type = "button";
        boton.innerHTML = `
            <div class="icono" aria-hidden="true">${iconos[indice % iconos.length]}</div>
            <strong>${escaparHTMLCatalogo(categoria.nombre)}</strong>
            <span>${escaparHTMLCatalogo(t("verProductos"))}</span>`;
        boton.addEventListener("click", function () {
            window.location.href = "catalogo.html?categoria=" + encodeURIComponent(categoria.clave);
        });
        contenedor.appendChild(boton);
    });
}

function crearExperienciaProfesional() {
    if (document.getElementById("progreso-navegacion")) return;

    document.body.classList.add("experiencia-premium");

    const progreso = document.createElement("div");
    progreso.id = "progreso-navegacion";
    progreso.className = "progreso-navegacion";
    progreso.setAttribute("aria-hidden", "true");
    document.body.prepend(progreso);

    const encabezado = document.querySelector(".header");
    const buscadorPrincipal = document.getElementById("buscador");
    const botonBuscar = document.getElementById("boton-buscar");

    if (buscadorPrincipal && !document.getElementById("limpiar-buscador")) {
        const limpiar = document.createElement("button");
        limpiar.id = "limpiar-buscador";
        limpiar.className = "limpiar-buscador";
        limpiar.type = "button";
        limpiar.setAttribute("aria-label", "Limpiar búsqueda");
        limpiar.textContent = "×";
        limpiar.hidden = true;
        buscadorPrincipal.after(limpiar);
        limpiar.addEventListener("click", function () {
            buscadorPrincipal.value = "";
            buscadorPrincipal.dispatchEvent(new Event("input", { bubbles: true }));
            abrirBuscador();
        });
    }

    function actualizarEstadoBuscador() {
        if (!buscadorPrincipal || !botonBuscar) return;
        const hayTexto = buscadorPrincipal.value.trim().length > 0;
        botonBuscar.classList.toggle("busqueda-lista", hayTexto);
        botonBuscar.setAttribute("aria-label", hayTexto ? "Buscar y cerrar teclado" : "Abrir buscador");
        const limpiar = document.getElementById("limpiar-buscador");
        if (limpiar) limpiar.hidden = !hayTexto;
    }

    function abrirBuscador() {
        if (!buscadorPrincipal) return;
        requestAnimationFrame(function () {
            buscadorPrincipal.focus({ preventScroll: true });
            buscadorPrincipal.click();
        });
    }

    function ejecutarBusqueda() {
        if (!buscadorPrincipal) return;
        buscadorPrincipal.dispatchEvent(new Event("input", { bubbles: true }));
        buscadorPrincipal.blur();
        document.activeElement?.blur?.();
    }

    buscadorPrincipal?.setAttribute("enterkeyhint", "search");
    buscadorPrincipal?.addEventListener("input", actualizarEstadoBuscador);
    buscadorPrincipal?.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter") {
            evento.preventDefault();
            ejecutarBusqueda();
        }
    });
    buscadorPrincipal?.addEventListener("focus", actualizarEstadoBuscador);
    actualizarEstadoBuscador();

    function actualizarNavegacion() {
        const desplazamiento = window.scrollY || document.documentElement.scrollTop;
        const maximo = document.documentElement.scrollHeight - window.innerHeight;
        progreso.style.transform = "scaleX(" + (maximo > 0 ? desplazamiento / maximo : 0) + ")";
        encabezado?.classList.toggle("header-compacto", desplazamiento > 48);
    }

    window.addEventListener("scroll", actualizarNavegacion, { passive: true });
    actualizarNavegacion();

    botonBuscar?.addEventListener("pointerdown", function (evento) {
        evento.preventDefault();
    });

    botonBuscar?.addEventListener("click", function () {
        if (!buscadorPrincipal?.value.trim()) {
            abrirBuscador();
            return;
        }
        ejecutarBusqueda();
    });

    document.addEventListener("keydown", function (evento) {
        const escribiendo = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || "");
        if (evento.key === "/" && !escribiendo && buscadorPrincipal) {
            evento.preventDefault();
            buscadorPrincipal.focus();
        }
        if (evento.key === "Escape" && document.activeElement === buscadorPrincipal) {
            buscadorPrincipal.blur();
        }
    });

    const enlaceCategorias = document.querySelector('.nav a[href="#categorias"]');
    enlaceCategorias?.addEventListener("click", function (evento) {
        const selector = document.querySelector("#explorador-categorias-inicio .abrir-explorador-categorias");
        if (!selector) return;
        evento.preventDefault();
        if (selector.getAttribute("aria-expanded") !== "true") selector.click();
        document.getElementById("explorador-categorias-inicio")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    function animarTarjetas() {
        document.querySelectorAll(".producto").forEach(function (tarjeta, indice) {
            tarjeta.style.setProperty("--orden-tarjeta", String(indice % 12));
            tarjeta.classList.add("producto-listo");
        });
    }

    window.addEventListener("productosRenderizados", animarTarjetas);
    requestAnimationFrame(animarTarjetas);
}

// =====================================================
// USUARIOS DEMO: CLIENTE Y ADMINISTRADOR
// =====================================================

const USUARIOS_DEMO = Object.freeze([
    Object.freeze({
        rol: "cliente",
        nombre: "Ana Cliente",
        correo: "cliente@todoklick.demo",
        contrasena: "Cliente123!"
    }),
    Object.freeze({
        rol: "administrador",
        nombre: "Carlos Admin",
        correo: "admin@todoklick.demo",
        contrasena: "Admin123!"
    })
]);

const CLAVE_SESION_DEMO = "todoKlickSesionDemo";

function textosUsuariosDemo() {
    const textos = {
        es: {
            acceso: "ACCESO DE DEMOSTRACIÓN", titulo: "Bienvenido a Todo Klick", intro: "Prueba la experiencia con uno de los dos perfiles.",
            cliente: "Cliente", administrador: "Administrador", correo: "Correo electrónico", contrasena: "Contraseña",
            recordar: "Mantener mi sesión", entrar: "Entrar", mostrar: "Mostrar contraseña", ocultar: "Ocultar contraseña",
            cuentas: "Credenciales de muestra", usar: "Usar esta cuenta", aviso: "Demo local: estas credenciales son públicas y no deben utilizarse en producción.",
            incompleto: "Completa el correo y la contraseña.", invalido: "Las credenciales no coinciden con el perfil seleccionado.",
            miCuenta: "MI CUENTA", bienvenida: "Sesión activa", cerrarSesion: "Cerrar sesión", irCatalogo: "Explorar catálogo",
            productos: "Productos", categorias: "Categorías", pedidos: "Pedidos demo", carrito: "En carrito", favoritos: "Favoritos",
            panelAdmin: "Resumen administrativo", panelCliente: "Tu actividad", cerrar: "Cerrar", perfil: "Abrir perfil"
        },
        en: {
            acceso: "DEMO ACCESS", titulo: "Welcome to Todo Klick", intro: "Try the experience with either of the two profiles.",
            cliente: "Customer", administrador: "Administrator", correo: "Email address", contrasena: "Password",
            recordar: "Keep me signed in", entrar: "Sign in", mostrar: "Show password", ocultar: "Hide password",
            cuentas: "Sample credentials", usar: "Use this account", aviso: "Local demo: these credentials are public and must not be used in production.",
            incompleto: "Enter your email and password.", invalido: "The credentials do not match the selected profile.",
            miCuenta: "MY ACCOUNT", bienvenida: "Active session", cerrarSesion: "Sign out", irCatalogo: "Browse catalog",
            productos: "Products", categorias: "Categories", pedidos: "Demo orders", carrito: "In cart", favoritos: "Favorites",
            panelAdmin: "Admin overview", panelCliente: "Your activity", cerrar: "Close", perfil: "Open profile"
        },
        fr: {
            acceso: "ACCÈS DÉMO", titulo: "Bienvenue sur Todo Klick", intro: "Testez l’expérience avec l’un des deux profils.",
            cliente: "Client", administrador: "Administrateur", correo: "Adresse e-mail", contrasena: "Mot de passe",
            recordar: "Rester connecté", entrar: "Se connecter", mostrar: "Afficher le mot de passe", ocultar: "Masquer le mot de passe",
            cuentas: "Identifiants de test", usar: "Utiliser ce compte", aviso: "Démo locale : ces identifiants sont publics et ne doivent pas être utilisés en production.",
            incompleto: "Saisissez l’e-mail et le mot de passe.", invalido: "Les identifiants ne correspondent pas au profil choisi.",
            miCuenta: "MON COMPTE", bienvenida: "Session active", cerrarSesion: "Se déconnecter", irCatalogo: "Voir le catalogue",
            productos: "Produits", categorias: "Catégories", pedidos: "Commandes démo", carrito: "Dans le panier", favoritos: "Favoris",
            panelAdmin: "Vue administrateur", panelCliente: "Votre activité", cerrar: "Fermer", perfil: "Ouvrir le profil"
        },
        pt: {
            acceso: "ACESSO DEMONSTRATIVO", titulo: "Bem-vindo ao Todo Klick", intro: "Teste a experiência com um dos dois perfis.",
            cliente: "Cliente", administrador: "Administrador", correo: "E-mail", contrasena: "Senha",
            recordar: "Manter minha sessão", entrar: "Entrar", mostrar: "Mostrar senha", ocultar: "Ocultar senha",
            cuentas: "Credenciais de exemplo", usar: "Usar esta conta", aviso: "Demo local: estas credenciais são públicas e não devem ser usadas em produção.",
            incompleto: "Preencha o e-mail e a senha.", invalido: "As credenciais não correspondem ao perfil selecionado.",
            miCuenta: "MINHA CONTA", bienvenida: "Sessão ativa", cerrarSesion: "Sair", irCatalogo: "Ver catálogo",
            productos: "Produtos", categorias: "Categorias", pedidos: "Pedidos demo", carrito: "No carrinho", favoritos: "Favoritos",
            panelAdmin: "Resumo administrativo", panelCliente: "Sua atividade", cerrar: "Fechar", perfil: "Abrir perfil"
        },
        zh: {
            acceso: "演示登录", titulo: "欢迎来到 Todo Klick", intro: "使用以下两种账户体验应用。",
            cliente: "客户", administrador: "管理员", correo: "电子邮箱", contrasena: "密码",
            recordar: "保持登录", entrar: "登录", mostrar: "显示密码", ocultar: "隐藏密码",
            cuentas: "演示凭据", usar: "使用此账户", aviso: "本地演示：这些凭据是公开的，请勿用于生产环境。",
            incompleto: "请输入邮箱和密码。", invalido: "凭据与所选账户类型不匹配。",
            miCuenta: "我的账户", bienvenida: "已登录", cerrarSesion: "退出登录", irCatalogo: "浏览商品",
            productos: "商品", categorias: "分类", pedidos: "演示订单", carrito: "购物车", favoritos: "收藏",
            panelAdmin: "管理概览", panelCliente: "您的活动", cerrar: "关闭", perfil: "打开账户"
        }
    };

    return textos[idiomaActual] || textos.es;
}

function obtenerSesionDemo() {
    const valor = localStorage.getItem(CLAVE_SESION_DEMO) || sessionStorage.getItem(CLAVE_SESION_DEMO);
    if (!valor) return null;

    try {
        const sesion = JSON.parse(valor);
        const existe = USUARIOS_DEMO.some(function (usuario) {
            return usuario.correo === sesion.correo && usuario.rol === sesion.rol;
        });
        return existe ? sesion : null;
    } catch (error) {
        localStorage.removeItem(CLAVE_SESION_DEMO);
        sessionStorage.removeItem(CLAVE_SESION_DEMO);
        return null;
    }
}

function configurarSistemaUsuariosFirebase() {
    const boton = document.getElementById("boton-entrar");
    if (!boton || document.getElementById("sistema-usuarios-firebase")) return;
    const sistema = document.createElement("div");
    sistema.id = "sistema-usuarios-firebase";
    sistema.className = "sistema-usuarios-demo";
    sistema.setAttribute("aria-hidden", "true");
    sistema.innerHTML = '<div class="usuario-demo-panel" role="dialog" aria-modal="true"></div>';
    document.body.appendChild(sistema);
    const panel = sistema.querySelector(".usuario-demo-panel");
    const cerrar = function () { sistema.classList.remove("visible"); sistema.setAttribute("aria-hidden", "true"); document.body.classList.remove("modal-usuario-abierto"); };
    const actualizar = function () {
        const usuario = window.todoKlickNube?.usuario;
        boton.innerHTML = usuario ? '<span class="usuario-avatar-mini">' + escaparHTMLCatalogo(usuario.nombre.charAt(0)) + '</span><span class="usuario-nombre-mini">' + escaparHTMLCatalogo(usuario.nombre.split(" ")[0]) + '</span>' : '<span aria-hidden="true">👤</span><span>Entrar</span>';
        boton.classList.toggle("sesion-iniciada", Boolean(usuario));
    };
    const renderizar = function (registro) {
        const usuario = window.todoKlickNube?.usuario;
        if (usuario) {
            panel.innerHTML = '<button type="button" class="usuario-demo-cerrar">×</button><div class="usuario-cuenta-hero"><div class="usuario-avatar-grande">' + escaparHTMLCatalogo(usuario.nombre.charAt(0)) + '</div><div><span class="usuario-rol usuario-rol-cliente">CLIENTE</span><h2>' + escaparHTMLCatalogo(usuario.nombre) + '</h2><p>' + escaparHTMLCatalogo(usuario.correo) + '</p></div></div><p>Tus datos se guardan de forma privada.</p><button type="button" class="usuario-cerrar-sesion">Cerrar sesión</button>';
            panel.querySelector(".usuario-demo-cerrar").addEventListener("click", cerrar);
            panel.querySelector(".usuario-cerrar-sesion").addEventListener("click", async function () { await window.todoKlickNube.cerrarSesion(); cerrar(); });
            return;
        }
        panel.innerHTML = '<button type="button" class="usuario-demo-cerrar">×</button><div class="usuario-acceso-cabecera"><span class="usuario-demo-etiqueta">CUENTA SEGURA</span><h2>' + (registro ? "Crea tu cuenta" : "Bienvenido") + '</h2></div><form class="usuario-login-form"><label' + (registro ? "" : " hidden") + '><span>Nombre</span><input name="nombre" autocomplete="name"></label><label><span>Correo electrónico</span><input name="correo" type="email" required></label><label><span>Contraseña</span><input name="contrasena" type="password" minlength="6" required></label><p class="usuario-login-error" role="alert"></p><button class="usuario-login-enviar" type="submit">' + (registro ? "Crear cuenta" : "Entrar") + '</button></form><button type="button" class="usuario-cambiar-modo">' + (registro ? "Ya tengo cuenta" : "Crear una cuenta") + '</button>';
        panel.querySelector(".usuario-demo-cerrar").addEventListener("click", cerrar);
        panel.querySelector(".usuario-cambiar-modo").addEventListener("click", function () { renderizar(!registro); });
        panel.querySelector("form").addEventListener("submit", async function (evento) {
            evento.preventDefault();
            const datos = new FormData(evento.currentTarget);
            try {
                if (registro) await window.todoKlickNube.registrarUsuario(datos.get("nombre"), datos.get("correo"), datos.get("contrasena"));
                else await window.todoKlickNube.iniciarSesion(datos.get("correo"), datos.get("contrasena"));
            } catch (_) { panel.querySelector(".usuario-login-error").textContent = "No se pudo completar el acceso. Revisa tus datos."; }
        });
    };
    boton.addEventListener("click", function () { sistema.classList.add("visible"); sistema.setAttribute("aria-hidden", "false"); document.body.classList.add("modal-usuario-abierto"); renderizar(false); });
    sistema.addEventListener("click", function (evento) { if (evento.target === sistema) cerrar(); });
    window.todoKlickNube.alCambiarSesion(function () { actualizar(); if (sistema.classList.contains("visible")) renderizar(false); });
    actualizar();
}

function configurarPerfilClienteFirebase() {
    const boton = document.getElementById("boton-entrar");
    if (!boton || document.getElementById("sistema-perfil-cliente")) return;

    boton.removeAttribute("onclick");
    const sistema = document.createElement("div");
    sistema.id = "sistema-perfil-cliente";
    sistema.className = "sistema-usuarios-demo";
    sistema.setAttribute("aria-hidden", "true");
    sistema.innerHTML = '<div class="usuario-demo-panel perfil-cliente-panel" role="dialog" aria-modal="true"></div>';
    document.body.appendChild(sistema);
    const panel = sistema.querySelector(".usuario-demo-panel");

    const cerrar = function () {
        sistema.classList.remove("visible");
        sistema.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-usuario-abierto");
        boton.focus();
    };
    const pedidosLocales = function (usuario) {
        return obtenerPedidosGuardados().filter(function (pedido) {
            return pedido.clienteUid && pedido.clienteUid === usuario.uid;
        });
    };
    const actualizarBoton = function () {
        const usuario = window.todoKlickNube?.usuario;
        boton.classList.toggle("sesion-iniciada", Boolean(usuario));
        boton.setAttribute("aria-label", usuario ? "Abrir perfil de " + usuario.nombre : "Entrar o crear cuenta");
        boton.innerHTML = usuario
            ? '<span class="usuario-avatar-mini">' + escaparHTMLCatalogo(usuario.nombre.charAt(0)) + '</span><span class="usuario-nombre-mini">' + escaparHTMLCatalogo(usuario.nombre.split(" ")[0]) + '</span>'
            : '<span aria-hidden="true">👤</span><span>Entrar</span>';
    };
    const pintar = function (registro, pedidos) {
        const usuario = window.todoKlickNube?.usuario;
        if (!usuario) {
            panel.innerHTML = '<button type="button" class="usuario-demo-cerrar" aria-label="Cerrar">×</button><div class="usuario-acceso-cabecera"><span class="usuario-demo-etiqueta">CUENTA SEGURA</span><h2>' + (registro ? "Crea tu cuenta" : "Bienvenido") + '</h2><p>Guarda tus datos y consulta tus pedidos desde cualquier dispositivo.</p></div><form class="usuario-login-form"><label' + (registro ? "" : " hidden") + '><span>Nombre</span><input name="nombre" autocomplete="name" required></label><label><span>Correo electrónico</span><input name="correo" type="email" autocomplete="email" required></label><label><span>Contraseña</span><input name="contrasena" type="password" autocomplete="' + (registro ? "new-password" : "current-password") + '" minlength="6" required></label><p class="usuario-login-error" role="alert"></p><button class="usuario-login-enviar" type="submit">' + (registro ? "Crear cuenta" : "Entrar") + '</button></form><button type="button" class="usuario-cambiar-modo">' + (registro ? "Ya tengo cuenta" : "Crear una cuenta") + '</button>';
            panel.querySelector(".usuario-demo-cerrar").addEventListener("click", cerrar);
            panel.querySelector(".usuario-cambiar-modo").addEventListener("click", function () { pintar(!registro); });
            panel.querySelector("form").addEventListener("submit", async function (evento) {
                evento.preventDefault();
                const datos = new FormData(evento.currentTarget);
                try {
                    if (registro) await window.todoKlickNube.registrarUsuario(datos.get("nombre"), datos.get("correo"), datos.get("contrasena"));
                    else await window.todoKlickNube.iniciarSesion(datos.get("correo"), datos.get("contrasena"));
                } catch (error) {
                    panel.querySelector(".usuario-login-error").textContent = "No se pudo completar el acceso. Revisa tus datos.";
                }
            });
            return;
        }

        const listaPedidos = Array.isArray(pedidos) ? pedidos : pedidosLocales(usuario);
        let favoritos = [];
        try { favoritos = JSON.parse(localStorage.getItem("favoritosMiTienda") || "[]"); } catch (_) { favoritos = []; }
        panel.innerHTML = '<button type="button" class="usuario-demo-cerrar" aria-label="Cerrar">×</button><div class="usuario-cuenta-hero"><div class="usuario-avatar-grande">' + escaparHTMLCatalogo(usuario.nombre.charAt(0)) + '</div><div><span class="usuario-rol usuario-rol-cliente">MI CUENTA</span><h2>' + escaparHTMLCatalogo(usuario.nombre) + '</h2><p>' + escaparHTMLCatalogo(usuario.correo) + '</p></div></div><section class="perfil-cliente-resumen"><button type="button" data-perfil-accion="pedidos"><strong>' + listaPedidos.length + '</strong><span>Pedidos</span></button><button type="button" data-perfil-accion="favoritos"><strong>' + (Array.isArray(favoritos) ? favoritos.length : 0) + '</strong><span>Favoritos</span></button><button type="button" data-perfil-accion="carrito"><strong>' + obtenerCantidadCarrito() + '</strong><span>Carrito</span></button></section><section class="historial-pedidos-cuenta"><div class="perfil-seccion-titulo"><div><small>TU ACTIVIDAD</small><h3>Pedidos recientes</h3></div><button type="button" data-perfil-accion="catalogo">Seguir comprando</button></div>' + (listaPedidos.length ? listaPedidos.map(function (pedido) { const fecha = new Date(pedido.fecha).toLocaleDateString("es-NI"); const unidades = (pedido.productos || []).reduce(function (total, producto) { return total + Number(producto.cantidad || 0); }, 0); return '<article><div><strong>' + escaparHTMLCatalogo(pedido.numero) + '</strong><small>' + escaparHTMLCatalogo(fecha) + ' · ' + unidades + ' producto(s)</small></div><div><span>' + escaparHTMLCatalogo(pedido.estado || "Pendiente de confirmación") + '</span><b>' + escaparHTMLCatalogo(formatoMoneda(pedido.total)) + '</b><button type="button" data-repetir-pedido="' + escaparHTMLCatalogo(pedido.numero) + '">Repetir pedido</button></div></article>'; }).join("") : '<p class="perfil-sin-pedidos">Aún no tienes pedidos. Cuando confirmes uno por WhatsApp, aparecerá aquí.</p>') + '</section><div class="usuario-cuenta-acciones"><button type="button" class="usuario-ir-catalogo" data-perfil-accion="catalogo">Explorar catálogo</button><button type="button" class="usuario-cerrar-sesion">Cerrar sesión</button></div>';
        panel.querySelector(".usuario-demo-cerrar").addEventListener("click", cerrar);
        panel.querySelector(".usuario-cerrar-sesion").addEventListener("click", async function () { await window.todoKlickNube.cerrarSesion(); cerrar(); });
        panel.querySelectorAll("[data-perfil-accion]").forEach(function (accion) {
            accion.addEventListener("click", function () {
                if (accion.dataset.perfilAccion === "carrito") { cerrar(); abrirCarrito(); }
                if (accion.dataset.perfilAccion === "catalogo") { window.location.href = "catalogo.html"; }
                if (accion.dataset.perfilAccion === "favoritos") { window.location.href = "catalogo.html?vista=favoritos"; }
                if (accion.dataset.perfilAccion === "pedidos") { panel.querySelector(".historial-pedidos-cuenta")?.scrollIntoView({ behavior: "smooth", block: "start" }); }
            });
        });
        panel.querySelectorAll("[data-repetir-pedido]").forEach(function (accion) {
            accion.addEventListener("click", function () {
                const pedido = listaPedidos.find(function (item) { return item.numero === accion.dataset.repetirPedido; });
                if (!pedido) return;
                window.todoKlick.reemplazarCarrito(pedido.productos || []);
                cerrar();
                abrirCarrito();
            });
        });
    };
    const abrir = function () {
        sistema.classList.add("visible");
        sistema.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-usuario-abierto");
        pintar(false);
        const usuario = window.todoKlickNube?.usuario;
        if (usuario) window.todoKlickNube.obtenerPedidos().then(function (pedidos) { if (sistema.classList.contains("visible")) pintar(false, pedidos); }).catch(function () {});
    };
    boton.addEventListener("click", abrir);
    sistema.addEventListener("click", function (evento) { if (evento.target === sistema) cerrar(); });
    window.todoKlickNube.alCambiarSesion(function () { actualizarBoton(); if (sistema.classList.contains("visible")) abrir(); });
    window.todoKlickCuenta = { abrir: abrir };
    actualizarBoton();
}

function configurarSistemaUsuariosDemo() {
    if (window.todoKlickNube?.activa) {
        configurarPerfilClienteFirebase();
        return;
    }
    const botonEntrar = document.getElementById("boton-entrar");
    if (!botonEntrar || document.getElementById("sistema-usuarios-demo")) return;

    botonEntrar.removeAttribute("onclick");

    const sistema = document.createElement("div");
    sistema.id = "sistema-usuarios-demo";
    sistema.className = "sistema-usuarios-demo";
    sistema.setAttribute("aria-hidden", "true");
    sistema.innerHTML = '<div class="usuario-demo-panel" role="dialog" aria-modal="true" aria-labelledby="usuario-demo-titulo"></div>';
    document.body.appendChild(sistema);

    const panel = sistema.querySelector(".usuario-demo-panel");
    let rolSeleccionado = "cliente";

    function escapar(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, function (caracter) {
            return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[caracter];
        });
    }

    function guardarSesion(usuario, recordar) {
        const sesion = {
            rol: usuario.rol,
            nombre: usuario.nombre,
            correo: usuario.correo,
            iniciada: new Date().toISOString()
        };
        localStorage.removeItem(CLAVE_SESION_DEMO);
        sessionStorage.removeItem(CLAVE_SESION_DEMO);
        (recordar ? localStorage : sessionStorage).setItem(CLAVE_SESION_DEMO, JSON.stringify(sesion));
    }

    function cerrarModal() {
        sistema.classList.remove("visible");
        sistema.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-usuario-abierto");
        botonEntrar.focus();
    }

    function actualizarBoton() {
        const textos = textosUsuariosDemo();
        const sesion = obtenerSesionDemo();
        document.body.classList.toggle("usuario-administrador", sesion?.rol === "administrador");
        document.body.classList.toggle("usuario-cliente", sesion?.rol === "cliente");

        if (sesion) {
            botonEntrar.classList.add("sesion-iniciada");
            botonEntrar.setAttribute("aria-label", textos.perfil + ": " + sesion.nombre);
            botonEntrar.innerHTML = '<span class="usuario-avatar-mini">' + escapar(sesion.nombre.charAt(0)) + '</span><span class="usuario-nombre-mini">' + escapar(sesion.nombre.split(" ")[0]) + '</span>';
        } else {
            botonEntrar.classList.remove("sesion-iniciada");
            botonEntrar.setAttribute("aria-label", textos.entrar);
            botonEntrar.innerHTML = '<span aria-hidden="true">👤</span><span>' + escapar(textos.entrar) + '</span>';
        }
    }

    function estadisticasSesion(sesion) {
        const textos = textosUsuariosDemo();
        const productos = (window.productos || []).filter(function (producto) { return producto.activo !== false; });
        const categorias = new Set(productos.map(function (producto) { return producto.categoria; })).size;

        if (sesion.rol === "administrador") {
            return [
                [productos.length, textos.productos],
                [categorias, textos.categorias],
                [24, textos.pedidos]
            ];
        }

        let favoritos = [];
        try { favoritos = JSON.parse(localStorage.getItem("favoritosMiTienda") || "[]"); } catch (error) { favoritos = []; }
        return [
            [obtenerCantidadCarrito(), textos.carrito],
            [Array.isArray(favoritos) ? favoritos.length : 0, textos.favoritos],
            [obtenerPedidosGuardados().length, textos.pedidos]
        ];
    }

    function renderizarCuenta(sesion) {
        const textos = textosUsuariosDemo();
        const nombreRol = sesion.rol === "administrador" ? textos.administrador : textos.cliente;
        const estadisticas = estadisticasSesion(sesion);
        const pedidosReales = sesion.rol === "cliente" ? obtenerPedidosGuardados().slice(0, 5) : [];
        panel.innerHTML = `
            <button type="button" class="usuario-demo-cerrar" aria-label="${escapar(textos.cerrar)}">×</button>
            <div class="usuario-cuenta-hero">
                <span class="usuario-demo-etiqueta">${escapar(textos.miCuenta)}</span>
                <div class="usuario-avatar-grande">${escapar(sesion.nombre.charAt(0))}</div>
                <div><span class="usuario-rol usuario-rol-${escapar(sesion.rol)}">${escapar(nombreRol)}</span><h2 id="usuario-demo-titulo">${escapar(sesion.nombre)}</h2><p>${escapar(sesion.correo)}</p></div>
            </div>
            <section class="usuario-resumen" aria-label="${escapar(textos.bienvenida)}">
                <div class="usuario-resumen-titulo"><span class="usuario-estado-punto"></span><strong>${escapar(textos.bienvenida)}</strong><small>${escapar(sesion.rol === "administrador" ? textos.panelAdmin : textos.panelCliente)}</small></div>
                <div class="usuario-estadisticas">${estadisticas.map(function (dato) { return `<article><strong>${dato[0]}</strong><span>${escapar(dato[1])}</span></article>`; }).join("")}</div>
            </section>
            ${sesion.rol === "cliente" ? `<section class="historial-pedidos-cuenta">
                <h3>${escapar(textos.pedidos)}</h3>
                ${pedidosReales.length ? pedidosReales.map(function (pedido) {
                    const fecha = new Date(pedido.fecha).toLocaleDateString(idiomaActual === "es" ? "es-NI" : idiomaActual);
                    const unidades = (pedido.productos || []).reduce(function (total, producto) { return total + Number(producto.cantidad || 0); }, 0);
                    return `<article><div><strong>${escapar(pedido.numero)}</strong><small>${escapar(fecha)} \u00b7 ${unidades} producto(s)</small></div><div><span>${escapar(pedido.estado)}</span><b>${escapar(formatoMoneda(pedido.total))}</b><button type="button" data-repetir-pedido="${escapar(pedido.numero)}">Repetir pedido</button></div></article>`;
                }).join("") : `<p>A\u00fan no tienes pedidos guardados.</p>`}
            </section>` : ""}
            <div class="usuario-cuenta-acciones">
                <a href="catalogo.html" class="usuario-ir-catalogo">${escapar(textos.irCatalogo)} →</a>
                <button type="button" class="usuario-cerrar-sesion">${escapar(textos.cerrarSesion)}</button>
            </div>`;

        panel.querySelector(".usuario-demo-cerrar").addEventListener("click", cerrarModal);
        panel.querySelectorAll("[data-repetir-pedido]").forEach(function (boton) {
            boton.addEventListener("click", function () {
                const pedido = obtenerPedidosGuardados().find(function (item) { return item.numero === boton.dataset.repetirPedido; });
                if (!pedido || !window.todoKlick) return;
                window.todoKlick.reemplazarCarrito(pedido.productos || []);
                cerrarModal();
                abrirCarrito();
            });
        });
        panel.querySelector(".usuario-cerrar-sesion").addEventListener("click", function () {
            localStorage.removeItem(CLAVE_SESION_DEMO);
            sessionStorage.removeItem(CLAVE_SESION_DEMO);
            actualizarBoton();
            renderizarAcceso();
        });
    }

    function renderizarAcceso() {
        const textos = textosUsuariosDemo();
        panel.innerHTML = `
            <button type="button" class="usuario-demo-cerrar" aria-label="${escapar(textos.cerrar)}">×</button>
            <div class="usuario-acceso-cabecera"><span class="usuario-demo-etiqueta">${escapar(textos.acceso)}</span><h2 id="usuario-demo-titulo">${escapar(textos.titulo)}</h2><p>${escapar(textos.intro)}</p></div>
            <div class="usuario-roles" role="tablist">
                <button type="button" class="usuario-rol-tab${rolSeleccionado === "cliente" ? " activo" : ""}" data-rol-demo="cliente"><span>🛍️</span><strong>${escapar(textos.cliente)}</strong></button>
                <button type="button" class="usuario-rol-tab${rolSeleccionado === "administrador" ? " activo" : ""}" data-rol-demo="administrador"><span>📊</span><strong>${escapar(textos.administrador)}</strong></button>
            </div>
            <form class="usuario-login-form" novalidate>
                <label><span>${escapar(textos.correo)}</span><input id="usuario-demo-correo" type="email" autocomplete="username" required></label>
                <label><span>${escapar(textos.contrasena)}</span><div class="usuario-campo-clave"><input id="usuario-demo-clave" type="password" autocomplete="current-password" required><button type="button" class="usuario-mostrar-clave" aria-label="${escapar(textos.mostrar)}">👁</button></div></label>
                <label class="usuario-recordar"><input id="usuario-demo-recordar" type="checkbox" checked><span>${escapar(textos.recordar)}</span></label>
                <p class="usuario-login-error" role="alert" aria-live="polite"></p>
                <button type="submit" class="usuario-login-enviar">${escapar(textos.entrar)} <span>→</span></button>
            </form>
            <section class="credenciales-demo"><h3>${escapar(textos.cuentas)}</h3>${USUARIOS_DEMO.map(function (usuario) {
                const rol = usuario.rol === "administrador" ? textos.administrador : textos.cliente;
                return `<button type="button" class="credencial-demo${usuario.rol === rolSeleccionado ? " seleccionada" : ""}" data-usar-usuario="${escapar(usuario.rol)}"><span><strong>${escapar(rol)}</strong><small>${escapar(usuario.correo)}</small><code>${escapar(usuario.contrasena)}</code></span><em>${escapar(textos.usar)}</em></button>`;
            }).join("")}<p>🔒 ${escapar(textos.aviso)}</p></section>`;

        const correo = panel.querySelector("#usuario-demo-correo");
        const clave = panel.querySelector("#usuario-demo-clave");
        const error = panel.querySelector(".usuario-login-error");

        function usarUsuario(rol) {
            const usuario = USUARIOS_DEMO.find(function (item) { return item.rol === rol; });
            if (!usuario) return;
            rolSeleccionado = usuario.rol;
            correo.value = usuario.correo;
            clave.value = usuario.contrasena;
            error.textContent = "";
            panel.querySelectorAll("[data-rol-demo]").forEach(function (boton) { boton.classList.toggle("activo", boton.dataset.rolDemo === rolSeleccionado); });
            panel.querySelectorAll("[data-usar-usuario]").forEach(function (boton) { boton.classList.toggle("seleccionada", boton.dataset.usarUsuario === rolSeleccionado); });
            clave.focus();
        }

        panel.querySelector(".usuario-demo-cerrar").addEventListener("click", cerrarModal);
        panel.querySelectorAll("[data-rol-demo]").forEach(function (boton) {
            boton.addEventListener("click", function () { usarUsuario(boton.dataset.rolDemo); });
        });
        panel.querySelectorAll("[data-usar-usuario]").forEach(function (boton) {
            boton.addEventListener("click", function () { usarUsuario(boton.dataset.usarUsuario); });
        });
        panel.querySelector(".usuario-mostrar-clave").addEventListener("click", function (evento) {
            const visible = clave.type === "text";
            clave.type = visible ? "password" : "text";
            evento.currentTarget.textContent = visible ? "👁" : "🙈";
            evento.currentTarget.setAttribute("aria-label", visible ? textos.mostrar : textos.ocultar);
        });
        panel.querySelector(".usuario-login-form").addEventListener("submit", function (evento) {
            evento.preventDefault();
            if (!correo.value.trim() || !clave.value) {
                error.textContent = textos.incompleto;
                return;
            }
            const usuario = USUARIOS_DEMO.find(function (item) {
                return item.rol === rolSeleccionado && item.correo.toLowerCase() === correo.value.trim().toLowerCase() && item.contrasena === clave.value;
            });
            if (!usuario) {
                error.textContent = textos.invalido;
                panel.querySelector(".usuario-login-form").classList.remove("error-login");
                requestAnimationFrame(function () { panel.querySelector(".usuario-login-form").classList.add("error-login"); });
                return;
            }
            guardarSesion(usuario, panel.querySelector("#usuario-demo-recordar").checked);
            actualizarBoton();
            renderizarCuenta(obtenerSesionDemo());
        });

        const sugerido = USUARIOS_DEMO.find(function (usuario) { return usuario.rol === rolSeleccionado; });
        correo.value = sugerido.correo;
        clave.value = sugerido.contrasena;
    }

    function abrirModal() {
        const sesion = obtenerSesionDemo();
        if (sesion) renderizarCuenta(sesion); else renderizarAcceso();
        sistema.classList.add("visible");
        sistema.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-usuario-abierto");
        requestAnimationFrame(function () { panel.querySelector("input, .usuario-demo-cerrar")?.focus(); });
    }

    botonEntrar.addEventListener("click", abrirModal);
    sistema.addEventListener("click", function (evento) { if (evento.target === sistema) cerrarModal(); });
    document.addEventListener("keydown", function (evento) { if (evento.key === "Escape" && sistema.classList.contains("visible")) cerrarModal(); });
    window.addEventListener("idiomaCambiado", function () {
        actualizarBoton();
        if (sistema.classList.contains("visible")) {
            const sesion = obtenerSesionDemo();
            if (sesion) renderizarCuenta(sesion); else renderizarAcceso();
        }
    });

    actualizarBoton();
    window.todoKlickUsuariosDemo = { abrir: abrirModal, sesion: obtenerSesionDemo };
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

// El APK ya contiene los archivos de la versión instalada. Mantener un
// Service Worker allí puede conservar recursos de un APK anterior y mostrar
// controles antiguos durante unos segundos. En web/PWA sí se mantiene.
const esAplicacionNativa = Boolean(
    window.Capacitor &&
    typeof window.Capacitor.isNativePlatform === "function" &&
    window.Capacitor.isNativePlatform()
);

if (esAplicacionNativa && "serviceWorker" in navigator) {
    Promise.all([
        navigator.serviceWorker.getRegistrations().then(function (registros) {
            return Promise.all(registros.map(function (registro) {
                return registro.unregister();
            }));
        }),
        typeof caches !== "undefined"
            ? caches.keys().then(function (claves) {
                return Promise.all(claves.filter(function (clave) {
                    return clave.startsWith("todo-klick-") || clave.startsWith("mi-tienda-");
                }).map(function (clave) {
                    return caches.delete(clave);
                }));
            })
            : Promise.resolve()
    ]).catch(function (error) {
        console.warn("[Todo Klick] No se pudo limpiar la caché anterior del APK.", error);
    });
}

if (
    "serviceWorker" in navigator &&
    !esAplicacionNativa
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
                "[Todo Klick] Nueva versión aplicada."
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
                    "[Todo Klick] Nueva versión disponible:",
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
                    "[Todo Klick] Service Worker registrado."
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
                                        "[Todo Klick] Nueva versión encontrada."
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
                    "[Todo Klick] Error con Service Worker:",
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
// RENDERIZADOR HISTÓRICO CONSERVADO SOLO COMO REFERENCIA
// =====================================================

function mostrarProductosLegacy() {

    const contenedor =
        document.getElementById(
            "lista-productos"
        );


    if (!contenedor) {
        return;
    }


    contenedor.innerHTML = "";


    productos.forEach(function(producto) {


        const tarjeta =
            document.createElement("article");


        tarjeta.className =
            "producto";


        tarjeta.innerHTML = `


        <div class="producto-imagen">

            ${
            producto.imagen.includes(".png") ||
            producto.imagen.includes(".jpg")

            ?

            `<img
                src="${producto.imagen}"
                alt="${producto.nombre}"
            >`

            :

            `<span>
                ${producto.imagen}
            </span>`

            }

        </div>





        <div class="producto-info">





            <span class="producto-categoria">

                ${producto.categoria}

            </span>





            ${
            producto.etiqueta

            ?

            `
            <div class="etiqueta-producto">

                ${producto.etiqueta}

            </div>
            `

            :

            ""

            }






            <h3>

                ${producto.nombre}

            </h3>





            <p>

                ${producto.descripcion}

            </p>





            <div class="producto-rating">

                ${"⭐".repeat(Math.max(0, Math.min(5, Number(producto.rating) || 0)))}

            </div>





            <strong>

                C$ ${producto.precio.toLocaleString()}

            </strong>





            <div class="producto-stock">

                ${
                producto.stock
                ?
                "✅ Disponible"
                :
                "❌ Agotado"
                }

            </div>





            <button

                type="button"

                class="agregar-carrito"

                data-nombre="${producto.nombre}"

                data-precio="${producto.precio}"

                ${producto.stock ? "" : "disabled"}

            >

                🛒

                <span>

                    ${producto.stock ? "Agregar al carrito" : "Agotado"}

                </span>


            </button>





        </div>



        `;



        contenedor.appendChild(
            tarjeta
        );


    });



    configurarBotonesAgregar();

}

// =====================================================
// INICIALIZACIÓN
// =====================================================

function crearExperienciaComercialMovil() {
    if (document.getElementById("navegacion-comercial-movil")) return;
    const categorias = [];
    const categoriasPorClave = new Map();
    (window.productos || []).filter(function (p) { return p.activo !== false; }).forEach(function (producto) {
        const clave = normalizarTextoCatalogo(producto.categoria);
        if (!clave) return;
        const categoriaExistente = categoriasPorClave.get(clave);
        if (categoriaExistente) {
            categoriaExistente.total += 1;
            return;
        }
        const categoria = { clave:clave, nombre:localizarProducto(producto).categoria, imagen:producto.imagen, total:1 };
        categoriasPorClave.set(clave, categoria);
        categorias.push(categoria);
    });

    function elegirCategoria(clave) {
        if (!/catalogo\.html$/i.test(window.location.pathname)) {
            window.location.href = "catalogo.html?categoria=" + encodeURIComponent(clave);
            return;
        }
        estadoCatalogo.categoria = clave;
        estadoCatalogo.pagina = 1;
        document.getElementById("productos")?.classList.remove("catalogo-sin-seleccion");
        document.getElementById("lista-productos").hidden = false;
        const filtro = document.getElementById("filtro-categoria");
        if (filtro) filtro.value = clave;
        actualizarVistaCatalogo(true);
    }

    const encabezado = document.querySelector("header");
    if (encabezado && !document.getElementById("boton-notificaciones")) {
        const centro = document.createElement("div");
        centro.className = "centro-notificaciones";
        centro.innerHTML = `<button type="button" id="boton-notificaciones" aria-label="Abrir notificaciones" aria-expanded="false"><span aria-hidden="true">\ud83d\udd14</span><em hidden>0</em></button>
            <section id="panel-notificaciones" hidden><header><div><small>TODO KLICK</small><h2>Notificaciones</h2></div><button type="button" aria-label="Cerrar">&times;</button></header><div class="lista-notificaciones"><p class="notificaciones-vacias">No tienes notificaciones nuevas.</p></div></section>`;
        encabezado.appendChild(centro);
        const botonCentro = centro.querySelector("#boton-notificaciones");
        const panelCentro = centro.querySelector("#panel-notificaciones");
        const listaCentro = centro.querySelector(".lista-notificaciones");
        const contadorCentro = botonCentro.querySelector("em");
        let notificaciones = [];

        function pintarCentro() {
            const hayNotificaciones = notificaciones.length > 0;
            contadorCentro.textContent = notificaciones.length;
            contadorCentro.hidden = !hayNotificaciones;
            listaCentro.innerHTML = hayNotificaciones ? notificaciones.map(function (item) {
                return `<article><span>${escaparHTMLCatalogo(item.icono || "\ud83d\udd14")}</span><div><strong>${escaparHTMLCatalogo(item.titulo)}</strong><p>${escaparHTMLCatalogo(item.mensaje)}</p><small>${escaparHTMLCatalogo(item.fecha)}</small></div></article>`;
            }).join("") : `<p class="notificaciones-vacias">No tienes notificaciones nuevas.</p>`;
        }
        function cerrarCentro() {
            panelCentro.hidden = true;
            botonCentro.setAttribute("aria-expanded", "false");
        }
        botonCentro.addEventListener("click", function () {
            const abrir = panelCentro.hidden;
            panelCentro.hidden = !abrir;
            botonCentro.setAttribute("aria-expanded", String(abrir));
        });
        centro.querySelector("#panel-notificaciones header button").addEventListener("click", cerrarCentro);
        document.addEventListener("click", function (evento) { if (!centro.contains(evento.target)) cerrarCentro(); });
        window.todoKlickNotificaciones = {
            agregar: function (titulo, mensaje, icono) {
                notificaciones.unshift({ titulo:titulo, mensaje:mensaje, icono:icono || "\ud83d\udd14", fecha:"Ahora" });
                notificaciones = notificaciones.slice(0, 10);
                pintarCentro();
            }
        };
        pintarCentro();
    }
    if (encabezado && !document.getElementById("abrir-categorias-movil")) {
        const abrirCategorias = document.createElement("button");
        abrirCategorias.id = "abrir-categorias-movil";
        abrirCategorias.className = "abrir-categorias-movil";
        abrirCategorias.type = "button";
        abrirCategorias.setAttribute("aria-label", "Abrir categor\u00edas");
        abrirCategorias.setAttribute("aria-expanded", "false");
        abrirCategorias.innerHTML = `<span aria-hidden="true">\u2630</span><b>Categor\u00edas</b>`;
        encabezado.prepend(abrirCategorias);

        const panel = document.createElement("div");
        panel.id = "panel-categorias-movil";
        panel.className = "panel-categorias-movil";
        panel.setAttribute("aria-hidden", "true");
        panel.innerHTML = `<div class="fondo-categorias-movil"></div><aside role="dialog" aria-modal="true" aria-labelledby="titulo-categorias-movil">
            <div class="cabecera-categorias-movil"><div><small>EXPLORAR</small><h2 id="titulo-categorias-movil">Encuentra lo que necesitas</h2><p>Elige una categoría o usa Compra inteligente.</p></div><button type="button" aria-label="Cerrar categorías">&times;</button></div>
            <button type="button" class="categoria-todos-movil" data-categoria-panel="todos"><span>\ud83d\uded2</span><div><b>Ver todo</b><small>${(window.productos || []).filter(function (p) { return p.activo !== false; }).length} productos disponibles</small></div><em>\u203a</em></button>
            <div class="lista-categorias-movil">${categorias.map(function (categoria) {
                const archivo = /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(String(categoria.imagen || ""));
                return `<button type="button" data-categoria-panel="${escaparHTMLCatalogo(categoria.clave)}"><span>${archivo ? `<img src="${escaparHTMLCatalogo(resolverURLImagenProducto(categoria.imagen))}" alt="">` : escaparHTMLCatalogo(categoria.imagen || "\ud83d\udce6")}</span><div><b>${escaparHTMLCatalogo(categoria.nombre)}</b><small>${categoria.total} ${categoria.total === 1 ? "producto" : "productos"}</small></div><em>\u203a</em></button>`;
            }).join("")}</div>
            <div class="atajos-categorias-movil"><button type="button" data-atajo-panel="inteligente">\u2728 Compra inteligente</button></div>
        </aside>`;
        document.body.appendChild(panel);

        function cerrarPanelCategorias() {
            panel.classList.remove("visible");
            panel.setAttribute("aria-hidden", "true");
            abrirCategorias.setAttribute("aria-expanded", "false");
            document.body.classList.remove("categorias-movil-abiertas");
        }
        abrirCategorias.addEventListener("click", function () {
            panel.classList.add("visible");
            panel.setAttribute("aria-hidden", "false");
            abrirCategorias.setAttribute("aria-expanded", "true");
            document.body.classList.add("categorias-movil-abiertas");
            panel.querySelector("aside button")?.focus();
        });
        panel.querySelector(".cabecera-categorias-movil button").addEventListener("click", cerrarPanelCategorias);
        panel.querySelector(".fondo-categorias-movil").addEventListener("click", cerrarPanelCategorias);
        panel.addEventListener("click", function (evento) {
            const categoria = evento.target.closest("[data-categoria-panel]");
            const atajo = evento.target.closest("[data-atajo-panel]");
            if (categoria) {
                cerrarPanelCategorias();
                elegirCategoria(categoria.dataset.categoriaPanel);
            } else if (atajo?.dataset.atajoPanel === "favoritos") {
                cerrarPanelCategorias();
                if (!/catalogo\.html$/i.test(window.location.pathname)) window.location.href = "catalogo.html?vista=favoritos";
                else elegirCategoria("favoritos");
            } else if (atajo?.dataset.atajoPanel === "inteligente") {
                cerrarPanelCategorias();
                if (!/catalogo\.html$/i.test(window.location.pathname)) window.location.href = "catalogo.html?modo=inteligente";
                else document.querySelector('[data-opcion-catalogo="inteligente"]')?.click();
            }
        });
        document.addEventListener("keydown", function (evento) { if (evento.key === "Escape" && panel.classList.contains("visible")) cerrarPanelCategorias(); });
    }

    const inferior = document.createElement("nav");
    inferior.id = "navegacion-comercial-movil";
    inferior.className = "navegacion-comercial-movil";
    inferior.setAttribute("aria-label", "Navegaci\u00f3n principal m\u00f3vil");
    const cantidadInicialCarrito = obtenerCantidadCarrito();
    const enCatalogo = /catalogo\.html$/i.test(window.location.pathname);
    const iconosNavegacion = {
        inicio: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/></svg>',
        explorar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9c0-2.2-.8-4.2-2.2-5.8L12 12Z"/><path d="m12 12 4-5"/><circle cx="12" cy="12" r="1"/></svg>',
        catalogo: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
        carrito: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.5L21 8H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>',
        cuenta: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c.9-4 3.6-6 8-6s7.1 2 8 6"/></svg>'
    };
    inferior.innerHTML = `<a href="index.html" class="${enCatalogo ? "" : "activo"}"><span>\u2302</span><b>Inicio</b></a><button type="button" data-accion-movil="categorias" aria-label="Explorar categorías y compra inteligente"><span>\u2630</span><b>Explorar</b></button><a href="catalogo.html" class="${enCatalogo ? "activo" : ""}"><span>\u25a6</span><b>Catálogo</b></a><button type="button" data-accion-movil="carrito"><span>\ud83d\uded2</span><b>Carrito</b><em${cantidadInicialCarrito === 0 ? " hidden" : ""}>${cantidadInicialCarrito}</em></button><button type="button" data-accion-movil="cuenta"><span>\u263a</span><b>Cuenta</b></button>`;
    inferior.innerHTML = `<a href="index.html" class="${enCatalogo ? "" : "activo"}"><span class="nav-icon">${iconosNavegacion.inicio}</span><b>Inicio</b></a><button type="button" data-accion-movil="categorias" aria-label="Explorar categorías y compra inteligente"><span class="nav-icon">${iconosNavegacion.explorar}</span><b>Explorar</b></button><a href="catalogo.html" class="${enCatalogo ? "activo" : ""}"><span class="nav-icon">${iconosNavegacion.catalogo}</span><b>Catálogo</b></a><button type="button" data-accion-movil="carrito"><span class="nav-icon">${iconosNavegacion.carrito}</span><b>Carrito</b><em${cantidadInicialCarrito === 0 ? " hidden" : ""}>${cantidadInicialCarrito}</em></button><button type="button" data-accion-movil="cuenta"><span class="nav-icon">${iconosNavegacion.cuenta}</span><b>Cuenta</b></button>`;
    document.body.appendChild(inferior);
    inferior.addEventListener("click", function (evento) {
        const accion = evento.target.closest("[data-accion-movil]")?.dataset.accionMovil;
        if (accion === "categorias") {
            document.getElementById("abrir-categorias-movil")?.click();
        } else if (accion === "carrito") {
            abrirCarrito();
        } else if (accion === "cuenta") {
            if (window.todoKlickCuenta?.abrir) window.todoKlickCuenta.abrir();
            else document.getElementById("boton-entrar")?.click();
        } else if (accion === "favoritos") {
            if (!/catalogo\.html$/i.test(window.location.pathname)) window.location.href = "catalogo.html?vista=favoritos";
            else {
                estadoCatalogo.categoria = "favoritos";
                estadoCatalogo.pagina = 1;
                document.getElementById("productos")?.classList.remove("catalogo-sin-seleccion");
                document.getElementById("lista-productos").hidden = false;
                actualizarVistaCatalogo(true);
            }
        }
    });

    if (new URLSearchParams(window.location.search).get("modo") === "inteligente") {
        setTimeout(function () { document.querySelector('[data-opcion-catalogo="inteligente"]')?.click(); }, 0);
    }
}

function iniciarTienda() {

    document.querySelectorAll('a[href="#"]').forEach(function (enlace) {
        enlace.addEventListener("click", function (evento) {
            evento.preventDefault();
        });
        enlace.setAttribute("aria-disabled", "true");
        enlace.hidden = true;
        enlace.style.display = "none";
        enlace.setAttribute("title", "Enlace próximamente disponible");
    });

    document.querySelectorAll('a[href="#promociones"]').forEach(function (enlace) {
        enlace.addEventListener("click", function (evento) {
            evento.preventDefault();
            document.getElementById("productos")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    cargarCarritoCompartido();

    crearCarritoFlotante();

    crearAsistenteVirtual();

    configurarInicioPriorizado();

    configurarOpcionesCatalogo();

    crearExperienciaProfesional();

    // Primero generamos los productos
    mostrarProductos();

    // Después configuramos sus funciones
    configurarBotonesAgregar();

    configurarExploradorProductos();

    crearExperienciaComercialMovil();

    configurarMenuIdiomas();

    cambiarIdioma(
        idiomaActual
    );

    configurarSistemaUsuariosDemo();

    actualizarContador();

    mostrarCarrito();

    iniciarVigenciaCarrito();

}


// =====================================================
// ARRANCAR
// =====================================================

function iniciarAplicacion() {
    const nube = window.todoKlickNube?.lista;
    if (nube) {
        nube.finally(iniciarTienda);
    } else {
        iniciarTienda();
    }
}

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarAplicacion
    );

} else {

    // Permite que las extensiones del catálogo declaradas al final del
    // archivo terminen de inicializarse antes de construir la interfaz.
    setTimeout(iniciarAplicacion, 0);

}

// API mínima para las funciones inteligentes sin duplicar la lógica del carrito.
window.todoKlick = {
    t: t,
    tf: tf,
    idioma: function () { return idiomaActual; },
    obtenerCarrito: function () {
        return carrito.map(function (producto) {
            return { ...producto };
        });
    },

    agregarProducto: function (referencia, cantidad = 1) {
        const producto = Array.isArray(window.productos)
            ? window.productos.find(function (item) {
                return (
                    String(item.id) === String(referencia) ||
                    item.nombre === referencia
                ) && item.stock;
            })
            : null;

        if (!producto) {
            return false;
        }

        const existente = carrito.find(function (item) {
            return String(item.id) === String(producto.id);
        });

        const cantidadValida = Math.max(1, Math.min(99, Math.floor(Number(cantidad) || 1)));

        if (existente) {
            existente.cantidad = Math.min(99, existente.cantidad + cantidadValida);
        } else {
            carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: cantidadValida });
        }

        guardarCarrito();
        actualizarContador();
        mostrarCarrito();
        return true;
    },

    reemplazarCarrito: function (productos) {
        carrito = normalizarCarrito(productos);
        guardarCarrito();
        actualizarContador();
        mostrarCarrito();
        return this.obtenerCarrito();
    },

    abrirCarrito: abrirCarrito
};

// =====================================================
// CATÁLOGO ESCALABLE
// Renderiza únicamente la página visible. Esta implementación sustituye
// el explorador basado en tarjetas ya creadas y permite crecer el origen
// de datos sin cargar cientos de nodos en el DOM.
// =====================================================

const estadoCatalogo = {
    pagina: 1,
    porPagina: 24,
    limiteInicio: 24,
    busqueda: "",
    categoria: "todos",
    orden: "relevancia",
    soloDisponibles: false,
    precioMaximo: 0
};

function normalizarTextoCatalogo(valor) {
    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function escaparHTMLCatalogo(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, function (caracter) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[caracter];
    });
}

function resolverURLImagenProducto(ruta) {
    try {
        return new URL(String(ruta || ""), document.baseURI).href;
    } catch (error) {
        return String(ruta || "");
    }
}

function configurarRespaldoImagenProducto(tarjeta, nombreProducto) {
    const imagen = tarjeta.querySelector(".producto-imagen img");
    if (!imagen) return;

    imagen.addEventListener("error", function () {
        const contenedor = imagen.closest(".producto-imagen");
        if (!contenedor) return;
        contenedor.classList.add("producto-imagen-fallback");
        contenedor.innerHTML = `
            <div class="imagen-producto-respaldo" role="img" aria-label="${escaparHTMLCatalogo(nombreProducto)}">
                <span aria-hidden="true">📦</span>
                <small>${escaparHTMLCatalogo(t("imagenNoDisponible"))}</small>
            </div>`;
    }, { once: true });
}

function localizarProducto(producto) {
    const traduccion = window.traduccionesProductos?.[idiomaActual]?.[producto.id] || {};
    return Object.assign({}, producto, traduccion, {
        nombreOriginal: producto.nombre
    });
}

function nombreProductoLocalizado(id, nombreBase) {
    const producto = (window.productos || []).find(function (item) {
        return String(item.id) === String(id) || item.nombre === nombreBase;
    });
    return producto ? localizarProducto(producto).nombre : nombreBase;
}

function obtenerProductosFiltrados() {
    const termino = normalizarTextoCatalogo(estadoCatalogo.busqueda);
    let favoritosCatalogo = [];
    try { favoritosCatalogo = JSON.parse(localStorage.getItem("favoritosMiTienda") || "[]"); } catch (error) { favoritosCatalogo = []; }
    let resultado = Array.isArray(window.productos)
        ? window.productos.filter(function (productoBase) {
            const producto = localizarProducto(productoBase);
            const coincideCategoria = estadoCatalogo.categoria === "favoritos"
                ? favoritosCatalogo.includes(productoBase.nombre)
                : estadoCatalogo.categoria === "todos" ||
                normalizarTextoCatalogo(productoBase.categoria) === estadoCatalogo.categoria ||
                normalizarTextoCatalogo(producto.categoria) === estadoCatalogo.categoria;
            const contenido = normalizarTextoCatalogo([
                producto.nombre,
                producto.descripcion,
                producto.categoria,
                producto.sku,
                ...(Array.isArray(producto.tags) ? producto.tags : [])
            ].join(" "));

            const coincideDisponibilidad = !estadoCatalogo.soloDisponibles || producto.stock === true;
            const coincidePrecio = !estadoCatalogo.precioMaximo || Number(producto.precio) <= estadoCatalogo.precioMaximo;

            return producto.activo !== false && coincideCategoria && coincideDisponibilidad && coincidePrecio && (!termino || contenido.includes(termino));
        })
        : [];

    resultado = resultado.slice();

    if (estadoCatalogo.orden === "menor") {
        resultado.sort(function (a, b) { return Number(a.precio) - Number(b.precio); });
    } else if (estadoCatalogo.orden === "mayor") {
        resultado.sort(function (a, b) { return Number(b.precio) - Number(a.precio); });
    } else if (estadoCatalogo.orden === "nuevos") {
        resultado.sort(function (a, b) { return Number(b.id) - Number(a.id); });
    }

    return resultado;
}

function abrirVistaRapidaProducto(referencia) {
    const productoBase = (window.productos || []).find(function (item) {
        return String(item.id) === String(referencia);
    });
    if (!productoBase) return;

    const producto = localizarProducto(productoBase);
    const idioma = idiomaActual || "es";
    const textos = {
        es:{ titulo:"Vista r\u00e1pida", cerrar:"Cerrar", disponibilidad:"Disponibilidad", disponible:"Disponible", agotado:"Agotado", vendedor:"Vendido por", entrega:"Entrega estimada", dias:"d\u00eda(s)", garantia:"Garant\u00eda", meses:"mes(es)", cantidad:"Cantidad", agregar:"Agregar al carrito", agregado:"Producto agregado al carrito" },
        en:{ titulo:"Quick view", cerrar:"Close", disponibilidad:"Availability", disponible:"Available", agotado:"Out of stock", vendedor:"Sold by", entrega:"Estimated delivery", dias:"day(s)", garantia:"Warranty", meses:"month(s)", cantidad:"Quantity", agregar:"Add to cart", agregado:"Product added to cart" },
        fr:{ titulo:"Aper\u00e7u rapide", cerrar:"Fermer", disponibilidad:"Disponibilit\u00e9", disponible:"Disponible", agotado:"\u00c9puis\u00e9", vendedor:"Vendu par", entrega:"Livraison estim\u00e9e", dias:"jour(s)", garantia:"Garantie", meses:"mois", cantidad:"Quantit\u00e9", agregar:"Ajouter au panier", agregado:"Produit ajout\u00e9 au panier" },
        pt:{ titulo:"Visualiza\u00e7\u00e3o r\u00e1pida", cerrar:"Fechar", disponibilidad:"Disponibilidade", disponible:"Dispon\u00edvel", agotado:"Esgotado", vendedor:"Vendido por", entrega:"Entrega estimada", dias:"dia(s)", garantia:"Garantia", meses:"m\u00eas(es)", cantidad:"Quantidade", agregar:"Adicionar ao carrinho", agregado:"Produto adicionado ao carrinho" },
        zh:{ titulo:"\u5feb\u901f\u67e5\u770b", cerrar:"\u5173\u95ed", disponibilidad:"\u5e93\u5b58", disponible:"\u6709\u8d27", agotado:"\u7f3a\u8d27", vendedor:"\u5356\u5bb6", entrega:"\u9884\u8ba1\u9001\u8fbe", dias:"\u5929", garantia:"\u4fdd\u4fee", meses:"\u4e2a\u6708", cantidad:"\u6570\u91cf", agregar:"\u52a0\u5165\u8d2d\u7269\u8f66", agregado:"\u5df2\u52a0\u5165\u8d2d\u7269\u8f66" }
    }[idioma] || null;
    const tx = textos || {};
    let modal = document.getElementById("vista-rapida-producto");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "vista-rapida-producto";
        modal.className = "vista-rapida-producto";
        document.body.appendChild(modal);
    }

    const imagen = String(producto.imagen || "");
    const esArchivo = /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(imagen);
    const similares = (window.productos || []).filter(function (item) {
        const candidato = localizarProducto(item);
        return item.activo !== false && String(item.id) !== String(producto.id) &&
            normalizarTextoCatalogo(candidato.categoria) === normalizarTextoCatalogo(producto.categoria);
    }).slice(0, 4);
    modal.innerHTML = `<div class="vista-rapida-contenido" role="dialog" aria-modal="true" aria-labelledby="vista-rapida-titulo">
        <button type="button" class="vista-rapida-cerrar" aria-label="${escaparHTMLCatalogo(tx.cerrar)}">&times;</button>
        <div class="vista-rapida-imagen">${esArchivo
            ? `<img src="${escaparHTMLCatalogo(resolverURLImagenProducto(imagen))}" alt="${escaparHTMLCatalogo(producto.nombre)}">`
            : `<span aria-hidden="true">${escaparHTMLCatalogo(imagen)}</span>`}</div>
        <div class="vista-rapida-info">
            <small>${escaparHTMLCatalogo(tx.titulo)} \u00b7 ${escaparHTMLCatalogo(producto.categoria)}</small>
            <h2 id="vista-rapida-titulo">${escaparHTMLCatalogo(producto.nombre)}</h2>
            <p>${escaparHTMLCatalogo(producto.descripcion)}</p>
            <div class="producto-rating">${"\u2b50".repeat(Math.max(0, Math.min(5, Number(producto.rating) || 0)))} <span>(${Number(producto.resenas) || 0})</span></div>
            <strong class="vista-rapida-precio">${formatoMoneda(producto.precio)}</strong>
            <ul>
                <li><b>${escaparHTMLCatalogo(tx.disponibilidad)}:</b> ${producto.stock ? tx.disponible : tx.agotado}</li>
                <li><b>${escaparHTMLCatalogo(tx.vendedor)}:</b> ${escaparHTMLCatalogo(producto.vendedor || "Todo Klick")}</li>
                <li><b>${escaparHTMLCatalogo(tx.entrega)}:</b> ${Number(producto.entregaDias) || 1} ${escaparHTMLCatalogo(tx.dias)}</li>
                <li><b>${escaparHTMLCatalogo(tx.garantia)}:</b> ${Number(producto.garantiaMeses) || 1} ${escaparHTMLCatalogo(tx.meses)}</li>
            </ul>
            <div class="vista-rapida-accion">
                <label>${escaparHTMLCatalogo(tx.cantidad)} <input type="number" id="cantidad-vista-rapida" min="1" max="99" value="1"></label>
                <button type="button" id="agregar-vista-rapida" ${producto.stock ? "" : "disabled"}>${producto.stock ? escaparHTMLCatalogo(tx.agregar) : escaparHTMLCatalogo(tx.agotado)}</button>
            </div>
            <p class="vista-rapida-mensaje" aria-live="polite"></p>
            ${similares.length ? `<section class="vista-rapida-similares" aria-label="Productos parecidos"><h3>Productos parecidos</h3><div>${similares.map(function (item) {
                const parecido = localizarProducto(item);
                const imagenParecida = String(parecido.imagen || "");
                const archivoParecido = /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(imagenParecida);
                return `<button type="button" data-producto-parecido="${escaparHTMLCatalogo(item.id)}">${archivoParecido ? `<img src="${escaparHTMLCatalogo(resolverURLImagenProducto(imagenParecida))}" alt="${escaparHTMLCatalogo(parecido.nombre)}" loading="lazy">` : `<span aria-hidden="true">${escaparHTMLCatalogo(imagenParecida)}</span>`}<small>${escaparHTMLCatalogo(parecido.nombre)}</small><strong>${formatoMoneda(parecido.precio)}</strong></button>`;
            }).join("")}</div></section>` : ""}
        </div></div>`;
    modal.classList.add("visible");
    document.body.classList.add("vista-rapida-abierta");

    function cerrar() {
        modal.classList.remove("visible");
        document.body.classList.remove("vista-rapida-abierta");
    }
    modal.querySelector(".vista-rapida-cerrar").addEventListener("click", cerrar);
    modal.addEventListener("click", function (evento) { if (evento.target === modal) cerrar(); }, { once:true });
    modal.querySelector("#agregar-vista-rapida")?.addEventListener("click", function () {
        const cantidad = Number(modal.querySelector("#cantidad-vista-rapida").value) || 1;
        if (window.todoKlick.agregarProducto(productoBase.id, cantidad)) {
            modal.querySelector(".vista-rapida-mensaje").textContent = tx.agregado;
        }
    });
    modal.querySelectorAll("[data-producto-parecido]").forEach(function (boton) {
        boton.addEventListener("click", function () {
            abrirVistaRapidaProducto(boton.dataset.productoParecido);
        });
    });
    modal.querySelector(".vista-rapida-cerrar").focus();
}

function crearTarjetaProducto(producto) {
    producto = localizarProducto(producto);
    const tarjeta = document.createElement("article");
    const imagen = String(producto.imagen || "📦");
    const esArchivo = /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(imagen);

    const idSeguro = escaparHTMLCatalogo(producto.id);
    const nombreSeguro = escaparHTMLCatalogo(producto.nombre);
    const descripcionSegura = escaparHTMLCatalogo(producto.descripcion);
    const categoriaSegura = escaparHTMLCatalogo(producto.categoria || t("general"));
    const imagenSegura = escaparHTMLCatalogo(
        esArchivo
            ? resolverURLImagenProducto(imagen)
            : imagen
    );
    const etiquetaSegura = escaparHTMLCatalogo(producto.etiqueta);
    const disponible = Boolean(producto.stock);
    const precioAnterior = Number(producto.precioAnterior) || 0;
    const descuento = precioAnterior > Number(producto.precio)
        ? Math.round((1 - Number(producto.precio) / precioAnterior) * 100)
        : 0;
    const nombreFavorito = producto.nombreOriginal || producto.nombre;
    let favoritosTarjeta = [];
    try { favoritosTarjeta = JSON.parse(localStorage.getItem("favoritosMiTienda") || "[]"); } catch (error) { favoritosTarjeta = []; }
    const esFavorito = favoritosTarjeta.includes(nombreFavorito);

    tarjeta.className = "producto";
    tarjeta.dataset.productoId = String(producto.id);
    tarjeta.innerHTML = `
        <div class="producto-imagen">
            ${esArchivo
                ? `<img src="${imagenSegura}" alt="${nombreSeguro}" loading="eager" decoding="async">`
                : `<span aria-hidden="true">${imagenSegura}</span>`}
            <button type="button" class="favorito-producto${esFavorito ? " activo" : ""}" aria-label="Guardar en favoritos" aria-pressed="${esFavorito}">${esFavorito ? "\u2665" : "\u2661"}</button>
        </div>
        <div class="producto-info">
            <span class="producto-categoria">${categoriaSegura}</span>
            ${producto.etiqueta ? `<div class="etiqueta-producto">${etiquetaSegura}</div>` : ""}
            <h3>${nombreSeguro}</h3>
            <p>${descripcionSegura}</p>
            <div class="producto-rating" aria-label="${escaparHTMLCatalogo(tf("estrellasDeCinco", { valor: Number(producto.rating) || 0 }))}">
                ${"⭐".repeat(Math.max(0, Math.min(5, Number(producto.rating) || 0)))}
            </div>
            <div class="precio-comercial-producto">
                <strong>${formatoMoneda(producto.precio)}</strong>
                ${descuento ? `<del>${formatoMoneda(precioAnterior)}</del><span>-${descuento}%</span>` : ""}
            </div>
            <p class="producto-comentario">${descripcionSegura}</p>
            <div class="beneficios-tarjeta-producto">
                <span>\u26a1 Entrega ${Number(producto.entregaDias) <= 1 ? "r\u00e1pida" : "en " + Number(producto.entregaDias) + " d\u00edas"}</span>
                ${Number(producto.resenas) ? `<span>${Number(producto.resenas)} rese\u00f1as</span>` : ""}
            </div>
            <div class="producto-stock ${disponible ? "disponible" : "agotado"}">
                ${disponible ? t("disponible") : t("agotado")}
            </div>
            <button type="button" class="agregar-carrito"
                data-id="${idSeguro}" data-nombre="${nombreSeguro}"
                data-precio="${Number(producto.precio) || 0}" ${disponible ? "" : "disabled"}>
                <span>${disponible ? t("agregarCarrito") : t("agotado")}</span>
            </button>
        </div>`;

    configurarRespaldoImagenProducto(tarjeta, producto.nombre);
    tarjeta.querySelector(".favorito-producto").addEventListener("click", function (evento) {
        evento.stopPropagation();
        let favoritos = [];
        try { favoritos = JSON.parse(localStorage.getItem("favoritosMiTienda") || "[]"); } catch (error) { favoritos = []; }
        favoritos = favoritos.includes(nombreFavorito)
            ? favoritos.filter(function (nombre) { return nombre !== nombreFavorito; })
            : favoritos.concat(nombreFavorito);
        localStorage.setItem("favoritosMiTienda", JSON.stringify(favoritos));
        const activo = favoritos.includes(nombreFavorito);
        evento.currentTarget.classList.toggle("activo", activo);
        evento.currentTarget.setAttribute("aria-pressed", String(activo));
        evento.currentTarget.textContent = activo ? "\u2665" : "\u2661";
        if (estadoCatalogo.categoria === "favoritos" && !activo) actualizarVistaCatalogo(false);
    });
    tarjeta.addEventListener("click", function (evento) {
        if (!evento.target.closest("button")) abrirVistaRapidaProducto(producto.id);
    });

    return tarjeta;
}

function mostrarProductos() {
    const contenedor = document.getElementById("lista-productos");
    if (!contenedor) return;

    const esCatalogoCompleto = /catalogo\.html$/i.test(window.location.pathname);
    const productosFiltrados = obtenerProductosFiltrados();
    const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / estadoCatalogo.porPagina));
    estadoCatalogo.pagina = Math.min(Math.max(1, estadoCatalogo.pagina), totalPaginas);

    const inicio = esCatalogoCompleto
        ? (estadoCatalogo.pagina - 1) * estadoCatalogo.porPagina
        : 0;
    const limite = esCatalogoCompleto ? estadoCatalogo.porPagina : estadoCatalogo.limiteInicio;
    const visibles = productosFiltrados.slice(inicio, inicio + limite);

    contenedor.innerHTML = "";
    if (!visibles.length) {
        contenedor.innerHTML = `<p class="catalogo-vacio">${escaparHTMLCatalogo(t("sinResultados"))}</p>`;
    } else {
        const fragmento = document.createDocumentFragment();
        visibles.forEach(function (producto) {
            fragmento.appendChild(crearTarjetaProducto(producto));
        });
        contenedor.appendChild(fragmento);
    }

    configurarBotonesAgregar();

    const resumen = document.getElementById("resumen-catalogo");
    if (resumen) {
        const desde = productosFiltrados.length ? inicio + 1 : 0;
        const hasta = Math.min(inicio + limite, productosFiltrados.length);
        resumen.textContent = tf("mostrandoProductos", { desde: desde, hasta: hasta, total: productosFiltrados.length });
    }

    const resumenInicio = document.getElementById("resumen-productos-inicio");
    const cargarMasInicio = document.getElementById("cargar-mas-productos-inicio");
    if (!esCatalogoCompleto && resumenInicio) {
        resumenInicio.textContent = tf("resumenInicio", {
            visibles: visibles.length,
            total: productosFiltrados.length
        });
    }
    if (!esCatalogoCompleto && cargarMasInicio) {
        cargarMasInicio.hidden = visibles.length >= productosFiltrados.length;
        cargarMasInicio.textContent = t("cargarMas");
    }

    window.dispatchEvent(new CustomEvent("productosRenderizados"));

    document.querySelectorAll("[data-pagina-catalogo]").forEach(function (boton) {
        const pagina = Number(boton.dataset.paginaCatalogo);
        boton.classList.toggle("activa", pagina === estadoCatalogo.pagina);
        boton.setAttribute("aria-current", pagina === estadoCatalogo.pagina ? "page" : "false");
    });

    const anterior = document.getElementById("pagina-anterior");
    const siguiente = document.getElementById("pagina-siguiente");
    if (anterior) anterior.disabled = estadoCatalogo.pagina <= 1;
    if (siguiente) siguiente.disabled = estadoCatalogo.pagina >= totalPaginas;
}

function pintarPaginacionCatalogo() {
    const paginacion = document.getElementById("paginacion-catalogo");
    if (!paginacion) return;

    const total = obtenerProductosFiltrados().length;
    const totalPaginas = Math.max(1, Math.ceil(total / estadoCatalogo.porPagina));
    estadoCatalogo.pagina = Math.min(estadoCatalogo.pagina, totalPaginas);
    paginacion.hidden = totalPaginas <= 1;
    const desde = Math.max(1, estadoCatalogo.pagina - 2);
    const hasta = Math.min(totalPaginas, desde + 4);
    let paginas = "";

    for (let pagina = desde; pagina <= hasta; pagina += 1) {
        paginas += `<button type="button" data-pagina-catalogo="${pagina}">${pagina}</button>`;
    }

    paginacion.innerHTML = `
        <button type="button" id="pagina-anterior" aria-label="${t("paginaAnterior")}">${t("anterior")}</button>
        <div class="numeros-paginacion">${paginas}</div>
        <button type="button" id="pagina-siguiente" aria-label="${t("paginaSiguiente")}">${t("siguiente")}</button>`;

    paginacion.querySelectorAll("[data-pagina-catalogo]").forEach(function (boton) {
        boton.addEventListener("click", function () {
            estadoCatalogo.pagina = Number(boton.dataset.paginaCatalogo);
            actualizarVistaCatalogo(true);
        });
    });

    document.getElementById("pagina-anterior").addEventListener("click", function () {
        estadoCatalogo.pagina -= 1;
        actualizarVistaCatalogo(true);
    });
    document.getElementById("pagina-siguiente").addEventListener("click", function () {
        estadoCatalogo.pagina += 1;
        actualizarVistaCatalogo(true);
    });
}

function actualizarVistaCatalogo(desplazar) {
    pintarPaginacionCatalogo();
    mostrarProductos();
    if (desplazar) {
        document.getElementById("productos")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function configurarExploradorProductos() {
    const contenedor = document.getElementById("lista-productos");
    const esCatalogoCompleto = /catalogo\.html$/i.test(window.location.pathname);
    if (!contenedor || !esCatalogoCompleto || document.getElementById("herramientas-catalogo")) return;

    const categorias = [];
    const categoriasConocidas = new Set();
    (window.productos || []).forEach(function (producto) {
        const valor = normalizarTextoCatalogo(producto.categoria);
        if (!valor || categoriasConocidas.has(valor) || producto.activo === false) return;
        categoriasConocidas.add(valor);
        categorias.push({ valor: valor, nombre: localizarProducto(producto).categoria });
    });
    const herramientas = document.createElement("section");
    herramientas.id = "herramientas-catalogo";
    herramientas.className = "herramientas-catalogo catalogo-controles";
    herramientas.setAttribute("aria-label", t("catalogo"));
    herramientas.innerHTML = `
        <label class="filtro-catalogo">
            <span>${t("categoria")}</span>
            <select id="filtro-categoria">
                <option value="todos">${t("todasCategorias")}</option>
                ${categorias.map(function (categoria) {
                    return `<option value="${categoria.valor}">${escaparHTMLCatalogo(categoria.nombre)}</option>`;
                }).join("")}
            </select>
        </label>
        <label class="ordenar-productos">
            <span>${t("ordenar")}</span>
            <select id="orden-catalogo">
                <option value="relevancia">${t("relevancia")}</option>
                <option value="nuevos">${t("masRecientes")}</option>
                <option value="menor">${t("menorPrecio")}</option>
                <option value="mayor">${t("mayorPrecio")}</option>
            </select>
        </label>
        <label class="filtro-disponibilidad">
            <span>Disponibilidad</span>
            <select id="filtro-disponibilidad">
                <option value="todos">Todos</option>
                <option value="disponibles">Solo disponibles</option>
            </select>
        </label>
        <label class="filtro-precio">
            <span>Precio máximo</span>
            <select id="filtro-precio">
                <option value="0">Cualquier precio</option>
                <option value="1000">Hasta C$1,000</option>
                <option value="2000">Hasta C$2,000</option>
                <option value="3000">Hasta C$3,000</option>
            </select>
        </label>
        <label class="cantidad-pagina">
            <span>${t("mostrar")}</span>
            <select id="cantidad-catalogo">
                <option value="12">12</option>
                <option value="24" selected>24</option>
                <option value="48">48</option>
            </select>
        </label>
        <p id="resumen-catalogo" class="resumen-catalogo" aria-live="polite"></p>`;
    contenedor.before(herramientas);

    const contextoBusqueda = document.createElement("div");
    contextoBusqueda.id = "contexto-busqueda-catalogo";
    contextoBusqueda.className = "contexto-busqueda-catalogo";
    contextoBusqueda.hidden = true;
    herramientas.after(contextoBusqueda);

    const paginacion = document.createElement("nav");
    paginacion.id = "paginacion-catalogo";
    paginacion.className = "paginacion-catalogo";
    paginacion.setAttribute("aria-label", t("catalogo"));
    contenedor.after(paginacion);

    const categoriaURL = normalizarTextoCatalogo(new URLSearchParams(window.location.search).get("categoria"));
    if (categoriaURL && categorias.some(function (categoria) { return categoria.valor === categoriaURL; })) {
        estadoCatalogo.categoria = categoriaURL;
        document.getElementById("filtro-categoria").value = categoriaURL;
        document.getElementById("productos")?.classList.remove("catalogo-sin-seleccion");
        contenedor.hidden = false;
    }
    if (new URLSearchParams(window.location.search).get("vista") === "favoritos") {
        estadoCatalogo.categoria = "favoritos";
        document.getElementById("productos")?.classList.remove("catalogo-sin-seleccion");
        contenedor.hidden = false;
    }

    document.getElementById("filtro-categoria").addEventListener("change", function (evento) {
        estadoCatalogo.categoria = evento.target.value;
        estadoCatalogo.pagina = 1;
        actualizarContextoBusqueda();
        actualizarVistaCatalogo(false);
    });
    document.getElementById("orden-catalogo").addEventListener("change", function (evento) {
        estadoCatalogo.orden = evento.target.value;
        estadoCatalogo.pagina = 1;
        actualizarVistaCatalogo(false);
    });
    document.getElementById("filtro-disponibilidad").addEventListener("change", function (evento) {
        estadoCatalogo.soloDisponibles = evento.target.value === "disponibles";
        estadoCatalogo.pagina = 1;
        actualizarContextoBusqueda();
        actualizarVistaCatalogo(false);
    });
    document.getElementById("filtro-precio").addEventListener("change", function (evento) {
        estadoCatalogo.precioMaximo = Number(evento.target.value) || 0;
        estadoCatalogo.pagina = 1;
        actualizarContextoBusqueda();
        actualizarVistaCatalogo(false);
    });
    document.getElementById("cantidad-catalogo").addEventListener("change", function (evento) {
        estadoCatalogo.porPagina = Number(evento.target.value) || 24;
        estadoCatalogo.pagina = 1;
        actualizarVistaCatalogo(false);
    });

    const entradaBusqueda = document.getElementById("buscador");
    function actualizarContextoBusqueda() {
        const termino = String(estadoCatalogo.busqueda || "").trim();
        const hayFiltros = estadoCatalogo.categoria !== "todos" || estadoCatalogo.soloDisponibles || estadoCatalogo.precioMaximo;
        if (!termino && !hayFiltros) {
            contextoBusqueda.hidden = true;
            contextoBusqueda.replaceChildren();
            return;
        }
        const categoriaSeleccionada = categorias.find(function (categoria) {
            return categoria.valor === estadoCatalogo.categoria;
        });
        const texto = document.createElement("span");
        const partes = [];
        if (termino) partes.push(categoriaSeleccionada
            ? "Buscando “" + termino + "” en " + categoriaSeleccionada.nombre
            : "Resultados para “" + termino + "”");
        else if (categoriaSeleccionada) partes.push("Mostrando " + categoriaSeleccionada.nombre);
        if (estadoCatalogo.soloDisponibles) partes.push("solo disponibles");
        if (estadoCatalogo.precioMaximo) partes.push("hasta " + formatoMoneda(estadoCatalogo.precioMaximo));
        texto.textContent = partes.join(" · ");
        contextoBusqueda.replaceChildren(texto);
        if (categoriaSeleccionada) {
            const todo = document.createElement("button");
            todo.type = "button";
            todo.textContent = "Buscar en todo";
            todo.addEventListener("click", function () {
                estadoCatalogo.categoria = "todos";
                document.getElementById("filtro-categoria").value = "todos";
                actualizarContextoBusqueda();
                actualizarVistaCatalogo(false);
            });
            contextoBusqueda.appendChild(todo);
        }
        if (hayFiltros) {
            const limpiar = document.createElement("button");
            limpiar.type = "button";
            limpiar.textContent = "Limpiar filtros";
            limpiar.addEventListener("click", function () {
                estadoCatalogo.categoria = "todos";
                estadoCatalogo.soloDisponibles = false;
                estadoCatalogo.precioMaximo = 0;
                document.getElementById("filtro-categoria").value = "todos";
                document.getElementById("filtro-disponibilidad").value = "todos";
                document.getElementById("filtro-precio").value = "0";
                actualizarContextoBusqueda();
                actualizarVistaCatalogo(false);
            });
            contextoBusqueda.appendChild(limpiar);
        }
        contextoBusqueda.hidden = false;
    }
    function aplicarBusquedaCatalogo(valor) {
        estadoCatalogo.busqueda = String(valor || "").trim();
        estadoCatalogo.pagina = 1;
        document.getElementById("productos")?.classList.remove("catalogo-sin-seleccion");
        contenedor.hidden = false;

        const url = new URL(window.location.href);
        if (estadoCatalogo.busqueda) url.searchParams.set("buscar", estadoCatalogo.busqueda);
        else url.searchParams.delete("buscar");
        window.history.replaceState({}, "", url);
        actualizarContextoBusqueda();
        actualizarVistaCatalogo(false);
    }

    if (entradaBusqueda) {
        const busquedaURL = new URLSearchParams(window.location.search).get("buscar");
        if (busquedaURL) {
            entradaBusqueda.value = busquedaURL;
            estadoCatalogo.busqueda = busquedaURL;
        }
        entradaBusqueda.addEventListener("input", function () {
            aplicarBusquedaCatalogo(entradaBusqueda.value);
        });
    }

    actualizarContextoBusqueda();
    actualizarVistaCatalogo(false);
}

// Versión localizada del asistente. Al estar al final del archivo sustituye
// la implementación antigua que solo contemplaba español y chino.
function actualizarAsistenteIdioma() {
    if (!asistenteReferencia) return;

    const boton = asistenteReferencia.querySelector(".asistente-boton-texto");
    const input = asistenteReferencia.querySelector("#asistente-consulta");
    const encabezado = asistenteReferencia.querySelector(".asistente-encabezado strong");
    const estado = asistenteReferencia.querySelector(".asistente-encabezado span");
    const saludo = asistenteReferencia.querySelector(".asistente-mensajes .mensaje-asistente");
    const sugerencias = asistenteReferencia.querySelectorAll(".asistente-sugerencias button");
    const cerrar = asistenteReferencia.querySelector(".asistente-cerrar");
    const enviar = asistenteReferencia.querySelector('.asistente-formulario button[type="submit"]');

    if (boton) boton.textContent = t("ayuda");
    if (input) {
        input.placeholder = t("escribeConsulta");
        input.setAttribute("aria-label", t("escribeConsulta"));
    }
    if (encabezado) encabezado.textContent = t("asistenteTitulo");
    if (estado) {
        const indicador = estado.querySelector("i");
        estado.textContent = t("asistenteEnLinea");
        if (indicador) estado.prepend(indicador);
    }
    if (saludo) saludo.textContent = t("saludoAsistente");
    if (cerrar) cerrar.setAttribute("aria-label", t("cerrar"));
    if (enviar) enviar.setAttribute("aria-label", t("enviarConsulta"));

    const textosSugerencias = [t("comoComprar"), t("verCarrito"), t("productos")];
    sugerencias.forEach(function (sugerencia, indice) {
        sugerencia.textContent = textosSugerencias[indice];
        sugerencia.dataset.consulta = textosSugerencias[indice];
    });
}
