const fs = require("fs");
const path = require("path");
const vm = require("vm");

const raiz = path.resolve(__dirname, "..");
const leer = archivo => fs.readFileSync(path.join(raiz, archivo), "utf8");
const fallar = mensaje => {
    console.error(`Error de integridad: ${mensaje}`);
    process.exitCode = 1;
};

const contexto = { window: {} };
vm.createContext(contexto);
vm.runInContext(leer("productos.js"), contexto, { filename: "productos.js" });
const productos = contexto.window.productos;

if (!Array.isArray(productos) || productos.length === 0) {
    fallar("productos.js no declara un catálogo válido.");
} else {
    const ids = new Set();
    productos.forEach(producto => {
        if (!Number.isInteger(producto.id) || ids.has(producto.id)) fallar(`ID inválido o repetido: ${producto.id}`);
        ids.add(producto.id);
        if (!producto.nombre || !producto.categoria || !Number.isFinite(producto.precio) || producto.precio <= 0) fallar(`Datos incompletos en el producto ${producto.id}.`);

        const archivoImagen = String(producto.imagen || "").split("?")[0];
        if (!archivoImagen || !fs.existsSync(path.join(raiz, archivoImagen))) fallar(`Imagen inexistente para el producto ${producto.id}: ${archivoImagen}`);
    });
}

const paginas = ["index.html", "catalogo.html"].map(leer).join("\n");
const worker = leer("service-worker.js");
const recursos = ["style.css", "productos.js", "script.js", "funciones-inteligentes.js"];

recursos.forEach(recurso => {
    const archivoSeguro = recurso.replace(".", "\\.");
    const versionPagina = new RegExp(`${archivoSeguro}\\?v=([\\w.-]+)`).exec(paginas);
    const versionWorker = new RegExp(`\\./${archivoSeguro}\\?v=([\\w.-]+)`).exec(worker);
    if (!versionPagina || !versionWorker) return fallar(`Falta la versión de ${recurso} en una página o en el service worker.`);
    if (versionPagina[1] !== versionWorker[1]) fallar(`La versión de ${recurso} no coincide entre las páginas y el service worker.`);
});

const registros = (leer("script.js").match(/navigator\.serviceWorker\.register/g) || []).length;
if (registros !== 1) fallar(`Se esperaban 1 registro del service worker y se encontraron ${registros}.`);

if (!process.exitCode) console.log(`Integridad correcta: ${productos.length} productos, imágenes y versiones verificadas.`);
