// Conector opcional de Firebase. Sin firebase-config.js la tienda continúa
// funcionando localmente, pero no envía datos personales a ningún servicio.
(function () {
    "use strict";

    const configuracion = window.TODO_KLICK_FIREBASE_CONFIG;
    const vacia = !configuracion || !configuracion.projectId || String(configuracion.projectId).startsWith("TU_");

    window.todoKlickNube = {
        activa: false,
        lista: Promise.resolve(false),
        guardarPedido: async function () {
            throw new Error("La nube de Todo Klick todavía no está configurada.");
        }
    };

    if (vacia) return;

    window.todoKlickNube.lista = Promise.all([
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"),
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"),
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-functions.js")
    ]).then(function (modulos) {
        const app = modulos[0].initializeApp(configuracion);
        const authSdk = modulos[1];
        const firestoreSdk = modulos[2];
        const functionsSdk = modulos[3];
        const auth = authSdk.getAuth(app);
        const db = firestoreSdk.getFirestore(app);
        const functions = functionsSdk.getFunctions(app);
        const crearPedidoSeguro = functionsSdk.httpsCallable(functions, "crearPedidoSeguro");

        function perfil(usuario) {
            return usuario ? {
                uid: usuario.uid,
                nombre: usuario.displayName || usuario.email.split("@")[0],
                correo: usuario.email || "",
                rol: "cliente"
            } : null;
        }

        async function guardarPerfil(usuario) {
            const datos = perfil(usuario);
            if (!datos) return null;
            await firestoreSdk.setDoc(
                firestoreSdk.doc(db, "usuarios", usuario.uid),
                { nombre: datos.nombre, correo: datos.correo, actualizadoEn: firestoreSdk.serverTimestamp() },
                { merge: true }
            );
            return datos;
        }

        window.todoKlickNube.activa = true;
        window.todoKlickNube.usuario = perfil(auth.currentUser);
        window.todoKlickNube.iniciarSesion = async function (correo, contrasena) {
            const credencial = await authSdk.signInWithEmailAndPassword(auth, correo, contrasena);
            return guardarPerfil(credencial.user);
        };
        window.todoKlickNube.registrarUsuario = async function (nombre, correo, contrasena) {
            const credencial = await authSdk.createUserWithEmailAndPassword(auth, correo, contrasena);
            if (nombre) await authSdk.updateProfile(credencial.user, { displayName: nombre });
            return guardarPerfil(credencial.user);
        };
        window.todoKlickNube.cerrarSesion = function () {
            return authSdk.signOut(auth);
        };
        window.todoKlickNube.alCambiarSesion = function (callback) {
            return authSdk.onAuthStateChanged(auth, async usuario => {
                window.todoKlickNube.usuario = perfil(usuario);
                if (usuario) {
                    try { await guardarPerfil(usuario); } catch (error) { console.warn("No se pudo actualizar el perfil en la nube.", error); }
                }
                callback(window.todoKlickNube.usuario);
            });
        };
        window.todoKlickNube.guardarPedido = async function (pedido) {
            if (!auth.currentUser) {
                throw new Error("Inicia sesión para guardar tu pedido en la nube.");
            }

            const respuesta = await crearPedidoSeguro({
                cliente: pedido.cliente,
                productos: pedido.productos,
                nota: pedido.nota || ""
            });

            return respuesta.data;
        };

        window.dispatchEvent(new CustomEvent("todoKlickNubeLista"));
        return true;
    }).catch(function (error) {
        console.error("No se pudo iniciar la nube de Todo Klick.", error);
        return false;
    });
}());
