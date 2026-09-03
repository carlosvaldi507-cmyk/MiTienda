# Activación segura de Firebase

La tienda conserva el modo local mientras Firebase no esté conectado. No se
deben guardar datos de clientes en la nube hasta completar todos estos pasos.

1. En la consola de Firebase crea el proyecto **NICHI** y registra una
   aplicación web. Activa Cloud Firestore en modo de producción y Cloud
   Storage.
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
   firebase use TU_PROYECTO
   firebase deploy --only firestore:rules,storage,functions
   ```

5. La cuenta propietaria actual queda protegida por su UID en las reglas de
   Firestore. Si en el futuro cambias de cuenta administradora, actualiza ese
   UID en las reglas y vuelve a publicarlas.
6. Carga los productos en la colección `productos`, usando el ID del producto
   como identificador de documento y los campos `nombre`, `precio`, `stock` y
   `activo`. La función de pedidos vuelve a leer esos datos en el servidor, por
   lo que no acepta precios enviados por el cliente.
7. Configura copias de seguridad programadas en Google Cloud y prueba las reglas
   con el Emulator Suite antes de procesar pedidos reales.

## Estructura protegida

- `productos`: lectura pública únicamente para productos activos; edición solo
  para administrador.
- `usuarios/{uid}`: accesible solo por su titular o administrador.
- `pedidos/{id}`: los clientes leen únicamente sus pedidos; se crean desde la
  función `crearPedidoSeguro`.
- `productos/*` en Storage: lectura pública y carga limitada a imágenes de menos
  de 5 MB por administrador.

La app todavía necesita sustituir el acceso de demostración por Firebase
Authentication y conectar el checkout a la función antes de considerar activa
la nube. Compárteme la configuración web pública del proyecto cuando lo crees;
no compartas contraseñas ni claves de cuenta de servicio.
