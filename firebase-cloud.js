// Conector opcional de Firebase. Sin firebase-config.js la tienda continúa
// funcionando localmente, pero no envía datos personales a ningún servicio.
(function () {
    "use strict";

    const configuracion = window.TODO_KLICK_FIREBASE_CONFIG;
    const vacia = !configuracion || !configuracion.projectId || String(configuracion.projectId).startsWith("TU_");

    window.todoKlickNube = {
        activa: false,
        lista: Promise.resolve(false),
        guardarPedido: async function () {
            throw new Error("La nube de Todo Klick todavía no está configurada.");
        }
    };

    if (vacia) return;

    window.todoKlickNube.lista = Promise.all([
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"),
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-functions.js")
    ]).then(function (modulos) {
        const app = modulos[0].initializeApp(configuracion);
        const auth = modulos[1].getAuth(app);
        const functions = modulos[2].getFunctions(app);
        const crearPedidoSeguro = modulos[2].httpsCallable(functions, "crearPedidoSeguro");

        window.todoKlickNube.activa = true;
        window.todoKlickNube.guardarPedido = async function (pedido) {
            if (!auth.currentUser) {
                throw new Error("Inicia sesión para guardar tu pedido en la nube.");
            }

            const respuesta = await crearPedidoSeguro({
                cliente: pedido.cliente,
                productos: pedido.productos,
                nota: pedido.nota || ""
            });

            return respuesta.data;
        };

        window.dispatchEvent(new CustomEvent("todoKlickNubeLista"));
        return true;
    }).catch(function (error) {
        console.error("No se pudo iniciar la nube de Todo Klick.", error);
        return false;
    });
}());
