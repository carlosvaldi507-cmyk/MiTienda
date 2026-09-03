# Activación segura de Firebase

La tienda conserva el modo local mientras Firebase no esté conectado. No se
deben guardar datos de clientes en la nube hasta completar todos estos pasos.

1. En la consola de Firebase registra la aplicación web del proyecto **NICHI**.
   Activa Cloud Firestore en modo de producción y Cloud Storage.
2. Activa Firebase Authentication con **correo y contraseña**. Las cuentas de
   demostración actuales no son cuentas reales y deben retirarse antes del
   lanzamiento.
3. Copia `firebase-config.example.js` como `firebase-config.js` y reemplaza
   únicamente los valores de configuración web. Esta configuración identifica
   la aplicación; no sustituye las reglas de seguridad y nunca debe incluir una
   clave privada ni un archivo de cuenta de servicio.
4. Instala Firebase CLI en un equipo administrador, inicia sesión con tu propia
   cuenta y ejecuta:

   ```powershell
   npm.cmd run build:android-web
   firebase.cmd deploy --project mitienda-5848e --only hosting
   ```

5. Antes de desplegar reglas y Functions, configura Firebase App Check para la
   web y Android, e inicialízalo en la aplicación. La función
   `crearPedidoSeguro` exige un token de App Check por seguridad.
6. Carga los productos en la colección `productos`, usando el ID del producto
   como identificador de documento y los campos `nombre`, `precio`, `stock` y
   `activo`. La función de pedidos vuelve a leer esos datos en el servidor, por
   lo que no acepta precios enviados por el cliente.
7. Cuando los productos y App Check estén listos, instala las dependencias de
   la función y publica el backend:

   ```powershell
   npm.cmd --prefix functions install
   firebase.cmd deploy --project mitienda-5848e --only firestore:rules,firestore:indexes,storage,functions
   ```

8. Configura copias de seguridad programadas en Google Cloud y prueba las reglas
   con el Emulator Suite antes de procesar pedidos reales.

## Estructura protegida

- `productos`: lectura pública únicamente para productos activos; edición solo
  para administrador.
- `usuarios/{uid}`: accesible solo por su titular o administrador.
- `pedidos/{id}`: los clientes leen únicamente sus pedidos; se crean desde la
  función `crearPedidoSeguro`.
- `productos/*` en Storage: lectura pública y carga limitada a imágenes de menos
  de 5 MB por administrador.

La aplicación ya usa Firebase Authentication y tiene el checkout conectado a la
función de servidor. No publiques las reglas de pedidos hasta haber cargado el
catálogo de Firestore y configurado App Check; de otro modo el pedido seguirá
por WhatsApp, pero no se sincronizará en la nube. No compartas contraseñas ni
claves de cuenta de servicio.
