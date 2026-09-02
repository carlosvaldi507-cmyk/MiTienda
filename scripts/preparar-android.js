const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const destino = path.join(raiz, "www");
const archivos = [
    "index.html",
    "catalogo.html",
    "404.html",
    "style.css",
    "script.js",
    "productos.js",
    "funciones-inteligentes.js",
    "firebase-config.js",
    "firebase-cloud.js",
    "service-worker.js",
    "manifest.json",
    "mi-fondo.png",
    "icon-192.png",
    "icon-512.png",
    "assets"
];

fs.rmSync(destino, { recursive: true, force: true });
fs.mkdirSync(destino, { recursive: true });

for (const archivo of archivos) {
    fs.cpSync(path.join(raiz, archivo), path.join(destino, archivo), {
        recursive: true
    });
}

console.log("Contenido web preparado para Android en www/.");
