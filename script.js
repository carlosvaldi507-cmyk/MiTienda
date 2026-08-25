// =====================================================
// MI TIENDA
// SISTEMA GENERAL
// =====================================================


// =====================================================
// CARRITO
// =====================================================

function normalizarCarrito(valor) {

    if (!Array.isArray(valor)) {

        return [];

    }

    return valor.reduce(
        function (productosValidos, producto) {

            const precio = Number(producto?.precio);
            const cantidad = Number(producto?.cantidad);
            const cantidadNormalizada = Math.floor(cantidad);

            if (
                typeof producto?.nombre !== "string" ||
                !Number.isFinite(precio) ||
                !Number.isFinite(cantidad) ||
                cantidadNormalizada <= 0
            ) {

                return productosValidos;

            }

            productosValidos.push({

                nombre: producto.nombre,
                precio: precio,
                cantidad: cantidadNormalizada

            });

            return productosValidos;

        },
        []
    );

}


function obtenerCarritoGuardado() {

    try {

        return normalizarCarrito(
            JSON.parse(
                localStorage.getItem("carrito")
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


let carrito = obtenerCarritoGuardado();

let cuponAplicado = localStorage.getItem("cuponMiTienda") || "";
const MONTO_ENVIO_GRATIS = 5000;

function obtenerResumenCompra() {

    const subtotal = carrito.reduce(function (total, producto) {
        return total + (producto.precio * producto.cantidad);
    }, 0);
    const descuento = cuponAplicado === "BIENVENIDA10" ? Math.round(subtotal * 0.10) : 0;

    return {
        subtotal: subtotal,
        descuento: descuento,
        total: Math.max(0, subtotal - descuento)
    };

}

function formatoMoneda(valor) {
    return "C$ " + Number(valor || 0).toLocaleString("es-NI");
}


// =====================================================
// GUARDAR CARRITO
// =====================================================

function guardarCarrito() {

    try {

        localStorage.setItem(
            "carrito",
            JSON.stringify(carrito)
        );

    } catch (error) {

        console.error(
            "No se pudo guardar el carrito.",
            error
        );

    }

}


// =====================================================
// CONTADOR DEL CARRITO
// =====================================================

function obtenerCantidadCarrito() {

    return carrito.reduce(
        function (total, producto) {

            return total + Number(producto.cantidad || 0);

        },
        0
    );

}


function actualizarContador() {

    const cantidadTotal =
        obtenerCantidadCarrito();


    const contador =
        document.getElementById(
            "contador-carrito"
        );


    if (contador) {

        contador.textContent =
            cantidadTotal;

    }


    const contadorFlotante =
        document.getElementById(
            "contador-carrito-flotante"
        );


    if (contadorFlotante) {

        contadorFlotante.textContent =
            cantidadTotal;

    }

}


// =====================================================
// CREAR CARRITO FLOTANTE
// =====================================================

function configurarControlesCarritoFlotante() {

    const botonFlotante = document.getElementById("carrito-flotante");
    const botonVerCarrito = document.getElementById("ver-carrito-notificacion");

    if (botonFlotante && botonFlotante.dataset.carritoConfigurado !== "true") {

        botonFlotante.dataset.carritoConfigurado = "true";
        botonFlotante.addEventListener("click", abrirCarrito);

    }

    if (botonVerCarrito && botonVerCarrito.dataset.carritoConfigurado !== "true") {

        botonVerCarrito.dataset.carritoConfigurado = "true";
        botonVerCarrito.addEventListener("click", function () {

            abrirCarrito();
            ocultarNotificacion();

        });

    }

}

function crearCarritoFlotante() {

    // Evitar duplicarlo

    if (
        document.getElementById(
            "carrito-flotante"
        )
    ) {

        configurarControlesCarritoFlotante();
        actualizarContador();

        return;

    }


    // =================================================
    // ESTILOS
    // =================================================

    const estilos =
        document.createElement("style");


    estilos.id =
        "estilos-carrito-flotante";


    estilos.textContent = `

        /* =============================================
           CARRITO FLOTANTE
        ============================================= */

        .carrito-flotante {

            position: fixed;

            right: 20px;

            bottom: 20px;

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

            z-index: 9998;

            box-shadow:
                0 8px 25px rgba(0,0,0,0.25);

            transition:
                transform .2s ease,
                box-shadow .2s ease;

        }


        .carrito-flotante:hover {

            transform:
                translateY(-4px);

            box-shadow:
                0 12px 30px rgba(0,0,0,.30);

        }


        .icono-carrito-flotante {

            font-size: 27px;

            line-height: 1;

        }


        /* =============================================
           CONTADOR
        ============================================= */

        .contador-carrito-flotante {

            position: absolute;

            top: -4px;

            right: -4px;

            min-width: 26px;

            height: 26px;

            padding: 0 6px;

            border-radius: 50px;

            background: #f5a623;

            color: white;

            border: 2px solid white;

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 12px;

            font-weight: 800;

        }


        /* =============================================
           ANIMACIÓN
        ============================================= */

        .carrito-flotante.animar {

            animation:
                rebote-carrito .45s ease;

        }


        @keyframes rebote-carrito {

            0% {

                transform:
                    scale(1);

            }

            35% {

                transform:
                    scale(1.18);

            }

            65% {

                transform:
                    scale(.94);

            }

            100% {

                transform:
                    scale(1);

            }

        }


        /* =============================================
           NOTIFICACIÓN
        ============================================= */

        .notificacion-carrito {

            position: fixed;

            right: 20px;

            bottom: 95px;

            width: min(
                380px,
                calc(100% - 30px)
            );

            padding: 14px;

            background: white;

            border: 1px solid #e5e9eb;

            border-radius: 16px;

            box-shadow:
                0 12px 35px rgba(0,0,0,.18);

            display: flex;

            align-items: center;

            gap: 12px;

            z-index: 9999;

            opacity: 0;

            visibility: hidden;

            transform:
                translateY(15px);

            transition:
                opacity .25s ease,
                transform .25s ease,
                visibility .25s ease;

        }


        .notificacion-carrito.mostrar {

            opacity: 1;

            visibility: visible;

            transform:
                translateY(0);

        }


        /* =============================================
           ICONO
        ============================================= */

        .notificacion-icono {

            width: 40px;

            height: 40px;

            min-width: 40px;

            border-radius: 50%;

            background: #25d366;

            color: white;

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 21px;

            font-weight: 800;

        }


        /* =============================================
           TEXTO
        ============================================= */

        .notificacion-texto {

            flex: 1;

            min-width: 0;

            display: flex;

            flex-direction: column;

            gap: 3px;

        }


        .notificacion-texto strong {

            color: #123b4a;

            font-size: 14px;

        }


        .notificacion-texto span {

            color: #697b83;

            font-size: 13px;

            white-space: nowrap;

            overflow: hidden;

            text-overflow: ellipsis;

        }


        /* =============================================
           VER CARRITO
        ============================================= */

        .ver-carrito-notificacion {

            border: none;

            border-radius: 9px;

            padding: 9px 12px;

            background: #0d5c72;

            color: white;

            font-size: 12px;

            font-weight: 700;

            cursor: pointer;

            white-space: nowrap;

        }


        .ver-carrito-notificacion:hover {

            background: #09485a;

        }


        /* =============================================
           MÓVIL
        ============================================= */

        @media (max-width: 600px) {

            .carrito-flotante {

                width: 58px;

                height: 58px;

                right: 14px;

                bottom: 14px;

            }


            .icono-carrito-flotante {

                font-size: 25px;

            }


            .notificacion-carrito {

                right: 15px;

                bottom: 82px;

                width:
                    calc(100% - 30px);

            }

        }

    `;


    document.head.appendChild(
        estilos
    );


    // =================================================
    // BOTÓN FLOTANTE
    // =================================================

    const boton =
        document.createElement("button");


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


    // =================================================
    // NOTIFICACIÓN
    // =================================================

    const notificacion =
        document.createElement("div");


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
// MOSTRAR NOTIFICACIÓN
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
            function () {

                ocultarNotificacion();

            },
            3500
        );

}


// =====================================================
// OCULTAR NOTIFICACIÓN
// =====================================================

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
// AGREGAR PRODUCTOS
// =====================================================

function configurarBotonesAgregar() {

    const botonesAgregar =
        document.querySelectorAll(
            ".agregar-carrito"
        );


    botonesAgregar.forEach(
        function (boton) {

            // Evitar duplicar eventos

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
                        boton.dataset.nombre;


                    const precio =
                        Number(
                            boton.dataset.precio
                        );


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


                    // NUEVO AVISO

                    mostrarNotificacionProducto(
                        nombre
                    );

                }
            );

        }
    );

}


// =====================================================
// BOTÓN DEL CARRITO
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
        function () {

            abrirCarrito();

        }
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


// =====================================================
// CERRAR AL HACER CLIC AFUERA
// =====================================================

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
// MOSTRAR CARRITO
// =====================================================

function actualizarResumenCarrito() {
    const contenido = document.querySelector(".carrito-contenido");
    const totalCarrito = document.getElementById("total-carrito");
    if (!contenido || !totalCarrito) return;

    let resumen = document.getElementById("resumen-compra");
    if (!resumen) {
        resumen = document.createElement("section");
        resumen.id = "resumen-compra";
        resumen.className = "resumen-compra";
        totalCarrito.closest(".total-carrito").before(resumen);
    }

    const datos = obtenerResumenCompra();
    const faltante = Math.max(0, MONTO_ENVIO_GRATIS - datos.subtotal);
    resumen.innerHTML = `
        <div class="beneficio-envio ${faltante === 0 && datos.subtotal ? "completo" : ""}">
            <span>${faltante === 0 && datos.subtotal ? "✓ Envío gratis desbloqueado" : "Te faltan " + formatoMoneda(faltante) + " para envío gratis"}</span>
            <div><i style="width:${datos.subtotal ? Math.min(100, (datos.subtotal / MONTO_ENVIO_GRATIS) * 100) : 0}%"></i></div>
        </div>
        <div class="cupon-compra">
            <label for="codigo-cupon">¿Tienes un cupón?</label>
            <div><input id="codigo-cupon" type="text" value="${cuponAplicado}" placeholder="Ej. BIENVENIDA10" maxlength="20" autocomplete="off"><button id="aplicar-cupon" type="button">Aplicar</button></div>
            <small id="mensaje-cupon">${cuponAplicado ? "Cupón BIENVENIDA10 aplicado: 10% de descuento." : "Usa BIENVENIDA10 y recibe 10% de descuento."}</small>
        </div>
        <div class="desglose-compra">
            <span>Subtotal <b>${formatoMoneda(datos.subtotal)}</b></span>
            ${datos.descuento ? `<span class="descuento">Descuento <b>− ${formatoMoneda(datos.descuento)}</b></span>` : ""}
        </div>
        <button id="vaciar-carrito" class="vaciar-carrito" type="button" ${carrito.length ? "" : "disabled"}>Vaciar carrito</button>
    `;
    totalCarrito.textContent = datos.total.toLocaleString("es-NI");

    document.getElementById("aplicar-cupon").addEventListener("click", function () {
        const codigo = document.getElementById("codigo-cupon").value.trim().toUpperCase();
        const mensaje = document.getElementById("mensaje-cupon");
        if (codigo === "BIENVENIDA10") {
            cuponAplicado = codigo;
            localStorage.setItem("cuponMiTienda", codigo);
            actualizarResumenCarrito();
        } else {
            cuponAplicado = "";
            localStorage.removeItem("cuponMiTienda");
            mensaje.textContent = codigo ? "Ese cupón no es válido. Prueba BIENVENIDA10." : "Ingresa un cupón para aplicarlo.";
        }
    });
    document.getElementById("vaciar-carrito").addEventListener("click", function () {
        if (!carrito.length || !window.confirm("¿Quieres quitar todos los productos del carrito?")) return;
        carrito = [];
        guardarCarrito();
        actualizarContador();
        mostrarCarrito();
    });
}

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


    if (carrito.length === 0) {

        listaCarrito.innerHTML = `

            <p class="carrito-vacio">

                Tu carrito está vacío.

            </p>

        `;


        totalCarrito.textContent =
            "0";

        actualizarResumenCarrito();


        return;

    }


    let total = 0;


    carrito.forEach(
        function (producto, indice) {

            const subtotal =
                producto.precio *
                producto.cantidad;


            total += subtotal;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "item-carrito";


            item.innerHTML = `

                <div class="info-producto">

                    <strong class="nombre-producto"></strong>

                    <span>
                        C$ ${producto.precio.toLocaleString()}
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

                    C$ ${subtotal.toLocaleString()}

                </div>


                <button
                    class="eliminar-producto"
                    onclick="eliminarProducto(${indice})"
                    type="button"
                >
                    🗑️
                </button>

            `;


            item.querySelector(
                ".nombre-producto"
            ).textContent = producto.nombre;


            listaCarrito.appendChild(
                item
            );

        }
    );


    totalCarrito.textContent =
        total.toLocaleString();

    actualizarResumenCarrito();

}


