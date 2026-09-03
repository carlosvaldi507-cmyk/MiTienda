const fs = require("fs");
const path = require("path");
const vm = require("vm");

const raiz = path.resolve(__dirname, "..");
const leer = archivo => fs.readFileSync(path.join(raiz, archivo), "utf8");
const fallos = [];
const exigir = (condicion, mensaje) => {
    if (!condicion) fallos.push(mensaje);
};

const contexto = { window: {} };
vm.createContext(contexto);
vm.runInContext(leer("productos.js"), contexto, { filename: "productos.js" });
const productos = contexto.window.productos || [];
const limitePorImagen = 160 * 1024;
const limiteTotalImagenes = 2 * 1024 * 1024;
let pesoImagenes = 0;

exigir(Array.isArray(productos) && productos.length > 0, "No se pudo cargar el catálogo para revisar su presupuesto.");

productos.forEach(producto => {
    const imagen = String(producto.imagen || "").split("?")[0];
    const ruta = path.join(raiz, imagen);
    exigir(/^assets\/productos\/optimizado\/.+\.webp$/i.test(imagen), `El producto ${producto.id} no usa una miniatura WebP optimizada.`);
    exigir(fs.existsSync(ruta), `Falta la imagen optimizada del producto ${producto.id}.`);
    if (fs.existsSync(ruta)) {
        const peso = fs.statSync(ruta).size;
        pesoImagenes += peso;
        exigir(peso <= limitePorImagen, `La imagen del producto ${producto.id} supera 160 KB.`);
    }
    exigir(Boolean(producto.vendedor), `Falta vendedor en el producto ${producto.id}.`);
    exigir(Number.isFinite(Number(producto.entregaDias)) && Number(producto.entregaDias) > 0, `Falta entregaDias válido en el producto ${producto.id}.`);
});

exigir(pesoImagenes <= limiteTotalImagenes, "Las miniaturas del catálogo superan el presupuesto total de 2 MB.");
exigir(fs.existsSync(path.join(raiz, "mi-fondo.webp")), "Falta la imagen WebP principal.");
if (fs.existsSync(path.join(raiz, "mi-fondo.webp"))) {
    exigir(fs.statSync(path.join(raiz, "mi-fondo.webp")).size <= 180 * 1024, "La imagen principal supera el presupuesto de 180 KB.");
}

const paginas = ["index.html", "catalogo.html", "promociones.html", "inteligente.html"];
const contenidos = paginas.map(leer);
const versiones = expresion => new Set(contenidos.map(contenido => (expresion.exec(contenido) || [])[1]).filter(Boolean));
const versionesCss = versiones(/style\.css\?v=([\w.-]+)/);
const versionesProductos = versiones(/productos\.js\?v=([\w.-]+)/);
const versionesScript = versiones(/script\.js\?v=([\w.-]+)/);

exigir(versionesCss.size === 1, "Las páginas no usan la misma versión de style.css.");
exigir(versionesProductos.size === 1, "Las páginas no usan la misma versión de productos.js.");
exigir(versionesScript.size === 1, "Las páginas no usan la misma versión de script.js.");
exigir(!/no-store/i.test(leer("index.html")) && !/no-store/i.test(leer("catalogo.html")), "La portada o el catálogo aún fuerzan no-store y evitan una caché HTTP normal.");
exigir(/mi-fondo\.webp/.test(leer("index.html")) && /mi-fondo\.webp/.test(leer("style.css")), "La portada todavía referencia el fondo PNG pesado.");

const script = leer("script.js");
exigir(!script.includes("nube.finally(iniciarTienda)"), "Firebase sigue bloqueando el inicio visual de la tienda.");
exigir(script.includes('loading="${prioridad ? "eager" : "lazy"}"'), "Las tarjetas no diferencian las imágenes prioritarias de las diferidas.");
exigir(script.includes("producto.activo !== false && (!soloDisponible || producto.stock === true)"), "El carrito podría aceptar productos inactivos.");
exigir(!script.includes("navigator.serviceWorker.getRegistrations()"), "La limpieza PWA podría afectar otros proyectos del mismo origen.");

const reglas = leer("firestore.rules");
exigir(/match \/pedidos\/\{pedidoId\}[\s\S]*?allow create: if false;/.test(reglas), "Los pedidos aún podrían escribirse directo desde el navegador.");

const preparadorAndroid = leer("scripts/preparar-android.js");
exigir(!/^\s*"assets"\s*$/m.test(preparadorAndroid), "La compilación Android todavía copia todos los originales de assets.");
exigir(preparadorAndroid.includes("assets/productos/optimizado"), "La compilación Android no incluye las miniaturas optimizadas.");

if (fallos.length) {
    fallos.forEach(fallo => console.error(`Error de rendimiento: ${fallo}`));
    process.exitCode = 1;
} else {
    console.log(`Rendimiento verificado: ${productos.length} productos, ${(pesoImagenes / 1024).toFixed(0)} KB de miniaturas y versiones coherentes.`);
}
