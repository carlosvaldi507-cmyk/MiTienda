const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const raiz = path.resolve(__dirname, "..");
const leer = archivo => fs.readFileSync(path.join(raiz, archivo), "utf8");

const almacenamiento = new Map();
const localStorage = {
    getItem: clave => almacenamiento.has(clave) ? almacenamiento.get(clave) : null,
    setItem: (clave, valor) => almacenamiento.set(clave, String(valor)),
    removeItem: clave => almacenamiento.delete(clave)
};
const contexto = { window: {}, localStorage, console };
contexto.window.window = contexto.window;
vm.createContext(contexto);
vm.runInContext(leer("productos.js"), contexto, { filename: "productos.js" });

const fuenteTienda = leer("script.js");
const limite = fuenteTienda.indexOf("const DURACION_CARRITO");
assert(limite > 0, "No se encontró el módulo inicial del carrito.");
vm.runInContext(fuenteTienda.slice(0, limite), contexto, { filename: "script.js" });

const normalizar = vm.runInContext("normalizarCarrito", contexto);
const producto = contexto.window.productos.find(item => item.id === 8);
const resultado = normalizar([
    { id: producto.id, cantidad: 1 },
    { nombre: producto.nombre, cantidad: 2 },
    { id: producto.id, cantidad: 150 },
    { id: "inexistente", cantidad: 1 },
    { id: producto.id, cantidad: 0 }
]);

assert.strictEqual(resultado.length, 1, "El carrito debe unificar líneas repetidas.");
assert.strictEqual(resultado[0].cantidad, 99, "La cantidad debe tener un límite seguro de 99 unidades.");
assert.strictEqual(resultado[0].nombre, producto.nombre, "El carrito debe usar el nombre vigente del catálogo.");
assert.strictEqual(resultado[0].precio, producto.precio, "El carrito debe usar el precio vigente del catálogo.");
assert.strictEqual(resultado[0].imagen, producto.imagen, "El carrito debe conservar la imagen del catálogo.");

assert(
    fuenteTienda.includes("const productoBase = buscarProductoCatalogo(producto.id, producto.nombre, false);"),
    "La vista del carrito debe recuperar el producto completo antes de mostrarlo."
);
assert(
    fuenteTienda.includes('imagenCarrito.addEventListener("error"'),
    "La miniatura del carrito debe tener una alternativa si la imagen falla."
);
assert(
    fuenteTienda.includes('dataset.enviando === "true"'),
    "El checkout debe protegerse contra envíos duplicados."
);

["index.html", "catalogo.html", "promociones.html", "inteligente.html"].forEach(archivo => {
    const pagina = leer(archivo);
    assert(pagina.includes('id="ventana-carrito"'), `${archivo} no incluye el contenedor del carrito.`);
    assert(pagina.includes('id="lista-carrito"'), `${archivo} no incluye la lista del carrito.`);
    assert(pagina.includes('id="finalizar-compra"'), `${archivo} no incluye la acción de finalizar compra.`);
});

const nube = leer("firebase-cloud.js");
assert.strictEqual(
    (nube.match(/window\.todoKlickNube\.guardarPedido\s*=/g) || []).length,
    1,
    "La nube debe tener una única ruta de guardado de pedidos."
);
assert(!/firestoreSdk\.setDoc\(\s*firestoreSdk\.doc\(db, "pedidos"/.test(nube), "Los pedidos deben crearse mediante la función segura.");

console.log("Carrito verificado: normalización, imágenes, vistas y sincronización segura correctas.");
