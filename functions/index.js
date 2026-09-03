const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

function texto(valor, limite) {
    return String(valor || "").trim().slice(0, limite);
}

exports.crearPedidoSeguro = onCall({ enforceAppCheck: true }, async request => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "Debes iniciar sesión para crear un pedido.");
    }

    const datos = request.data || {};
    const cliente = datos.cliente || {};
    const lineas = Array.isArray(datos.productos) ? datos.productos : [];
    const nombre = texto(cliente.nombre, 100);
    const telefono = texto(cliente.telefono, 25);
    const direccion = texto(cliente.direccion, 280);
    const entrega = texto(cliente.entrega, 40);

    if (!nombre || !telefono || !entrega || !lineas.length || lineas.length > 40) {
        throw new HttpsError("invalid-argument", "Los datos del pedido no son válidos.");
    }

    const pedidoId = db.collection("pedidos").doc().id;
    const numero = `TK-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${pedidoId.slice(0, 6).toUpperCase()}`;

    const pedido = await db.runTransaction(async transaccion => {
        const productos = [];
        let total = 0;

        for (const linea of lineas) {
            const id = String(linea.id || "");
            const cantidad = Math.floor(Number(linea.cantidad));
            if (!id || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
                throw new HttpsError("invalid-argument", "Una línea del pedido no es válida.");
            }

            const referencia = db.collection("productos").doc(id);
            const documento = await transaccion.get(referencia);
            const producto = documento.data();
            if (!documento.exists || !producto.activo || !producto.stock || !Number.isFinite(producto.precio)) {
                throw new HttpsError("failed-precondition", "Un producto ya no está disponible.");
            }

            const precio = Number(producto.precio);
            productos.push({ id, nombre: texto(producto.nombre, 140), precio, cantidad });
            total += precio * cantidad;
        }

        const resultado = {
            numero,
            clienteUid: request.auth.uid,
            estado: "Pendiente de confirmación",
            cliente: { nombre, telefono, direccion, entrega },
            productos,
            nota: texto(datos.nota, 180),
            total,
            fecha: new Date().toISOString(),
            creadoEn: FieldValue.serverTimestamp(),
            actualizadoEn: FieldValue.serverTimestamp()
        };

        transaccion.create(db.collection("pedidos").doc(pedidoId), resultado);
        return { id: pedidoId, numero, total };
    });

    return pedido;
});
