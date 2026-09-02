// =====================================================
// PRODUCTOS - TODO KLICK
// =====================================================

window.productos = [

    {
        id: 8,
        nombre: "Cámara IP",
        descripcion: "Cámara de seguridad para interiores y exteriores.",
        precio: 2500,
        categoria: "Seguridad",
        imagen: "assets/productos/seguridad/camara-ip-01.png?v=1.8.0",
        etiqueta: "",
        stock: true,
        rating: 5,
        resenas: 0
    },

    {
        id: 1,
        nombre: "Termo Hello Kitty actualizado",
        descripcion: "Termo de Hello Kitty de 500ml.",
        precio: 800,
        categoria: "Hogar",
        imagen: "assets/productos/termos/termo-hello-kitty-500ml-01.png?v=1.3.2",
        etiqueta: "⭐ Recomendado",
        stock: true,
        rating: 5,
        resenas: 12
    },


    {
        id: 2,
        nombre: "DVR 8 canales",
        descripcion: "Grabador para sistemas de videovigilancia.",
        precio: 4200,
        categoria: "Seguridad",
        imagen: "assets/productos/seguridad/dvr-8-canales-01.png?v=1.8.0",
        etiqueta: "🔥 Más vendido",
        stock: true,
        rating: 5,
        resenas: 8
    },


    {
        id: 3,
        nombre: "Cable Cat6",
        descripcion: "Cable de red para instalaciones.",
        precio: 3500,
        categoria: "Eléctrico",
        imagen: "assets/productos/redes/cable-cat6-01.png?v=1.8.0",
        etiqueta: "🏷 Oferta",
        stock: true,
        rating: 4,
        resenas: 6
    },


    {
        id: 4,
        nombre: "Kit de herramientas",
        descripcion: "Herramientas para instalación y mantenimiento.",
        precio: 1800,
        categoria: "Herramientas",
        imagen: "assets/productos/herramientas/kit-herramientas-01.png?v=1.8.0",
        etiqueta: "⭐ Recomendado",
        stock: true,
        rating: 5,
        resenas: 10
    },


    {
        id: 5,
        nombre: "Memoria USB",
        descripcion: "Memoria USB para almacenamiento de archivos.",
        precio: 1850,
        categoria: "Tecnología",
        imagen: "assets/productos/tecnologia/memoria-usb-01.png?v=1.8.0",
        etiqueta: "🔥 Más vendido",
        stock: true,
        rating: 4,
        resenas: 7
    },


    {
        id: 6,
        nombre: "Peluche Capibara",
        descripcion: "Peluche suave y adorable de capibara.",
        precio: 900,
        categoria: "Juguetes",
        imagen: "assets/productos/juguetes/peluche-capibara-01.png?v=1.3.2",
        etiqueta: "🆕 Nuevo",
        stock: true,
        rating: 5,
        resenas: 9
    },


    {
        id: 7,
        nombre: "Peluche de felpa",
        descripcion: "Peluche suave ideal para regalo.",
        precio: 750,
        categoria: "Juguetes",
        imagen: "assets/productos/juguetes/peluche-felpa-01.png?v=1.3.2",
        etiqueta: "🎁 Ideal para regalo",
        stock: true,
        rating: 5,
        resenas: 5
    }

];

