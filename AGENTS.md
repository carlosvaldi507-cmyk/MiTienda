# AGENTS.md — Todo Klick / app de compras

Este archivo define cómo debe trabajar Codex dentro de este repositorio.

## Objetivo del proyecto

Construir y lanzar una plataforma de compras en línea para Nicaragua, actualmente basada en HTML, CSS y JavaScript, con evolución progresiva hacia Firebase para autenticación, datos, pedidos, inventario e imágenes.

La prioridad es mejorar el producto sin romper funciones existentes ni introducir riesgos de seguridad.

## Arquitectura actual

- Frontend: HTML + CSS + JavaScript sin framework.
- PWA: `manifest.json` + `service-worker.js`.
- Productos locales: `productos.js` y recursos en `assets/productos` mientras continúe la migración.
- Firebase: configuración web, Firestore, reglas, índices y preparación de nube.
- Publicación web actual: GitHub Pages.
- Empaquetado móvil: Capacitor preparado mediante `capacitor.config.json`.

Antes de cambiar Firebase, leer `FIREBASE_SETUP.md`.

## Reglas de trabajo obligatorias

1. No eliminar ni reemplazar funciones existentes salvo que la tarea lo requiera explícitamente.
2. Hacer cambios pequeños, aislados y reversibles.
3. No trabajar directamente sobre `main` para cambios funcionales importantes. Crear una rama descriptiva y usar Pull Request.
4. No subir contraseñas, tokens, claves privadas, cuentas de servicio, credenciales administrativas ni archivos `.env` con secretos.
5. Nunca debilitar `firestore.rules` o reglas de Storage para resolver rápidamente un error.
6. No confiar en precios, descuentos, stock, totales o roles enviados por el cliente. Las operaciones sensibles deben validarse del lado servidor cuando exista backend Firebase.
7. Mantener compatibilidad responsive y comprobar especialmente móvil.
8. Mantener accesibilidad básica: etiquetas, `aria-*`, navegación por teclado y contraste razonable.
9. Evitar dependencias nuevas si JavaScript nativo resuelve el problema de forma clara. Si se agrega una dependencia, explicar por qué.
10. No cambiar branding, nombre comercial, textos legales o datos de contacto salvo solicitud expresa.

## Firebase y seguridad

- `productos`: lectura pública únicamente para productos activos; escritura administrativa.
- `usuarios/{uid}`: acceso del propio usuario y administrador según reglas.
- `pedidos`: no permitir que un cliente modifique precios o estados arbitrariamente.
- Las imágenes de producto deben validarse por tipo y tamaño cuando se carguen a Storage.
- Antes de desplegar reglas, revisar el impacto en usuarios existentes y probar con Emulator Suite cuando sea posible.
- No asumir que la configuración web de Firebase es un secreto. Sí tratar como secretos las credenciales administrativas y cuentas de servicio.

## Flujo esperado para una tarea

1. Leer los archivos relevantes antes de editar.
2. Explicar brevemente el plan si la tarea afecta varias áreas.
3. Implementar la mínima modificación necesaria.
4. Ejecutar comprobaciones disponibles.
5. Revisar el diff buscando regresiones, credenciales o cambios accidentales.
6. Resumir exactamente qué cambió y cómo verificarlo.

## Comprobaciones mínimas

Cuando los archivos existan y Node.js esté disponible, ejecutar:

```bash
node --check script.js
node --check productos.js
node --check funciones-inteligentes.js
node --check service-worker.js
node scripts/verificar-integridad.js
```

Si se modifica Firebase, además comprobar sintaxis/configuración aplicable y no desplegar a producción si hay errores conocidos.

## Service Worker y caché

Si se modifican JavaScript, CSS, HTML relevante o recursos que necesiten invalidación, revisar `service-worker.js` y actualizar la versión de caché cuando corresponda. Evitar ciclos de recarga o cachés obsoletos.

## Productos e inventario

La dirección del proyecto es migrar progresivamente de productos codificados localmente hacia Firestore y un panel de administración.

Durante la transición:

- Mantener un fallback local si la tarea lo requiere.
- Usar IDs estables.
- No duplicar productos entre fuentes sin una estrategia explícita.
- Separar `precio`, `stock`, `activo`, `categoria`, `imagen` y metadatos de presentación.

## Pedidos

La meta es que el checkout deje de depender exclusivamente de WhatsApp y registre pedidos confiables en Firebase. WhatsApp puede mantenerse como canal de confirmación durante la transición.

Un pedido no debe considerarse seguro si el total se calcula únicamente con datos manipulables del navegador.

## Calidad del código

- Usar nombres descriptivos y coherentes con el español ya utilizado en el proyecto.
- Preferir funciones pequeñas y responsabilidades claras.
- Evitar duplicar lógica ya existente.
- No introducir `console.log` de datos personales, tokens o información sensible.
- Mantener comentarios útiles; no llenar archivos de comentarios redundantes.

## Cambios de alto riesgo

Pedir confirmación o dejar el cambio claramente separado antes de:

- borrar colecciones o datos;
- cambiar UIDs administrativos;
- modificar reglas de seguridad de forma amplia;
- cambiar dominio, proyecto Firebase o configuración de producción;
- introducir pagos reales;
- migrar masivamente datos;
- eliminar compatibilidad con el modo local.

## Definición de terminado

Una tarea está terminada cuando:

- la función solicitada está implementada;
- las comprobaciones relevantes pasan o se documenta por qué no pueden ejecutarse;
- no se introducen secretos;
- no hay regresiones evidentes en móvil/escritorio;
- el cambio queda resumido con pasos de verificación.
