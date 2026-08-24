/* =====================================================
   MI TIENDA - JAVASCRIPT COMPLETO
   ===================================================== */


/* =====================================================
   CONFIGURACIÓN
   ===================================================== */

// Número de WhatsApp de la tienda
// Nicaragua: +505 7682 3472
const NUMERO_WHATSAPP = "50576823472";


/* =====================================================
   CARRITO
   ===================================================== */

let carrito = [];

try {
    carrito = JSON.parse(
        localStorage.getItem("carrito")
    ) || [];
} catch (error) {
    carrito = [];
}


/* =====================================================
   GUARDAR CARRITO
   ===================================================== */

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


/* =====================================================
   CONTADOR DEL CARRITO
   ===================================================== */

function actualizarContador() {

    const contador =
        document.getElementById(
            "contador-carrito"
        );

    if (!contador) {
        return;
    }

    const cantidadTotal =
        carrito.reduce(
            function (total, producto) {

                return total +
                    Number(producto.cantidad || 0);

            },
            0
        );

    contador.textContent =
        cantidadTotal;

}


/* =====================================================
   BUSCADOR
   ===================================================== */

const buscador =
    document.getElementById("buscador");

if (buscador) {

    buscador.addEventListener(
        "input",
        function () {

            const texto =
                buscador.value
                    .toLowerCase()
                    .trim();

            const productos =
                document.querySelectorAll(
                    ".producto"
                );

            productos.forEach(
                function (producto) {

                    const titulo =
                        producto.querySelector("h3");

                    if (!titulo) {
                        return;
                    }

                    const nombre =
                        titulo.textContent
                            .toLowerCase();

                    if (
                        nombre.includes(texto)
                    ) {

                        producto.style.display =
                            "";

                    } else {

                        producto.style.display =
                            "none";

                    }

                }
            );

        }
    );

}


/* =====================================================
   AGREGAR PRODUCTOS
   ===================================================== */

function activarBotonesProductos() {

    const botones =
        document.querySelectorAll(
            ".agregar-carrito"
        );

    botones.forEach(
        function (boton) {

            // Evitar agregar el evento dos veces
            if (
                boton.dataset.eventoActivo ===
                "true"
            ) {
                return;
            }

            boton.dataset.eventoActivo =
                "true";


            boton.addEventListener(
                "click",
                function () {

                    const nombre =
                        boton.dataset.nombre ||
                        obtenerNombreProducto(boton);

                    const precio =
                        Number(
                            boton.dataset.precio ||
                            obtenerPrecioProducto(boton)
                        );

                    if (
                        !nombre ||
                        !precio
                    ) {

                        alert(
                            "No se pudo identificar el producto."
                        );

                        return;
                    }


                    const productoExistente =
                        carrito.find(
                            function (producto) {

                                return (
                                    producto.nombre ===
                                    nombre
                                );

                            }
                        );


                    if (productoExistente) {

                        productoExistente.cantidad++;

                    } else {

                        carrito.push({

                            nombre: nombre,

                            precio: precio,

                            cantidad: 1

                        });

                    }


                    guardarCarrito();

                    actualizarContador();


                    // Mensaje visual
                    mostrarMensaje(
                        nombre +
                        " fue agregado al carrito."
                    );

                }
            );

        }
    );

}


/* =====================================================
   OBTENER NOMBRE AUTOMÁTICAMENTE
   ===================================================== */

function obtenerNombreProducto(boton) {

    const tarjeta =
        boton.closest(".producto");

    if (!tarjeta) {
        return "";
    }

    const titulo =
        tarjeta.querySelector("h3");

    return titulo
        ? titulo.textContent.trim()
        : "";

}


/* =====================================================
   OBTENER PRECIO AUTOMÁTICAMENTE
   ===================================================== */

function obtenerPrecioProducto(boton) {

    const tarjeta =
        boton.closest(".producto");

    if (!tarjeta) {
        return 0;
    }

    const precio =
        tarjeta.querySelector("strong");

    if (!precio) {
        return 0;
    }

    const texto =
        precio.textContent
            .replace(/[^\d]/g, "");

    return Number(texto);

}


