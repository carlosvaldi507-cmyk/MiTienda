const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const destino = path.join(raiz, "www");
const archivos = [
    "index.html",
    "catalogo.html",
    "promociones.html",
    "inteligente.html",
    "404.html",
    "style.css",
    "script.js",
    "productos.js",
    "funciones-inteligentes.js",
    "firebase-config.js",
    "firebase-cloud.js",
    "service-worker.js",
    "manifest.json",
    "mi-fondo.webp",
    "icon-192.png",
    "icon-512.png",
    "assets/marca/nichi-icon-192.png",
    "assets/marca/nichi-icon-512.png"
];
const directorios = [
    "assets/productos/optimizado"
];

fs.rmSync(destino, { recursive: true, force: true });
fs.mkdirSync(destino, { recursive: true });

for (const archivo of archivos) {
    const destinoArchivo = path.join(destino, archivo);
    fs.mkdirSync(path.dirname(destinoArchivo), { recursive: true });
    fs.cpSync(path.join(raiz, archivo), destinoArchivo, {
        recursive: true
    });
}

for (const directorio of directorios) {
    const destinoDirectorio = path.join(destino, directorio);
    fs.mkdirSync(path.dirname(destinoDirectorio), { recursive: true });
    fs.cpSync(path.join(raiz, directorio), destinoDirectorio, {
        recursive: true
    });
}

console.log("Contenido web preparado para Android en www/.");
