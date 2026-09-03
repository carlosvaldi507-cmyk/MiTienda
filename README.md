# NICHI

## Comprobación antes de publicar

Con Node.js instalado, ejecutar desde esta carpeta:

```bash
npm run check
npm run build:android-web
```

## Publicación en GitHub Pages

La web publicada en GitHub Pages sale de la rama `main` y la raíz del proyecto.
Antes de enviar una versión, ejecuta las comprobaciones anteriores y publica
solamente los archivos fuente; `www/`, `node_modules/` y las carpetas de prueba
están excluidos del repositorio.

El servicio de caché se retira automáticamente para que una versión antigua no
vuelva a quedarse abierta. Las referencias de CSS y JavaScript usan versión y
Firebase Hosting revalida los recursos en cada visita.

## Publicación en Firebase Hosting

Firebase Hosting usa el contenido generado en `www/`. Después de ejecutar
`npm run build:android-web`, se publica con:

```bash
firebase.cmd deploy --project mitienda-5848e --only hosting
```

## Datos en la nube

La preparación segura para Firebase está documentada en
[`FIREBASE_SETUP.md`](FIREBASE_SETUP.md). Nunca se deben subir contraseñas,
cuentas de servicio ni claves privadas al repositorio.