/* =====================================================
   MENSAJE DE PRODUCTO AGREGADO
   ===================================================== */

function mostrarMensaje(texto) {

    const mensajeAnterior =
        document.querySelector(
            ".mensaje-tienda"
        );

    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }


    const mensaje =
        document.createElement("div");

    mensaje.className =
        "mensaje-tienda";

    mensaje.textContent =
        "✓ " + texto;


    mensaje.style.position =
        "fixed";

    mensaje.style.left =
        "50%";

    mensaje.style.bottom =
        "30px";

    mensaje.style.transform =
        "translateX(-50%)";

    mensaje.style.background =
        "#0d5c72";

    mensaje.style.color =
        "#ffffff";

    mensaje.style.padding =
        "13px 22px";

    mensaje.style.borderRadius =
        "30px";

    mensaje.style.fontWeight =
        "700";

    mensaje.style.zIndex =
        "10000";

    mensaje.style.boxShadow =
        "0 8px 25px rgba(0,0,0,.25)";


    document.body.appendChild(
        mensaje
    );


    setTimeout(
        function () {

            mensaje.remove();

        },
        2200
    );

}


/* =====================================================
   ABRIR CARRITO
   ===================================================== */

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
        function () {

            ventanaCarrito.style.display =
                "flex";

            mostrarCarrito();

            document.body.style.overflow =
                "hidden";

        }
    );

}


/* =====================================================
   CERRAR CARRITO
   ===================================================== */

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
        cerrarVentanaCarrito
    );

}


/* =====================================================
   CERRAR CARRITO
   ===================================================== */

function cerrarVentanaCarrito() {

    if (!ventanaCarrito) {
        return;
    }

    ventanaCarrito.style.display =
        "none";

    document.body.style.overflow =
        "";

}


/* =====================================================
   CERRAR AL HACER CLIC FUERA
   ===================================================== */

if (ventanaCarrito) {

    ventanaCarrito.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target ===
                ventanaCarrito
            ) {

                cerrarVentanaCarrito();

            }

        }
    );

}


/* =====================================================
   TECLA ESC PARA CERRAR
   ===================================================== */

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            evento.key === "Escape" &&
            ventanaCarrito
        ) {

            cerrarVentanaCarrito();

        }

    }
);


/* =====================================================
   MOSTRAR CARRITO
   ===================================================== */

function mostrarCarrito() {

    const listaCarrito =
        document.getElementById(
            "lista-carrito"
        );

    const totalCarrito =
        document.getElementById(
            "total-carrito"
        );


    if (
        !listaCarrito ||
        !totalCarrito
    ) {
        return;
    }


    listaCarrito.innerHTML =
        "";


    /* =================================================
       CARRITO VACÍO
       ================================================= */

    if (
        carrito.length === 0
    ) {

        listaCarrito.innerHTML = `

            <p class="carrito-vacio">
                Tu carrito está vacío.
            </p>

        `;

        totalCarrito.textContent =
            "0";

        return;

    }


    let total = 0;


    /* =================================================
       PRODUCTOS
       ================================================= */

    carrito.forEach(
        function (producto, indice) {

            const precio =
                Number(producto.precio);

            const cantidad =
                Number(producto.cantidad);

            const subtotal =
                precio * cantidad;


            total += subtotal;


            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "item-carrito";


            item.innerHTML = `

                <div class="info-producto">

                    <strong>
                        ${escaparHTML(
                            producto.nombre
                        )}
                    </strong>

                    <span>
                        C$ ${precio.toLocaleString(
                            "es-NI"
                        )}
                    </span>

                </div>


                <div class="controles-cantidad">

                    <button
                        type="button"
                        onclick="disminuirCantidad(${indice})"
                    >
                        −
                    </button>

                    <span>
                        ${cantidad}
                    </span>

                    <button
                        type="button"
                        onclick="aumentarCantidad(${indice})"
                    >
                        +
                    </button>

                </div>


                <div class="subtotal">

                    C$ ${subtotal.toLocaleString(
                        "es-NI"
                    )}

                </div>


                <button
                    type="button"
                    class="eliminar-producto"
                    onclick="eliminarProducto(${indice})"
                    aria-label="Eliminar producto"
                >
                    🗑️
                </button>

            `;


            listaCarrito.appendChild(
                item
            );

        }
    );


    totalCarrito.textContent =
        total.toLocaleString(
            "es-NI"
        );

}