// Contenido localizado del catálogo. El español permanece como contenido
// base y cada idioma puede adaptar el nombre y la descripción naturalmente.
const traduccionesProductos = {
    en: {
        8: { nombre: "IP Camera", descripcion: "Indoor and outdoor security camera.", categoria: "Security" },
        1: { nombre: "Hello Kitty Tumbler", descripcion: "500 ml Hello Kitty tumbler.", categoria: "Home" },
        2: { nombre: "8-channel DVR", descripcion: "Recorder for video surveillance systems.", categoria: "Security" },
        3: { nombre: "Cat6 Cable", descripcion: "Network cable for professional installations.", categoria: "Electrical" },
        4: { nombre: "Tool Kit", descripcion: "Tools for installation and maintenance.", categoria: "Tools" },
        5: { nombre: "USB Flash Drive", descripcion: "USB storage for your documents and files.", categoria: "Technology" },
        6: { nombre: "Capybara Plush", descripcion: "Soft and adorable capybara plush toy.", categoria: "Toys" },
        7: { nombre: "Soft Plush Toy", descripcion: "A soft plush toy that is perfect as a gift.", categoria: "Toys" }
    },
    fr: {
        8: { nombre: "Caméra IP", descripcion: "Caméra de sécurité intérieure et extérieure.", categoria: "Sécurité" },
        1: { nombre: "Gourde Hello Kitty", descripcion: "Gourde Hello Kitty de 500 ml.", categoria: "Maison" },
        2: { nombre: "DVR 8 canaux", descripcion: "Enregistreur pour systèmes de vidéosurveillance.", categoria: "Sécurité" },
        3: { nombre: "Câble Cat6", descripcion: "Câble réseau pour installations professionnelles.", categoria: "Électricité" },
        4: { nombre: "Kit d’outils", descripcion: "Outils pour l’installation et la maintenance.", categoria: "Outils" },
        5: { nombre: "Clé USB", descripcion: "Stockage USB pour vos documents et fichiers.", categoria: "Technologie" },
        6: { nombre: "Peluche capybara", descripcion: "Adorable peluche capybara toute douce.", categoria: "Jouets" },
        7: { nombre: "Peluche douce", descripcion: "Une peluche douce, idéale à offrir.", categoria: "Jouets" }
    },
    pt: {
        8: { nombre: "Câmera IP", descripcion: "Câmera de segurança para ambientes internos e externos.", categoria: "Segurança" },
        1: { nombre: "Copo Hello Kitty", descripcion: "Copo Hello Kitty de 500 ml.", categoria: "Casa" },
        2: { nombre: "DVR de 8 canais", descripcion: "Gravador para sistemas de videomonitoramento.", categoria: "Segurança" },
        3: { nombre: "Cabo Cat6", descripcion: "Cabo de rede para instalações profissionais.", categoria: "Elétrica" },
        4: { nombre: "Kit de ferramentas", descripcion: "Ferramentas para instalação e manutenção.", categoria: "Ferramentas" },
        5: { nombre: "Pen drive USB", descripcion: "Armazenamento USB para documentos e arquivos.", categoria: "Tecnologia" },
        6: { nombre: "Pelúcia de capivara", descripcion: "Pelúcia de capivara macia e adorável.", categoria: "Brinquedos" },
        7: { nombre: "Bichinho de pelúcia", descripcion: "Pelúcia macia e perfeita para presentear.", categoria: "Brinquedos" }
    },
    zh: {
        8: { nombre: "网络摄像机", descripcion: "适合室内和室外使用的安防摄像机。", categoria: "安防" },
        1: { nombre: "Hello Kitty 保温杯", descripcion: "500 毫升 Hello Kitty 保温杯。", categoria: "家居" },
        2: { nombre: "8 路硬盘录像机", descripcion: "用于视频监控系统的录像设备。", categoria: "安防" },
        3: { nombre: "Cat6 网线", descripcion: "适合专业安装的网络线缆。", categoria: "电气" },
        4: { nombre: "工具套装", descripcion: "适合安装和维护工作的工具套装。", categoria: "工具" },
        5: { nombre: "USB 闪存盘", descripcion: "用于保存文档和文件的 USB 存储设备。", categoria: "科技" },
        6: { nombre: "水豚毛绒玩具", descripcion: "柔软可爱的水豚毛绒玩具。", categoria: "玩具" },
        7: { nombre: "柔软毛绒玩具", descripcion: "柔软可爱，非常适合作为礼物。", categoria: "玩具" }
    }
};

window.traduccionesProductos = traduccionesProductos;

// Metadatos comunes para recomendaciones, entregas y marketplace.
const metadatosProductos = {
    "Cámara IP": { vendedor: "Seguridad Norte", entregaDias: 1, garantiaMeses: 12, tags: ["seguridad", "casa", "cámara"], precioAnterior: 2800 },
    "Termo Hello Kitty actualizado": { vendedor: "Todo Klick", entregaDias: 1, garantiaMeses: 1, tags: ["hogar", "regalo", "mamá", "termo"], precioAnterior: 950 },
    "DVR 8 canales": { vendedor: "Seguridad Norte", entregaDias: 2, garantiaMeses: 12, tags: ["seguridad", "negocio", "cámara"] },
    "Cable Cat6": { vendedor: "TecnoRed", entregaDias: 1, garantiaMeses: 6, tags: ["tecnología", "red", "negocio"] },
    "Kit de herramientas": { vendedor: "FerreKlick", entregaDias: 1, garantiaMeses: 6, tags: ["herramientas", "casa", "papá"] },
    "Memoria USB": { vendedor: "TecnoRed", entregaDias: 2, garantiaMeses: 3, tags: ["tecnología", "estudio", "trabajo"] },
    "Peluche Capibara": { vendedor: "Regalos Luna", entregaDias: 1, garantiaMeses: 1, tags: ["regalo", "niños", "cumpleaños"], precioAnterior: 1050 },
    "Peluche de felpa": { vendedor: "Regalos Luna", entregaDias: 1, garantiaMeses: 1, tags: ["regalo", "niños", "cumpleaños", "mamá"] }
};

const vendedoresTodoKlick = {
    "Todo Klick": { verificado: true, rating: 4.9, pedidos: 842, entregados: 99, respuestaMinutos: 8 },
    "Seguridad Norte": { verificado: true, rating: 4.8, pedidos: 1245, entregados: 98, respuestaMinutos: 15 },
    "TecnoRed": { verificado: true, rating: 4.7, pedidos: 634, entregados: 97, respuestaMinutos: 20 },
    "FerreKlick": { verificado: true, rating: 4.6, pedidos: 391, entregados: 96, respuestaMinutos: 18 },
    "Regalos Luna": { verificado: true, rating: 4.9, pedidos: 517, entregados: 99, respuestaMinutos: 10 }
};

window.productos.forEach(function (producto) {
    Object.assign(producto, metadatosProductos[producto.nombre] || {});
    producto.vendedorInfo = vendedoresTodoKlick[producto.vendedor] || vendedoresTodoKlick["Todo Klick"];
});

window.vendedoresTodoKlick = vendedoresTodoKlick;
