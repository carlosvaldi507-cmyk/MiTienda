(function () {
    "use strict";

    const CLAVE_ALERTAS = "favoritosMiTienda";
    const presupuestosRapidos = [300, 500, 1000, 2000];
    const textos = {
        es: { compraInteligente:"COMPRA INTELIGENTE", titulo:"No tienes que saber qué comprar", intro:"Cuéntanos qué necesitas y cuánto quieres gastar.", presupuesto:"Presupuesto máximo", necesidad:"¿Qué necesitas o para quién es?", ejemplo:"Ej. regalo para mamá, estudiar, cosas para casa", elegir:"Ayúdame a elegir", armar:"Arma mi carrito", manana:"¿Qué recibo mañana?", vendedores:"Todos los vendedores", foto:"Comprar por foto", fotoAyuda:"Selecciona una foto. La búsqueda local usa el nombre del archivo como pista; no sube la imagen.", recomendaciones:"Recomendaciones para ti", vacio:"No encontramos productos dentro de ese presupuesto. Prueba con un monto mayor.", agregar:"Agregar al carrito", agregado:"✓ Agregado", comparar:"Comparar", barato:"Más barato" },
        en: { compraInteligente:"SMART SHOPPING", titulo:"You don’t need to know exactly what to buy", intro:"Tell us what you need and how much you want to spend.", presupuesto:"Maximum budget", necesidad:"What do you need, or who is it for?", ejemplo:"E.g. a gift for mom, studying, home essentials", elegir:"Help me choose", armar:"Build my cart", manana:"What can arrive tomorrow?", vendedores:"All sellers", foto:"Shop using a photo", fotoAyuda:"Choose a photo. Local search uses the file name as a clue and does not upload the image.", recomendaciones:"Recommendations for you", vacio:"We couldn’t find products within that budget. Try a higher amount.", agregar:"Add to cart", agregado:"✓ Added", comparar:"Compare", barato:"Lower price" },
        fr: { compraInteligente:"ACHAT INTELLIGENT", titulo:"Vous n’avez pas besoin de savoir exactement quoi acheter", intro:"Dites-nous ce qu’il vous faut et votre budget.", presupuesto:"Budget maximal", necesidad:"Que recherchez-vous, ou pour qui ?", ejemplo:"Ex. cadeau pour maman, études, maison", elegir:"Aidez-moi à choisir", armar:"Composer mon panier", manana:"Que puis-je recevoir demain ?", vendedores:"Tous les vendeurs", foto:"Acheter avec une photo", fotoAyuda:"Choisissez une photo. La recherche locale utilise le nom du fichier sans envoyer l’image.", recomendaciones:"Recommandations pour vous", vacio:"Aucun produit trouvé dans ce budget. Essayez un montant supérieur.", agregar:"Ajouter au panier", agregado:"✓ Ajouté", comparar:"Comparer", barato:"Moins cher" },
        pt: { compraInteligente:"COMPRA INTELIGENTE", titulo:"Você não precisa saber exatamente o que comprar", intro:"Conte o que precisa e quanto deseja gastar.", presupuesto:"Orçamento máximo", necesidad:"O que você precisa ou para quem é?", ejemplo:"Ex. presente para mãe, estudos, itens para casa", elegir:"Ajude-me a escolher", armar:"Monte meu carrinho", manana:"O que posso receber amanhã?", vendedores:"Todos os vendedores", foto:"Comprar com uma foto", fotoAyuda:"Escolha uma foto. A busca local usa o nome do arquivo como pista e não envia a imagem.", recomendaciones:"Recomendações para você", vacio:"Não encontramos produtos nesse orçamento. Tente um valor maior.", agregar:"Adicionar ao carrinho", agregado:"✓ Adicionado", comparar:"Comparar", barato:"Mais barato" },
        zh: { compraInteligente:"智能购物", titulo:"即使不确定买什么也没关系", intro:"请告诉我们您的需求和预算。", presupuesto:"最高预算", necesidad:"您需要什么，或要送给谁？", ejemplo:"例如：送给妈妈的礼物、学习用品、家居用品", elegir:"帮我选择", armar:"为我搭配购物车", manana:"哪些商品明天能到？", vendedores:"所有卖家", foto:"以图找商品", fotoAyuda:"请选择照片。本地搜索只使用文件名作为线索，不会上传图片。", recomendaciones:"为您推荐", vacio:"该预算内没有找到商品，请尝试提高预算。", agregar:"加入购物车", agregado:"✓ 已添加", comparar:"比较", barato:"更便宜" }
    };

    function ti(clave) {
        const idioma = window.todoKlick?.idioma?.() || "es";
        return textos[idioma]?.[clave] || textos.es[clave] || clave;
    }

    const textosResultados = {
        es:{ coincide:"Coincide con {n} aspecto(s) de tu búsqueda.", valor:"Buena relación entre valoración y precio.", carrito:"Carrito recomendado", ahorro:"Ahorro", rapida:"Disponible para entrega rápida", mejor:"Lo mejor por", parecidos:"Productos parecidos a", alternativas:"Alternativas más baratas que", sinAlternativas:"No hay alternativas más baratas", comparador:"Comparador inteligente", garantia:"Garantía", entrega:"Entrega", meses:"mes(es)", dias:"día(s)", mejorPrecio:"Mejor precio", mejorValoracion:"Mejor valoración" },
        en:{ coincide:"Matches {n} part(s) of your search.", valor:"Good balance between rating and price.", carrito:"Recommended cart", ahorro:"Savings", rapida:"Available for fast delivery", mejor:"Best options for", parecidos:"Products similar to", alternativas:"Lower-priced alternatives to", sinAlternativas:"No lower-priced alternatives found", comparador:"Smart comparison", garantia:"Warranty", entrega:"Delivery", meses:"month(s)", dias:"day(s)", mejorPrecio:"Best price", mejorValoracion:"Best rating" },
        fr:{ coincide:"Correspond à {n} critère(s) de votre recherche.", valor:"Bon rapport entre la note et le prix.", carrito:"Panier recommandé", ahorro:"Économie", rapida:"Disponible en livraison rapide", mejor:"Meilleurs choix pour", parecidos:"Produits similaires à", alternativas:"Alternatives moins chères à", sinAlternativas:"Aucune alternative moins chère", comparador:"Comparateur intelligent", garantia:"Garantie", entrega:"Livraison", meses:"mois", dias:"jour(s)", mejorPrecio:"Meilleur prix", mejorValoracion:"Meilleure note" },
        pt:{ coincide:"Corresponde a {n} aspecto(s) da sua busca.", valor:"Boa relação entre avaliação e preço.", carrito:"Carrinho recomendado", ahorro:"Economia", rapida:"Disponível para entrega rápida", mejor:"Melhores opções por", parecidos:"Produtos parecidos com", alternativas:"Alternativas mais baratas que", sinAlternativas:"Não há alternativas mais baratas", comparador:"Comparador inteligente", garantia:"Garantia", entrega:"Entrega", meses:"mês(es)", dias:"dia(s)", mejorPrecio:"Melhor preço", mejorValoracion:"Melhor avaliação" },
        zh:{ coincide:"符合您搜索中的 {n} 个条件。", valor:"评分和价格之间具有良好平衡。", carrito:"推荐购物车", ahorro:"节省", rapida:"可快速配送", mejor:"该预算的最佳选择", parecidos:"相似商品", alternativas:"更便宜的替代商品", sinAlternativas:"没有更便宜的替代商品", comparador:"智能比较", garantia:"保修", entrega:"配送", meses:"个月", dias:"天", mejorPrecio:"最低价格", mejorValoracion:"最高评分" }
    };

    function tir(clave, valores) {
        const idioma = window.todoKlick?.idioma?.() || "es";
        let texto = textosResultados[idioma]?.[clave] || textosResultados.es[clave] || clave;
        Object.entries(valores || {}).forEach(function (entrada) {
            texto = texto.replaceAll("{" + entrada[0] + "}", entrada[1]);
        });
        return texto;
    }

    function dinero(valor) {
        return "C$ " + Number(valor || 0).toLocaleString("es-NI");
    }

    function textoProducto(producto) {
        return [producto.nombre, producto.descripcion, producto.categoria]
            .concat(producto.tags || [])
            .join(" ")
            .toLowerCase();
    }

    function disponibles() {
        return (window.productos || []).filter(function (producto) {
            return producto.stock;
        });
    }

    function recomendar(presupuesto, necesidad, limite = 5) {
        const palabras = String(necesidad || "")
            .toLowerCase()
            .split(/\s+/)
            .filter(function (palabra) { return palabra.length > 2; });

        return disponibles()
            .filter(function (producto) { return producto.precio <= presupuesto; })
            .map(function (producto) {
                const texto = textoProducto(producto);
                const coincidencias = palabras.filter(function (palabra) {
                    return texto.includes(palabra);
                }).length;
                const valor = (producto.rating || 0) * 10 + coincidencias * 30 - producto.precio / Math.max(presupuesto, 1);
                return { producto: producto, valor: valor, coincidencias: coincidencias };
            })
            .sort(function (a, b) { return b.valor - a.valor; })
            .slice(0, limite);
    }

    function armarCarrito(presupuesto, necesidad) {
        const candidatos = recomendar(presupuesto, necesidad, disponibles().length)
            .map(function (resultado) { return resultado.producto; });
        const seleccion = [];
        let total = 0;

        candidatos.forEach(function (producto) {
            if (total + producto.precio <= presupuesto) {
                seleccion.push(producto);
                total += producto.precio;
            }
        });

        return { productos: seleccion, total: total, ahorro: Math.max(0, presupuesto - total) };
    }

    function crear(tag, clase, texto) {
        const nodo = document.createElement(tag);
        if (clase) nodo.className = clase;
        if (texto !== undefined) nodo.textContent = texto;
        return nodo;
    }

    function mostrarResultados(contenedor, resultados, titulo) {
        contenedor.replaceChildren();
        contenedor.appendChild(crear("h3", "", titulo));

        if (!resultados.length) {
            contenedor.appendChild(crear("p", "estado-vacio", ti("vacio")));
            return;
        }

        const rejilla = crear("div", "resultados-inteligentes");
        resultados.forEach(function (resultado) {
            const producto = resultado.producto || resultado;
            const tarjeta = crear("article", "resultado-inteligente");
            tarjeta.appendChild(crear("span", "resultado-categoria", producto.categoria));
            tarjeta.appendChild(crear("h4", "", producto.nombre));
            tarjeta.appendChild(crear("strong", "", dinero(producto.precio)));
            tarjeta.appendChild(crear("p", "", resultado.coincidencias
                ? tir("coincide", { n: resultado.coincidencias })
                : tir("valor")));
            tarjeta.appendChild(crear("small", "", "🚚 " + producto.entregaDias + " " + tir("dias") + " · " + producto.vendedor));
            const boton = crear("button", "boton-inteligente", ti("agregar"));
            boton.type = "button";
            boton.addEventListener("click", function () {
                window.todoKlick.agregarProducto(producto.nombre);
                boton.textContent = ti("agregado");
            });
            tarjeta.appendChild(boton);
            rejilla.appendChild(tarjeta);
        });
        contenedor.appendChild(rejilla);
    }

    function crearPanel() {
        const productos = document.querySelector(".productos-container");
        if (!productos || document.getElementById("descubridor-compras")) return;

        const panel = crear("section", "descubridor-compras");
        panel.id = "descubridor-compras";
        panel.setAttribute("aria-labelledby", "titulo-descubridor");
        panel.innerHTML = `
            <div class="descubridor-encabezado">
                <span>✨ ${ti("compraInteligente")}</span>
                <h2 id="titulo-descubridor">${ti("titulo")}</h2>
            </div>
            <div class="descubridor-formulario">
                <label>${ti("presupuesto")}
                    <input id="presupuesto-inteligente" type="number" min="1" max="1000000" value="1000" inputmode="numeric">
                </label>
                <label>${ti("necesidad")}
                    <input id="necesidad-inteligente" type="text" maxlength="100" placeholder="${ti("ejemplo")}">
                </label>
                <button type="button" id="buscar-presupuesto" class="buscar-inteligente-principal">${ti("elegir")}</button>
            </div>
            <div class="presupuestos-rapidos" aria-label="Mejores compras por presupuesto"></div>
            <label class="filtro-vendedor">Marketplace
                <select id="filtro-vendedor"><option value="">${ti("vendedores")}</option></select>
            </label>
            <details class="busqueda-foto">
                <summary>📸 ${ti("foto")}</summary>
                <p>${ti("fotoAyuda")}</p>
                <input id="foto-producto" type="file" accept="image/*">
            </details>
            <div id="resultados-descubridor" class="contenedor-resultados" aria-live="polite"></div>
        `;

        const destinoInicio = document.getElementById("panel-compra-inteligente-inicio");
        if (destinoInicio) {
            destinoInicio.appendChild(panel);
        } else {
            productos.before(panel);
        }
        const salida = panel.querySelector("#resultados-descubridor");
        const campoPresupuesto = panel.querySelector("#presupuesto-inteligente");
        const campoNecesidad = panel.querySelector("#necesidad-inteligente");

        panel.querySelector("#buscar-presupuesto").addEventListener("click", function () {
            const presupuesto = Number(campoPresupuesto.value);
            mostrarResultados(salida, recomendar(presupuesto, campoNecesidad.value), ti("recomendaciones"));
        });

        panel.querySelector("#armar-carrito").addEventListener("click", function () {
            const presupuesto = Number(campoPresupuesto.value);
            const propuesta = armarCarrito(presupuesto, campoNecesidad.value);
            if (!propuesta.productos.length) {
                mostrarResultados(salida, [], tir("carrito"));
                return;
            }
            window.todoKlick.reemplazarCarrito(propuesta.productos.map(function (producto) {
                return { nombre: producto.nombre, cantidad: 1 };
            }));
            mostrarResultados(salida, propuesta.productos, tir("carrito") + ": " + dinero(propuesta.total) + " · " + tir("ahorro") + ": " + dinero(propuesta.ahorro));
        });

        panel.querySelector("#entrega-rapida").addEventListener("click", function () {
            const presupuesto = Number(campoPresupuesto.value);
            const rapidos = recomendar(presupuesto, campoNecesidad.value, disponibles().length)
                .filter(function (resultado) { return resultado.producto.entregaDias <= 1; });
            mostrarResultados(salida, rapidos, tir("rapida"));
        });

        const filtroVendedor = panel.querySelector("#filtro-vendedor");
        Object.keys(window.vendedoresTodoKlick || {}).forEach(function (vendedor) {
            const opcion = crear("option", "", vendedor);
            opcion.value = vendedor;
            filtroVendedor.appendChild(opcion);
        });
        filtroVendedor.addEventListener("change", function () {
            document.querySelectorAll(".producto").forEach(function (tarjeta) {
                const nombre = tarjeta.querySelector("h3")?.textContent.trim();
                const producto = disponibles().find(function (item) {
                    return String(item.id) === String(tarjeta.dataset.productoId) || item.nombre === nombre;
                });
                tarjeta.style.display = !filtroVendedor.value || producto?.vendedor === filtroVendedor.value ? "" : "none";
            });
        });

        presupuestosRapidos.forEach(function (monto) {
            const boton = crear("button", "", dinero(monto));
            boton.type = "button";
            boton.addEventListener("click", function () {
                campoPresupuesto.value = monto;
                mostrarResultados(salida, recomendar(monto, campoNecesidad.value), tir("mejor") + " " + dinero(monto));
            });
            panel.querySelector(".presupuestos-rapidos").appendChild(boton);
        });

        panel.querySelector("#foto-producto").addEventListener("change", function (evento) {
            const archivo = evento.target.files[0];
            if (!archivo) return;
            const pistas = archivo.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
            campoNecesidad.value = pistas;
            mostrarResultados(salida, recomendar(Number(campoPresupuesto.value), pistas), tir("parecidos") + " “" + pistas + "”");
        });
    }

    function decorarCatalogo() {
        const seleccionados = new Set();
        const tarjetas = Array.from(document.querySelectorAll(".producto"));

        tarjetas.forEach(function (tarjeta) {
            const nombre = tarjeta.querySelector("h3")?.textContent.trim();
            const producto = disponibles().find(function (item) {
                return String(item.id) === String(tarjeta.dataset.productoId) || item.nombre === nombre;
            });
            const info = tarjeta.querySelector(".producto-info");
            if (!producto || !info || info.querySelector(".confianza-vendedor")) return;

            const confianza = crear("div", "confianza-vendedor");
            confianza.textContent = "✓ " + producto.vendedor + " · ⭐ " + producto.vendedorInfo.rating + " · " + producto.vendedorInfo.entregados + "% entregados · 🚚 " + producto.entregaDias + " día(s)";
            info.insertBefore(confianza, info.querySelector(".agregar-carrito"));

            const acciones = crear("div", "acciones-producto-inteligente");
            const comparar = crear("button", "", ti("comparar"));
            comparar.type = "button";
            comparar.addEventListener("click", function () {
                seleccionados.has(nombre) ? seleccionados.delete(nombre) : seleccionados.add(nombre);
                if (seleccionados.size > 4) seleccionados.delete(Array.from(seleccionados)[0]);
                comparar.classList.toggle("activo", seleccionados.has(nombre));
                mostrarComparador(Array.from(seleccionados));
            });

            const alternativas = crear("button", "", ti("barato"));
            alternativas.type = "button";
            alternativas.addEventListener("click", function () {
                const opciones = disponibles()
                    .filter(function (item) {
                        const tagsComunes = (item.tags || []).some(function (tag) {
                            return (producto.tags || []).includes(tag);
                        });
                        return item.nombre !== nombre && item.precio < producto.precio &&
                            (item.categoria === producto.categoria || tagsComunes);
                    })
                    .sort(function (a, b) { return b.rating - a.rating || b.precio - a.precio; })
                    .slice(0, 4);
                const salida = document.getElementById("resultados-descubridor");
                mostrarResultados(salida, opciones, opciones.length ? tir("alternativas") + " " + nombre : tir("sinAlternativas"));
                document.getElementById("descubridor-compras")?.scrollIntoView({ behavior: "smooth" });
            });

            acciones.append(comparar, alternativas);
            info.insertBefore(acciones, info.querySelector(".agregar-carrito"));
        });
    }

    function mostrarComparador(nombres) {
        let modal = document.getElementById("comparador-productos");
        if (!modal) {
            modal = crear("section", "comparador-productos");
            modal.id = "comparador-productos";
            document.body.appendChild(modal);
        }

        if (nombres.length < 2) {
            modal.hidden = true;
            return;
        }

        const productos = nombres.map(function (nombre) {
            return disponibles().find(function (producto) { return producto.nombre === nombre; });
        }).filter(Boolean);
        const mejorPrecio = productos.reduce(function (mejor, producto) { return producto.precio < mejor.precio ? producto : mejor; });
        const mejorGeneral = productos.reduce(function (mejor, producto) { return producto.rating > mejor.rating ? producto : mejor; });
        modal.replaceChildren(crear("h3", "", tir("comparador")));
        const tabla = crear("div", "tabla-comparador");
        productos.forEach(function (producto) {
            const columna = crear("article", "");
            columna.append(
                crear("strong", "", producto.nombre),
                crear("span", "", dinero(producto.precio)),
                crear("span", "", "⭐ " + producto.rating + "/5"),
                crear("span", "", tir("garantia") + ": " + producto.garantiaMeses + " " + tir("meses")),
                crear("span", "", tir("entrega") + ": " + producto.entregaDias + " " + tir("dias"))
            );
            tabla.appendChild(columna);
        });
        modal.append(tabla, crear("p", "", tir("mejorPrecio") + ": " + mejorPrecio.nombre + " · " + tir("mejorValoracion") + ": " + mejorGeneral.nombre));
        modal.hidden = false;
    }

    function comprobarAlertas() {
        let alertas = [];
        try { alertas = JSON.parse(localStorage.getItem(CLAVE_ALERTAS) || "[]"); } catch (_) { alertas = []; }
        const bajaron = disponibles().filter(function (producto) {
            return alertas.includes(producto.nombre) && producto.precioAnterior && producto.precio < producto.precioAnterior;
        });
        if (!bajaron.length) return;
        const mensaje = bajaron.map(function (p) { return p.nombre + " ahora " + dinero(p.precio); }).join(" · ");
        if (window.todoKlickNotificaciones) {
            window.todoKlickNotificaciones.agregar("Bajó de precio", mensaje, "🏷️");
        }
    }

    function iniciar() {
        if (!window.todoKlick || !Array.isArray(window.productos)) return;
        crearPanel();
        decorarCatalogo();
        comprobarAlertas();
    }

    window.addEventListener("idiomaCambiado", function () {
        document.getElementById("descubridor-compras")?.remove();
        document.getElementById("comparador-productos")?.remove();
        crearPanel();
        decorarCatalogo();
    });

    window.addEventListener("productosRenderizados", function () {
        decorarCatalogo();
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
}());