/* =====================================================
   SEGURIDAD HTML
   ===================================================== */

function escaparHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   AUMENTAR CANTIDAD
   ===================================================== */

function aumentarCantidad(indice) {

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


/* =====================================================
   DISMINUIR CANTIDAD
   ===================================================== */

function disminuirCantidad(indice) {

    if (
        !carrito[indice]
    ) {
        return;
    }


    carrito[indice].cantidad--;


    if (
        carrito[indice].cantidad <= 0
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


/* =====================================================
   ELIMINAR PRODUCTO
   ===================================================== */

function eliminarProducto(indice) {

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


/* =====================================================
   FINALIZAR COMPRA
   ===================================================== */

const finalizarCompra =
    document.getElementById(
        "finalizar-compra"
    );


if (finalizarCompra) {

    finalizarCompra.addEventListener(
        "click",
        function () {

            if (
                carrito.length === 0
            ) {

                alert(
                    "Tu carrito está vacío."
                );

                return;

            }


            enviarPedidoWhatsApp();

        }
    );

}


/* =====================================================
   ENVIAR PEDIDO A WHATSAPP
   ===================================================== */

function enviarPedidoWhatsApp() {

    let mensaje =
        "Hola, quiero realizar un pedido:%0A%0A";


    let total = 0;


    carrito.forEach(
        function (producto) {

            const precio =
                Number(producto.precio);

            const cantidad =
                Number(producto.cantidad);

            const subtotal =
                precio * cantidad;


            total += subtotal;


            mensaje +=
                "• " +
                encodeURIComponent(
                    producto.nombre
                ) +
                " x" +
                cantidad +
                " — C$ " +
                subtotal.toLocaleString(
                    "es-NI"
                ) +
                "%0A";

        }
    );


    mensaje +=
        "%0A" +
        "*Total: C$ " +
        total.toLocaleString(
            "es-NI"
        ) +
        "*";


    mensaje +=
        "%0A%0A" +
        "Quedo atento para coordinar la entrega.";


    const enlaceWhatsApp =
        "https://wa.me/" +
        NUMERO_WHATSAPP +
        "?text=" +
        mensaje;


    window.open(
        enlaceWhatsApp,
        "_blank"
    );

}


/* =====================================================
   BOTONES DE WHATSAPP DE LA PÁGINA
   ===================================================== */

function activarWhatsApp() {

    const botones =
        document.querySelectorAll(
            "[data-whatsapp]"
        );


    botones.forEach(
        function (boton) {

            boton.addEventListener(
                "click",
                function (evento) {

                    evento.preventDefault();


                    const texto =
                        boton.dataset.whatsapp ||
                        "Hola, quiero información sobre sus productos.";


                    const enlace =
                        "https://wa.me/" +
                        NUMERO_WHATSAPP +
                        "?text=" +
                        encodeURIComponent(
                            texto
                        );


                    window.open(
                        enlace,
                        "_blank"
                    );

                }
            );

        }
    );


    // Botón flotante
    const whatsappFlotante =
        document.querySelector(
            ".whatsapp-flotante"
        );


    if (
        whatsappFlotante
    ) {

        whatsappFlotante.href =
            "https://wa.me/" +
            NUMERO_WHATSAPP +
            "?text=" +
            encodeURIComponent(
                "Hola, quiero información sobre sus productos."
            );

        whatsappFlotante.target =
            "_blank";

    }

}


/* =====================================================
   CARRUSEL
   ===================================================== */

let slideActual = 0;

let intervaloCarrusel = null;


function iniciarCarrusel() {

    const slides =
        document.querySelectorAll(
            ".slide"
        );

    const indicadores =
        document.querySelectorAll(
            ".indicador"
        );


    if (
        slides.length === 0
    ) {
        return;
    }


    function mostrarSlide(numero) {

        slides.forEach(
            function (slide) {

                slide.classList.remove(
                    "activo"
                );

            }
        );


        indicadores.forEach(
            function (indicador) {

                indicador.classList.remove(
                    "activo"
                );

            }
        );


        slideActual =
            numero;


        if (
            slideActual >=
            slides.length
        ) {

            slideActual = 0;

        }


        if (
            slideActual < 0
        ) {

            slideActual =
                slides.length - 1;

        }


        slides[
            slideActual
        ].classList.add(
            "activo"
        );


        if (
            indicadores[
                slideActual
            ]
        ) {

            indicadores[
                slideActual
            ].classList.add(
                "activo"
            );

        }

    }


    window.cambiarSlide =
        function (direccion) {

            mostrarSlide(
                slideActual +
                direccion
            );

            reiniciarCarrusel();

        };


    window.irASlide =
        function (numero) {

            mostrarSlide(
                numero
            );

            reiniciarCarrusel();

        };


    function reiniciarCarrusel() {

        clearInterval(
            intervaloCarrusel
        );

        intervaloCarrusel =
            setInterval(
                function () {

                    mostrarSlide(
                        slideActual + 1
                    );

                },
                5000
            );

    }


    // Activar flechas
    const anterior =
        document.querySelector(
            ".flecha-carrusel.anterior"
        );

    const siguiente =
        document.querySelector(
            ".flecha-carrusel.siguiente"
        );


    if (anterior) {

        anterior.addEventListener(
            "click",
            function () {

                window.cambiarSlide(
                    -1
                );

            }
        );

    }


    if (siguiente) {

        siguiente.addEventListener(
            "click",
            function () {

                window.cambiarSlide(
                    1
                );

            }
        );

    }


    // Activar indicadores
    indicadores.forEach(
        function (
            indicador,
            indice
        ) {

            indicador.addEventListener(
                "click",
                function () {

                    window.irASlide(
                        indice
                    );

                }
            );

        }
    );


    mostrarSlide(0);

    reiniciarCarrusel();


    // Pausar al pasar el mouse
    const carrusel =
        document.querySelector(
            ".carrusel"
        );


    if (carrusel) {

        carrusel.addEventListener(
            "mouseenter",
            function () {

                clearInterval(
                    intervaloCarrusel
                );

            }
        );


        carrusel.addEventListener(
            "mouseleave",
            function () {

                reiniciarCarrusel();

            }
        );

    }

}


/* =====================================================
   BOTONES "COMPRAR AHORA"
   ===================================================== */

function activarBotonesComprar() {

    const botones =
        document.querySelectorAll(
            "[data-ir-catalogo]"
        );


    botones.forEach(
        function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "catalogo.html";

                }
            );

        }
    );

}


/* =====================================================
   CATEGORÍAS
   ===================================================== */

function activarCategorias() {

    const categorias =
        document.querySelectorAll(
            ".categoria"
        );


    categorias.forEach(
        function (categoria) {

            categoria.addEventListener(
                "click",
                function () {

                    const nombre =
                        categoria.querySelector(
                            "strong"
                        );


                    if (!nombre) {
                        return;
                    }


                    const texto =
                        nombre.textContent
                            .toLowerCase()
                            .trim();


                    const catalogo =
                        "catalogo.html";


                    // Llevar al catálogo
                    window.location.href =
                        catalogo +
                        "?categoria=" +
                        encodeURIComponent(
                            texto
                        );

                }
            );

        }
    );

}


/* =====================================================
   NAVEGACIÓN SUAVE
   ===================================================== */

function activarNavegacion() {

    const enlaces =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    enlaces.forEach(
        function (enlace) {

            enlace.addEventListener(
                "click",
                function (evento) {

                    const destino =
                        enlace.getAttribute(
                            "href"
                        );


                    if (
                        !destino ||
                        destino === "#"
                    ) {
                        return;
                    }


                    const elemento =
                        document.querySelector(
                            destino
                        );


                    if (!elemento) {
                        return;
                    }


                    evento.preventDefault();


                    elemento.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }
    );

}


/* =====================================================
   INICIALIZACIÓN
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        actualizarContador();

        activarBotonesProductos();

        activarWhatsApp();

        iniciarCarrusel();

        activarBotonesComprar();

        activarCategorias();

        activarNavegacion();

    }
); 