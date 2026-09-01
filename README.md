# Todo Klick

## Comprobación antes de publicar

Con Node.js instalado, ejecutar desde esta carpeta:

```bash
node --check script.js
node --check productos.js
node --check funciones-inteligentes.js
node --check service-worker.js
```

## Publicación en GitHub Pages

Subir siempre el proyecto completo conservando las carpetas, especialmente
`assets/productos`. No subir `debug.log`, `.vscode` ni otros archivos locales.
Cuando cambien JavaScript, CSS o imágenes, actualizar también la versión de
caché en `service-worker.js`.
