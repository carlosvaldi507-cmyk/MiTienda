const http = require("http");
const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const tipos = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp"
};

http.createServer((solicitud, respuesta) => {
    const ruta = new URL(solicitud.url, "http://127.0.0.1").pathname;
    const relativa = decodeURIComponent(ruta === "/" ? "index.html" : ruta.replace(/^\/+/, ""));
    const archivo = path.resolve(raiz, relativa);

    if (!archivo.startsWith(raiz + path.sep) && archivo !== raiz) {
        respuesta.writeHead(403).end("Acceso no permitido");
        return;
    }

    fs.readFile(archivo, (error, contenido) => {
        if (error) {
            respuesta.writeHead(404).end("No encontrado");
            return;
        }
        respuesta.writeHead(200, {
            "Content-Type": tipos[path.extname(archivo).toLowerCase()] || "application/octet-stream",
            "Cache-Control": "no-store"
        });
        respuesta.end(contenido);
    });
}).listen(4173, "127.0.0.1", () => {
    console.log("Servidor de auditoría disponible en http://127.0.0.1:4173");
});
