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
    ayuda: "Ayuda", asistenteTitulo: "Asistente de Mi Tienda", asistenteEnLinea: "En línea para ayudarte",
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
    ayuda: "Help", asistenteTitulo: "Mi Tienda Assistant", asistenteEnLinea: "Online and ready to help",
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
    ayuda: "Aide", asistenteTitulo: "Assistant Mi Tienda", asistenteEnLinea: "En ligne pour vous aider",
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
    ayuda: "Ajuda", asistenteTitulo: "Assistente Mi Tienda", asistenteEnLinea: "Online para ajudar você",
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
    ayuda: "帮助", asistenteTitulo: "Mi Tienda 助手", asistenteEnLinea: "在线为您服务",
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


                <label>

                    ${t("nombreCompleto")}

                    <input
                        name="nombre"
                        required
                        autocomplete="name"
                        placeholder="${t("tuNombre")}"
                    >

                </label>


                <label>

                    ${t("telefono")}

                    <input
                        name="telefono"
                        required
                        inputmode="tel"
                        autocomplete="tel"
                        placeholder="Ej. 8888 8888"
                    >

                </label>


                <label>

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
// MOSTRAR PRODUCTOS DESDE productos.js
// =====================================================

function mostrarProductos() {

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

function iniciarTienda() {

    document.querySelectorAll('a[href="#"]').forEach(function (enlace) {
        enlace.addEventListener("click", function (evento) {
            evento.preventDefault();
        });
        enlace.setAttribute("aria-disabled", "true");
        enlace.setAttribute("title", "Enlace próximamente disponible");
    });

    cargarCarritoCompartido();

    crearCarritoFlotante();

    crearAsistenteVirtual();

    // Primero generamos los productos
    mostrarProductos();

    // Después configuramos sus funciones
    configurarBotonesAgregar();

    configurarExploradorProductos();

    configurarMenuIdiomas();

    cambiarIdioma(
        idiomaActual
    );

    actualizarContador();

    mostrarCarrito();

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

    // Permite que las extensiones del catálogo declaradas al final del
    // archivo terminen de inicializarse antes de construir la interfaz.
    setTimeout(iniciarTienda, 0);

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
    busqueda: "",
    categoria: "todos",
    orden: "relevancia"
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
    let resultado = Array.isArray(window.productos)
        ? window.productos.filter(function (productoBase) {
            const producto = localizarProducto(productoBase);
            const coincideCategoria = estadoCatalogo.categoria === "todos" ||
                normalizarTextoCatalogo(producto.categoria) === estadoCatalogo.categoria;
            const contenido = normalizarTextoCatalogo([
                producto.nombre,
                producto.descripcion,
                producto.categoria,
                producto.sku,
                ...(Array.isArray(producto.tags) ? producto.tags : [])
            ].join(" "));

            return producto.activo !== false && coincideCategoria && (!termino || contenido.includes(termino));
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

function crearTarjetaProducto(producto) {
    producto = localizarProducto(producto);
    const tarjeta = document.createElement("article");
    const imagen = String(producto.imagen || "📦");
    const esArchivo = /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(imagen);

    const idSeguro = escaparHTMLCatalogo(producto.id);
    const nombreSeguro = escaparHTMLCatalogo(producto.nombre);
    const descripcionSegura = escaparHTMLCatalogo(producto.descripcion);
    const categoriaSegura = escaparHTMLCatalogo(producto.categoria || t("general"));
    const imagenSegura = escaparHTMLCatalogo(imagen);
    const etiquetaSegura = escaparHTMLCatalogo(producto.etiqueta);
    const disponible = Boolean(producto.stock);

    tarjeta.className = "producto";
    tarjeta.dataset.productoId = String(producto.id);
    tarjeta.innerHTML = `
        <div class="producto-imagen">
            ${esArchivo
                ? `<img src="${imagenSegura}" alt="${nombreSeguro}" loading="lazy" decoding="async">`
                : `<span aria-hidden="true">${imagenSegura}</span>`}
        </div>
        <div class="producto-info">
            <span class="producto-categoria">${categoriaSegura}</span>
            ${producto.etiqueta ? `<div class="etiqueta-producto">${etiquetaSegura}</div>` : ""}
            <h3>${nombreSeguro}</h3>
            <p>${descripcionSegura}</p>
            <div class="producto-rating" aria-label="${escaparHTMLCatalogo(tf("estrellasDeCinco", { valor: Number(producto.rating) || 0 }))}">
                ${"⭐".repeat(Math.max(0, Math.min(5, Number(producto.rating) || 0)))}
            </div>
            <strong>${formatoMoneda(producto.precio)}</strong>
            <div class="producto-stock ${disponible ? "disponible" : "agotado"}">
                ${disponible ? t("disponible") : t("agotado")}
            </div>
            <button type="button" class="agregar-carrito"
                data-id="${idSeguro}" data-nombre="${nombreSeguro}"
                data-precio="${Number(producto.precio) || 0}" ${disponible ? "" : "disabled"}>
                <span>${disponible ? t("agregarCarrito") : t("agotado")}</span>
            </button>
        </div>`;

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
    const limite = esCatalogoCompleto ? estadoCatalogo.porPagina : 8;
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

    const categorias = [...new Set((window.productos || [])
        .filter(function (producto) { return producto.activo !== false; })
        .map(function (producto) { return localizarProducto(producto).categoria; })
        .filter(Boolean))];
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
                    return `<option value="${normalizarTextoCatalogo(categoria)}">${categoria}</option>`;
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

    const paginacion = document.createElement("nav");
    paginacion.id = "paginacion-catalogo";
    paginacion.className = "paginacion-catalogo";
    paginacion.setAttribute("aria-label", t("catalogo"));
    contenedor.after(paginacion);

    document.getElementById("filtro-categoria").addEventListener("change", function (evento) {
        estadoCatalogo.categoria = evento.target.value;
        estadoCatalogo.pagina = 1;
        actualizarVistaCatalogo(false);
    });
    document.getElementById("orden-catalogo").addEventListener("change", function (evento) {
        estadoCatalogo.orden = evento.target.value;
        estadoCatalogo.pagina = 1;
        actualizarVistaCatalogo(false);
    });
    document.getElementById("cantidad-catalogo").addEventListener("change", function (evento) {
        estadoCatalogo.porPagina = Number(evento.target.value) || 24;
        estadoCatalogo.pagina = 1;
        actualizarVistaCatalogo(false);
    });

    const entradaBusqueda = document.getElementById("buscador");
    if (entradaBusqueda) {
        entradaBusqueda.addEventListener("input", function () {
            estadoCatalogo.busqueda = entradaBusqueda.value;
            estadoCatalogo.pagina = 1;
            actualizarVistaCatalogo(false);
        });
    }

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
