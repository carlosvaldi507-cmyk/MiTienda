// =====================================================
// MI TIENDA - SISTEMA DE CARRITO
// =====================================================


// =====================================================
// CARRITO
// =====================================================

// Recuperar carrito guardado anteriormente
let carrito = JSON.parse(
    localStorage.getItem("carrito")
) || [];


// =====================================================
// BUSCADOR
// =====================================================

const buscador = document.getElementById("buscador");

const productos = document.querySelectorAll(".producto");


if (buscador) {

    buscador.addEventListener("input", function () {

        const texto = buscador.value
            .toLowerCase()
            .trim();


        productos.forEach(function (producto) {

            const nombre = producto
                .querySelector("h3")
                .textContent
                .toLowerCase();


            if (nombre.includes(texto)) {

                producto.style.display = "block";

            } else {

                producto.style.display = "none";

            }

        });

    });

}


// =====================================================
// AGREGAR PRODUCTOS AL CARRITO
// =====================================================

const botonesAgregar =
    document.querySelectorAll(".agregar-carrito");


botonesAgregar.forEach(function (boton) {

    boton.addEventListener("click", function () {

        const nombre =
            boton.dataset.nombre;


        const precio =
            Number(boton.dataset.precio);


        // Buscar si el producto ya existe
        const productoExistente =
            carrito.find(function (producto) {

                return producto.nombre === nombre;

            });


        if (productoExistente) {

            // Si existe, aumentar cantidad

            productoExistente.cantidad++;

        } else {

            // Si no existe, agregarlo

            carrito.push({

                nombre: nombre,

                precio: precio,

                cantidad: 1

            });

        }


        // Guardar
        guardarCarrito();


        // Actualizar contador
        actualizarContador();


        // Mostrar mensaje
        alert(
            nombre +
            " fue agregado al carrito."
        );

    });

});


// =====================================================
// GUARDAR CARRITO
// =====================================================

function guardarCarrito() {

    localStorage.setItem(

        "carrito",

        JSON.stringify(carrito)

    );

}


// =====================================================
// CONTADOR DEL CARRITO
// =====================================================

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
                    producto.cantidad;

            },

            0

        );


    contador.textContent =
        cantidadTotal;

}


// Ejecutar al cargar
actualizarContador();


// =====================================================
// ABRIR CARRITO
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

            ventanaCarrito.style.display =
                "flex";

            mostrarCarrito();

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
// CERRAR AL HACER CLIC FUERA
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


    listaCarrito.innerHTML = "";


    // Carrito vacío
    if (carrito.length === 0) {

        listaCarrito.innerHTML = `

            <p class="carrito-vacio">

                Tu carrito está vacío.

            </p>

        `;


        totalCarrito.textContent = "0";

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

                    <strong>
                        ${producto.nombre}
                    </strong>

                    <span>
                        C$ ${producto.precio.toLocaleString()}
                    </span>

                </div>


                <div class="controles-cantidad">

                    <button
                        onclick="disminuirCantidad(${indice})"
                    >
                        −
                    </button>


                    <span>
                        ${producto.cantidad}
                    </span>


                    <button
                        onclick="aumentarCantidad(${indice})"
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
        total.toLocaleString();

}


// =====================================================
// AUMENTAR CANTIDAD
// =====================================================

function aumentarCantidad(indice) {

    carrito[indice].cantidad++;


    guardarCarrito();

    actualizarContador();

    mostrarCarrito();

}


// =====================================================
// DISMINUIR CANTIDAD
// =====================================================

function disminuirCantidad(indice) {

    carrito[indice].cantidad--;


    if (
        carrito[indice].cantidad <= 0
    ) {

        carrito.splice(indice, 1);

    }


    guardarCarrito();

    actualizarContador();

    mostrarCarrito();

}


// =====================================================
// ELIMINAR PRODUCTO
// =====================================================

function eliminarProducto(indice) {

    carrito.splice(indice, 1);


    guardarCarrito();

    actualizarContador();

    mostrarCarrito();

}


// =====================================================
// FINALIZAR COMPRA
// =====================================================

const finalizarCompra =
    document.getElementById(
        "finalizar-compra"
    );


if (finalizarCompra) {

    finalizarCompra.addEventListener(
        "click",
        function () {

            if (carrito.length === 0) {

                alert(
                    "Tu carrito está vacío."
                );

                return;

            }


            alert(
                "El carrito está listo. " +
                "Próximamente conectaremos " +
                "el pedido con WhatsApp."
            );

        }
    );

}