// =====================================================
// AUMENTAR CANTIDAD
// =====================================================

function aumentarCantidad(
    indice
) {

    carrito[indice].cantidad++;


    guardarCarrito();


    actualizarContador();


    mostrarCarrito();

}


// =====================================================
// DISMINUIR CANTIDAD
// =====================================================

function disminuirCantidad(
    indice
) {

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


// =====================================================
// ELIMINAR PRODUCTO
// =====================================================

function eliminarProducto(
    indice
) {

    carrito.splice(
        indice,
        1
    );


    guardarCarrito();


    actualizarContador();


    mostrarCarrito();

}


// =====================================================
// FINALIZAR COMPRA POR WHATSAPP
// =====================================================

function abrirCheckout() {
    if (!carrito.length) { alert("Tu carrito está vacío."); return; }
    let checkout = document.getElementById("checkout-datos");
    if (!checkout) {
        checkout = document.createElement("div");
        checkout.id = "checkout-datos";
        checkout.className = "checkout-datos";
        checkout.innerHTML = `<form class="checkout-form">
            <button class="checkout-cerrar" type="button" aria-label="Cerrar">×</button>
            <span class="checkout-paso">ÚLTIMO PASO</span><h2>¿Dónde entregamos tu pedido?</h2>
            <p>Estos datos se incluirán en tu mensaje de WhatsApp para confirmar la compra.</p>
            <label>Nombre completo<input name="nombre" required autocomplete="name" placeholder="Tu nombre"></label>
            <label>Teléfono<input name="telefono" required inputmode="tel" autocomplete="tel" placeholder="Ej. 8888 8888"></label>
            <label>Dirección de entrega<textarea name="direccion" required rows="3" placeholder="Barrio, ciudad y una referencia"></textarea></label>
            <label>Método de entrega<select name="entrega"><option>Entrega a domicilio</option><option>Retiro en tienda</option></select></label>
            <label>Nota para el pedido <input name="nota" maxlength="180" placeholder="Opcional"></label>
            <button class="confirmar-pedido" type="submit">Continuar a WhatsApp</button>
        </form>`;
        document.body.appendChild(checkout);
        checkout.querySelector(".checkout-cerrar").addEventListener("click", function () { checkout.classList.remove("visible"); });
        checkout.addEventListener("click", function (evento) { if (evento.target === checkout) checkout.classList.remove("visible"); });
        checkout.querySelector("form").addEventListener("submit", function (evento) {
            evento.preventDefault();
            if (!evento.currentTarget.reportValidity()) return;
            const cliente = new FormData(evento.currentTarget), resumen = obtenerResumenCompra();
            let mensaje = "Hola, quiero realizar el siguiente pedido:\n\n";
            carrito.forEach(function (producto) { mensaje += "• " + producto.nombre + " x" + producto.cantidad + " - " + formatoMoneda(producto.precio * producto.cantidad) + "\n"; });
            mensaje += "\nSubtotal: " + formatoMoneda(resumen.subtotal);
            if (resumen.descuento) mensaje += "\nDescuento (" + cuponAplicado + "): -" + formatoMoneda(resumen.descuento);
            mensaje += "\nTotal: " + formatoMoneda(resumen.total) + "\n\nDATOS DE ENTREGA\nNombre: " + cliente.get("nombre") + "\nTeléfono: " + cliente.get("telefono") + "\nEntrega: " + cliente.get("entrega") + "\nDirección: " + cliente.get("direccion");
            if (cliente.get("nota")) mensaje += "\nNota: " + cliente.get("nota");
            window.open("https://wa.me/50576823472?text=" + encodeURIComponent(mensaje), "_blank", "noopener");
            checkout.classList.remove("visible");
        });
    }
    checkout.classList.add("visible");
    checkout.querySelector("input[name='nombre']").focus();
}

const finalizarCompra =
    document.getElementById(
        "finalizar-compra"
    );


if (finalizarCompra) {

    finalizarCompra.addEventListener(
        "click",
        function () {

            abrirCheckout();
            return;

            if (
                carrito.length === 0
            ) {

                alert(
                    "Tu carrito está vacío."
                );

                return;

            }


            let mensaje =
                "Hola, quiero realizar el siguiente pedido:\n\n";


            let total = 0;


            carrito.forEach(
                function (producto) {

                    const subtotal =
                        producto.precio *
                        producto.cantidad;


                    total += subtotal;


                    mensaje +=
                        "• " +
                        producto.nombre +
                        " x" +
                        producto.cantidad +
                        " - C$ " +
                        subtotal.toLocaleString() +
                        "\n";

                }
            );


            mensaje +=
                "\nTotal: C$ " +
                total.toLocaleString();


            const numero =
                "50576823472";


            const url =
                "https://wa.me/" +
                numero +
                "?text=" +
                encodeURIComponent(mensaje);


            window.open(
                url,
                "_blank"
            );

        }
    );

}


// =====================================================
// BUSCADOR
// =====================================================

const buscador =
    document.getElementById(
        "buscador"
    );


const productos =
    document.querySelectorAll(
        ".producto"
    );


if (buscador) {

    buscador.addEventListener(
        "input",
        function () {

            const texto =
                buscador.value
                    .toLowerCase()
                    .trim();


            productos.forEach(
                function (producto) {

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


                    if (
                        nombre.includes(
                            texto
                        )
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


let slideActual = 0;


function mostrarSlide(indice) {

    if (!slides.length) {

        return;

    }


    if (
        indice < 0
    ) {

        indice =
            slides.length - 1;

    }


    if (
        indice >= slides.length
    ) {

        indice = 0;

    }


    slideActual =
        indice;


    slides.forEach(
        function (slide, i) {

            slide.classList.toggle(
                "activo",
                i === slideActual
            );

        }
    );


    indicadores.forEach(
        function (indicador, i) {

            indicador.classList.toggle(
                "activo",
                i === slideActual
            );

        }
    );

}


if (botonAnterior) {

    botonAnterior.addEventListener(
        "click",
        function () {

            mostrarSlide(
                slideActual - 1
            );

        }
    );

}


if (botonSiguiente) {

    botonSiguiente.addEventListener(
        "click",
        function () {

            mostrarSlide(
                slideActual + 1
            );

        }
    );

}


indicadores.forEach(
    function (indicador) {

        indicador.addEventListener(
            "click",
            function () {

                const indice =
                    Number(
                        indicador.dataset.slide
                    );


                mostrarSlide(
                    indice
                );

            }
        );

    }
);


// =====================================================
// CAMBIO AUTOMÁTICO
// =====================================================

if (
    slides.length > 1
) {

    setInterval(
        function () {

            mostrarSlide(
                slideActual + 1
            );

        },
        6000
    );

}


// =====================================================
// SISTEMA DE IDIOMAS
// =====================================================

const traducciones = {

    es: {

        nombre: "Español",

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

        nombre: "English",

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

        nombre: "Français",

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
            "Solutions de sécurité pour votre maison et votre entreprise.",

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

        nombre: "Português",

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
            "Soluções de segurança para sua casa e seu negócio.",

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

    }

};


// =====================================================
// APLICAR IDIOMA
// =====================================================

function cambiarIdioma(
    idioma
) {

    const idiomaSeleccionado =
        traducciones[idioma];


    if (!idiomaSeleccionado) {

        return;

    }


    const elementos =
        document.querySelectorAll(
            "[data-text]"
        );


    elementos.forEach(
        function (elemento) {

            const clave =
                elemento.dataset.text;


            if (
                idiomaSeleccionado[clave]
            ) {

                elemento.textContent =
                    idiomaSeleccionado[clave];

            }

        }
    );


    // =================================================
    // PLACEHOLDER
    // =================================================

    if (buscador) {

        const placeholders = {

            es:
                "¿Qué estás buscando?",

            en:
                "What are you looking for?",

            fr:
                "Que recherchez-vous ?",

            pt:
                "O que você está procurando?"

        };


        buscador.placeholder =
            placeholders[idioma];

    }


    // =================================================
    // BOTÓN IDIOMA
    // =================================================

    const botonIdioma =
        document.getElementById(
            "boton-idioma"
        );


    if (botonIdioma) {

        botonIdioma.textContent =
            "🌐 " +
            idiomaSeleccionado.nombre +
            " ▾";

    }


    // =================================================
    // IDIOMA ACTIVO
    // =================================================

    const botonesIdioma =
        document.querySelectorAll(
            "[data-idioma]"
        );


    botonesIdioma.forEach(
        function (boton) {

            boton.classList.toggle(
                "idioma-activo",
                boton.dataset.idioma ===
                idioma
            );

        }
    );


    // =================================================
    // GUARDAR
    // =================================================

    localStorage.setItem(
        "idioma",
        idioma
    );


    document.documentElement.lang =
        idioma;

}


// =====================================================
// MENÚ DE IDIOMAS
// =====================================================

const botonIdioma =
    document.getElementById(
        "boton-idioma"
    );


const menuIdiomas =
    document.getElementById(
        "menu-idiomas"
    );


if (
    botonIdioma &&
    menuIdiomas
) {

    botonIdioma.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();


            menuIdiomas.classList.toggle(
                "abierto"
            );

        }
    );


    const opcionesIdioma =
        menuIdiomas.querySelectorAll(
            "[data-idioma]"
        );


    opcionesIdioma.forEach(
        function (opcion) {

            opcion.addEventListener(
                "click",
                function () {

                    cambiarIdioma(
                        opcion.dataset.idioma
                    );


                    menuIdiomas.classList.remove(
                        "abierto"
                    );

                }
            );

        }
    );


    document.addEventListener(
        "click",
        function (evento) {

            if (
                !evento.target.closest(
                    ".selector-idioma"
                )
            ) {

                menuIdiomas.classList.remove(
                    "abierto"
                );

            }

        }
    );

}


// =====================================================
// INICIALIZACIÓN
// =====================================================

function iniciarTienda() {

    // Crear carrito flotante

    crearCarritoFlotante();


    // Crear asistente virtual gratuito

    crearAsistenteVirtual();


    // Configurar botones

    configurarBotonesAgregar();

    configurarExploradorProductos();


    // Actualizar contador

    actualizarContador();

}


// =====================================================
// IDIOMA GUARDADO
// =====================================================

const idiomaGuardado =
    localStorage.getItem(
        "idioma"
    ) || "es";


cambiarIdioma(
    idiomaGuardado
);


// =====================================================
// INICIAR
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


// =====================================================
// MANTENER CONTADOR SINCRONIZADO
// =====================================================

window.addEventListener(
    "storage",
    function (evento) {

        if (
            evento.key ===
            "carrito"
        ) {

            carrito = obtenerCarritoGuardado();


            actualizarContador();

        }

    }
);


// =====================================================
// PWA - SERVICE WORKER
// =====================================================

if (
    "serviceWorker" in navigator
) {

    let recargaPorActualizacion = false;

    navigator.serviceWorker.addEventListener(
        "controllerchange",
        function () {

            if (recargaPorActualizacion) {

                return;

            }

            recargaPorActualizacion = true;
            window.location.reload();

        }
    );

    window.addEventListener(
        "load",
        function () {

            navigator.serviceWorker
                .register(
                    "./service-worker.js",
                    {
                        updateViaCache: "none"
                    }
                )
                .then(
                    function (registro) {

                        return registro.update();

                    }
                )
                .then(
                    function () {

                        console.log(
                            "Mi Tienda: aplicación instalada correctamente."
                        );

                    }
                )
                .catch(
                    function (error) {

                        console.error(
                            "Error al registrar la aplicación:",
                            error
                        );

                    }
                );

        }
    );

}

function configurarExploradorProductos() {
    const contenedor = document.querySelector(".productos-container");
    if (!contenedor || document.getElementById("herramientas-catalogo")) return;
    let favoritos;
    try { favoritos = JSON.parse(localStorage.getItem("favoritosMiTienda")) || []; } catch (_) { favoritos = []; }
    const tarjetas = Array.from(contenedor.querySelectorAll(".producto"));
    const categorias = [...new Set(tarjetas.map(function (tarjeta) { return tarjeta.querySelector(".producto-categoria")?.textContent.trim(); }).filter(Boolean))];
    const herramientas = document.createElement("div");
    herramientas.id = "herramientas-catalogo";
    herramientas.className = "herramientas-catalogo";
    herramientas.innerHTML = `<div class="chips-categorias"><button type="button" class="activo" data-filtro="todos">Todos</button>${categorias.map(function (categoria) { return `<button type="button" data-filtro="${categoria}">${categoria}</button>`; }).join("")}<button type="button" data-filtro="favoritos">♡ Favoritos</button></div><label class="ordenar-productos">Ordenar <select><option value="relevancia">Relevancia</option><option value="menor">Menor precio</option><option value="mayor">Mayor precio</option></select></label>`;
    contenedor.before(herramientas);

    tarjetas.forEach(function (tarjeta) {
        const nombre = tarjeta.querySelector("h3")?.textContent.trim() || "";
        const boton = document.createElement("button");
        boton.type = "button"; boton.className = "favorito-producto"; boton.setAttribute("aria-label", "Añadir a favoritos");
        const pintar = function () { const activo = favoritos.includes(nombre); boton.classList.toggle("activo", activo); boton.textContent = activo ? "♥" : "♡"; boton.setAttribute("aria-pressed", String(activo)); };
        boton.addEventListener("click", function () { favoritos = favoritos.includes(nombre) ? favoritos.filter(function (item) { return item !== nombre; }) : favoritos.concat(nombre); localStorage.setItem("favoritosMiTienda", JSON.stringify(favoritos)); pintar(); aplicarFiltro(); });
        tarjeta.querySelector(".producto-imagen")?.appendChild(boton); pintar();
    });
    let filtro = "todos";
    function aplicarFiltro() {
        tarjetas.forEach(function (tarjeta) {
            const nombre = tarjeta.querySelector("h3")?.textContent.trim() || "";
            const categoria = tarjeta.querySelector(".producto-categoria")?.textContent.trim();
            tarjeta.hidden = !(filtro === "todos" || (filtro === "favoritos" ? favoritos.includes(nombre) : categoria === filtro));
        });
    }
    herramientas.querySelectorAll("[data-filtro]").forEach(function (boton) { boton.addEventListener("click", function () { filtro = boton.dataset.filtro; herramientas.querySelectorAll("[data-filtro]").forEach(function (item) { item.classList.toggle("activo", item === boton); }); aplicarFiltro(); }); });
    herramientas.querySelector("select").addEventListener("change", function (evento) { const modo = evento.target.value; tarjetas.sort(function (a, b) { const precioA = Number(a.querySelector(".agregar-carrito")?.dataset.precio || 0), precioB = Number(b.querySelector(".agregar-carrito")?.dataset.precio || 0); return modo === "menor" ? precioA - precioB : modo === "mayor" ? precioB - precioA : 0; }).forEach(function (tarjeta) { contenedor.appendChild(tarjeta); }); });
}


// =====================================================
// ASISTENTE VIRTUAL GRATUITO
// =====================================================

function crearAsistenteVirtual() {

    if (document.getElementById("asistente-virtual")) {

        return;

    }

    const asistente = document.createElement("section");

    asistente.id = "asistente-virtual";
    asistente.className = "asistente-virtual";
    asistente.innerHTML = `
        <button class="asistente-boton" type="button" aria-label="Abrir asistente virtual" aria-expanded="false">
            <span aria-hidden="true">✦</span>
            <span class="asistente-boton-texto">Ayuda</span>
        </button>
        <div class="asistente-panel" aria-hidden="true">
            <div class="asistente-encabezado">
                <div>
                    <strong>Asistente de Mi Tienda</strong>
                    <span><i></i> En línea para ayudarte</span>
                </div>
                <button class="asistente-cerrar" type="button" aria-label="Cerrar asistente">×</button>
            </div>
            <div class="asistente-mensajes" aria-live="polite">
                <p class="mensaje-asistente">¡Hola! 👋 Puedo ayudarte a encontrar productos, explicarte cómo comprar o abrir tu carrito.</p>
            </div>
            <div class="asistente-sugerencias">
                <button type="button" data-consulta="¿Cómo compro?">Cómo comprar</button>
                <button type="button" data-consulta="Ver carrito">Ver carrito</button>
                <button type="button" data-consulta="¿Qué productos tienen?">Productos</button>
            </div>
            <form class="asistente-formulario">
                <label class="sr-only" for="asistente-consulta">Escribe tu consulta</label>
                <input id="asistente-consulta" type="text" maxlength="180" placeholder="Escribe tu consulta…" autocomplete="off">
                <button type="submit" aria-label="Enviar consulta">➜</button>
            </form>
        </div>
    `;

    document.body.appendChild(asistente);

    const boton = asistente.querySelector(".asistente-boton");
    const panel = asistente.querySelector(".asistente-panel");
    const cerrar = asistente.querySelector(".asistente-cerrar");
    const formulario = asistente.querySelector(".asistente-formulario");
    const entrada = asistente.querySelector("#asistente-consulta");
    const mensajes = asistente.querySelector(".asistente-mensajes");

    function cambiarEstado(abierto) {

        asistente.classList.toggle("abierto", abierto);
        boton.setAttribute("aria-expanded", String(abierto));
        panel.setAttribute("aria-hidden", String(!abierto));

        if (abierto) {

            entrada.focus();

        }

    }

    function agregarMensaje(texto, clase) {

        const mensaje = document.createElement("p");

        mensaje.className = clase;
        mensaje.textContent = texto;
        mensajes.appendChild(mensaje);
        mensajes.scrollTop = mensajes.scrollHeight;

    }

    const productosDisponibles = Array.from(
        document.querySelectorAll(".producto")
    ).map(function (producto) {

        const nombre = producto.querySelector("h3")?.textContent.trim() || "";
        const descripcion = producto.querySelector("p")?.textContent.trim() || "";
        const precio = producto.querySelector("strong")?.textContent.trim() || "";

        return {
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            busqueda: nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        };

    });

    function responderConsulta(consulta) {

        const texto = consulta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const productoConsultado = productosDisponibles.find(function (producto) {

            return producto.busqueda && texto.includes(producto.busqueda);

        });

        if (/^(hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches)/.test(texto)) {

            agregarMensaje("Hola. Estoy listo para ayudarte con productos, precios, compras y tu carrito.", "mensaje-asistente");
            return;

        }

        if (texto.includes("gracias")) {

            agregarMensaje("Con gusto. Si necesitas algo mas, aqui estoy.", "mensaje-asistente");
            return;

        }

        if (texto.includes("quien eres") || texto.includes("que eres") || texto.includes("asistente")) {

            agregarMensaje("Soy el asistente virtual de Mi Tienda. Puedo darte informacion del catalogo y guiarte durante tu compra.", "mensaje-asistente");
            return;

        }

        if (productoConsultado) {

            agregarMensaje(
                productoConsultado.nombre + ": " + productoConsultado.descripcion + " Precio: " + productoConsultado.precio + ". Puedes agregarlo al carrito desde su tarjeta.",
                "mensaje-asistente"
            );
            return;

        }

        if (texto.includes("carrito")) {

            agregarMensaje("Abro tu carrito para que revises tus productos.", "mensaje-asistente");
            abrirCarrito();
            return;

        }

        if (texto.includes("quitar") || texto.includes("eliminar") || texto.includes("borrar")) {

            agregarMensaje("Abre el carrito para disminuir cantidades o eliminar un producto de tu pedido.", "mensaje-asistente");
            abrirCarrito();
            return;

        }

        if (texto.includes("compr") || texto.includes("pedido")) {

            agregarMensaje("Elige un producto, pulsa “Agregar al carrito” y después finaliza tu compra por WhatsApp desde el carrito.", "mensaje-asistente");
            return;

        }

        if (texto.includes("precio") || texto.includes("cuanto") || texto.includes("costo")) {

            agregarMensaje("Cada producto muestra su precio en la tarjeta. Agrégalo al carrito para ver el total de tu pedido.", "mensaje-asistente");
            return;

        }

        if (texto.includes("envio") || texto.includes("entrega") || texto.includes("direccion")) {

            agregarMensaje("Para confirmar opciones de entrega, finaliza el pedido por WhatsApp y comparte tu dirección con nosotros.", "mensaje-asistente");
            return;

        }

        if (texto.includes("pago") || texto.includes("transferencia")) {

            agregarMensaje("Escríbenos por WhatsApp al finalizar el pedido; allí te confirmaremos los métodos de pago disponibles.", "mensaje-asistente");
            return;

        }

        if (texto.includes("whatsapp") || texto.includes("contacto") || texto.includes("telefono") || texto.includes("hablar")) {

            agregarMensaje("Puedes escribirnos desde el boton flotante de WhatsApp o finalizar tu compra desde el carrito para enviarnos el pedido.", "mensaje-asistente");
            return;

        }

        if (texto.includes("horario") || texto.includes("abierto") || texto.includes("garantia") || texto.includes("devolucion")) {

            agregarMensaje("Para confirmar esa informacion de forma exacta, escribenos por WhatsApp. Asi podremos darte una respuesta actualizada para tu caso.", "mensaje-asistente");
            return;

        }

        if (texto.includes("producto") || texto.includes("catalogo") || texto.includes("tienen")) {

            agregarMensaje("Puedes explorar los productos disponibles en esta página o abrir el catálogo completo desde el menú.", "mensaje-asistente");
            return;

        }

        agregarMensaje("Puedo orientarte sobre productos, compras, precios, pagos, envíos y el carrito. ¿Qué necesitas saber?", "mensaje-asistente");

    }

    boton.addEventListener("click", function () {

        cambiarEstado(!asistente.classList.contains("abierto"));

    });

    cerrar.addEventListener("click", function () {

        cambiarEstado(false);

    });

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const consulta = entrada.value.trim();

        if (!consulta) {

            return;

        }

        agregarMensaje(consulta, "mensaje-cliente");
        entrada.value = "";
        responderConsulta(consulta);

    });

    asistente.querySelectorAll("[data-consulta]").forEach(function (sugerencia) {

        sugerencia.addEventListener("click", function () {

            const consulta = sugerencia.dataset.consulta;
            agregarMensaje(consulta, "mensaje-cliente");
            responderConsulta(consulta);

        });

    });

}
