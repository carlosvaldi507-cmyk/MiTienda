# Arquitectura del proyecto

## Objetivo

Evolucionar la tienda actual hacia una plataforma ecommerce administrable, segura y preparada para web/PWA y aplicaciones móviles.

## Capas

### 1. Cliente

- `index.html`: inicio y descubrimiento.
- `catalogo.html`: catálogo.
- `style.css`: sistema visual y responsive.
- `script.js`: interacción, carrito, checkout y comportamiento general.
- `productos.js`: catálogo local durante la transición.
- `funciones-inteligentes.js`: funciones adicionales del cliente.

### 2. PWA

- `manifest.json`: metadatos instalables.
- `service-worker.js`: caché, offline y actualización.

### 3. Firebase

- `firebase-config.js`: configuración pública del SDK web.
- `firebase-cloud.js`: integración del cliente con servicios Firebase.
- `firestore.rules`: autorización de Firestore.
- `firestore.indexes.json`: índices requeridos por consultas.
- `firebase.json`: configuración de Firebase CLI.

Consultar `FIREBASE_SETUP.md` antes de activar o modificar producción.

## Modelo de datos objetivo

### productos/{productoId}

Campos previstos:

- `nombre`
- `descripcion`
- `precio`
- `categoria`
- `imagen`
- `stock`
- `activo`
- `etiqueta`
- `rating`
- `resenas`
- `createdAt`
- `updatedAt`

### usuarios/{uid}

Datos mínimos de perfil. No almacenar contraseñas. Firebase Authentication gestiona credenciales.

### pedidos/{pedidoId}

Debe relacionarse con el usuario y contener una copia controlada de los productos comprados. Los importes sensibles deben validarse en servidor.

Estados previstos:

`pendiente -> confirmado -> preparando -> en_camino -> entregado`

Estados alternativos: `cancelado`, `rechazado` o `reembolsado` cuando el negocio los implemente.

### categorias/{categoriaId}

Catálogo administrable de categorías, orden y visibilidad.

### cupones/{cuponId}

En producción, la validez y cálculo de descuentos deben verificarse en backend, no solo en JavaScript del navegador.

## Migración recomendada

1. Mantener la tienda actual estable.
2. Activar Authentication real.
3. Leer productos desde Firestore con fallback controlado.
4. Crear panel administrativo protegido.
5. Migrar imágenes a Storage.
6. Registrar pedidos en backend y recalcular precios de forma segura.
7. Incorporar seguimiento de pedidos.
8. Incorporar notificaciones.
9. Integrar pagos cuando el flujo anterior esté probado.
10. Empaquetar/publicar versiones móviles.

## Principio de seguridad

El navegador del cliente es un entorno no confiable. Cualquier dato que afecte dinero, permisos, inventario o estado de pedidos debe verificarse mediante reglas y/o lógica de servidor antes de considerarse válido.
