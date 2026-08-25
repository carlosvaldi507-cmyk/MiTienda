/* =========================================================
   MI TIENDA
   DISEÑO PREMIUM DE BOTONES
   VERSIÓN 1.0
   ========================================================= */


/* =========================================================
   VARIABLES DEL DISEÑO
   ========================================================= */

:root {

    --premium-azul:
        #0b2633;

    --premium-azul-2:
        #103c4d;

    --premium-turquesa:
        #18b9ad;

    --premium-turquesa-2:
        #0d8991;

    --premium-ambar:
        #f6ad24;

    --premium-blanco:
        #ffffff;

    --premium-texto:
        #123b4a;

    --premium-borde:
        rgba(18, 59, 74, .12);

    --premium-sombra:
        0 10px 28px rgba(8, 38, 51, .14);

    --premium-sombra-hover:
        0 16px 34px rgba(8, 38, 51, .22);

    --premium-transicion:
        all .22s cubic-bezier(.2,.8,.2,1);

}


/* =========================================================
   REGLAS GENERALES
   ========================================================= */

button {

    font-family:
        inherit;

    -webkit-tap-highlight-color:
        transparent;

}


button:focus-visible,
a:focus-visible,
select:focus-visible {

    outline:
        3px solid rgba(24,185,173,.35);

    outline-offset:
        3px;

}


/* =========================================================
   BOTÓN ENTRAR
   ========================================================= */

.boton-entrar {

    position:
        relative !important;

    display:
        inline-flex !important;

    align-items:
        center !important;

    justify-content:
        center !important;

    gap:
        8px;

    min-width:
        128px;

    height:
        50px;

    padding:
        0 20px !important;

    border:
        1px solid rgba(24,185,173,.35) !important;

    border-radius:
        15px !important;

    background:
        rgba(255,255,255,.055) !important;

    color:
        #ffffff !important;

    font-size:
        15px !important;

    font-weight:
        750 !important;

    letter-spacing:
        .1px;

    cursor:
        pointer;

    box-shadow:
        inset 0 1px 0 rgba(255,255,255,.08),
        0 5px 18px rgba(0,0,0,.08) !important;

    transition:
        var(--premium-transicion);

    overflow:
        hidden;

}


.boton-entrar::before {

    content:
        "";

    position:
        absolute;

    inset:
        0;

    background:
        linear-gradient(
            120deg,
            transparent 20%,
            rgba(255,255,255,.14) 50%,
            transparent 80%
        );

    transform:
        translateX(-120%);

    transition:
        transform .55s ease;

}


.boton-entrar:hover {

    transform:
        translateY(-2px);

    border-color:
        rgba(24,185,173,.8) !important;

    background:
        rgba(24,185,173,.13) !important;

    box-shadow:
        0 10px 25px rgba(0,0,0,.18),
        0 0 0 1px rgba(24,185,173,.08) !important;

}


.boton-entrar:hover::before {

    transform:
        translateX(120%);

}


.boton-entrar:active {

    transform:
        translateY(0)
        scale(.98);

}


/* =========================================================
   CARRITO PRINCIPAL
   ========================================================= */

.boton-carrito {

    position:
        relative !important;

    display:
        inline-flex !important;

    align-items:
        center !important;

    justify-content:
        center !important;

    gap:
        9px;

    min-width:
        158px;

    height:
        52px;

    padding:
        0 18px !important;

    border:
        none !important;

    border-radius:
        16px !important;

    background:
        linear-gradient(
            135deg,
            #f7b52d,
            #ed9c14
        ) !important;

    color:
        #092a37 !important;

    font-size:
        15px !important;

    font-weight:
        850 !important;

    cursor:
        pointer;

    box-shadow:
        0 8px 22px rgba(238,159,22,.25),
        inset 0 1px 0 rgba(255,255,255,.45) !important;

    transition:
        var(--premium-transicion);

    overflow:
        hidden;

}


.boton-carrito::before {

    content:
        "";

    position:
        absolute;

    top:
        0;

    left:
        -120%;

    width:
        80%;

    height:
        100%;

    background:
        linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.35),
            transparent
        );

    transform:
        skewX(-18deg);

    transition:
        left .6s ease;

}


.boton-carrito:hover {

    transform:
        translateY(-3px);

    box-shadow:
        0 14px 30px rgba(238,159,22,.34),
        inset 0 1px 0 rgba(255,255,255,.5) !important;

}


.boton-carrito:hover::before {

    left:
        130%;

}


.boton-carrito:active {

    transform:
        translateY(-1px)
        scale(.98);

}


/* =========================================================
   CONTADOR DEL CARRITO
   ========================================================= */

#contador-carrito {

    min-width:
        28px;

    height:
        28px;

    padding:
        0 7px;

    display:
        inline-flex;

    align-items:
        center;

    justify-content:
        center;

    border-radius:
        50px;

    background:
        #d83232;

    color:
        #ffffff;

    border:
        2px solid rgba(255,255,255,.75);

    font-size:
        12px;

    font-weight:
        900;

    line-height:
        1;

    box-shadow:
        0 3px 8px rgba(0,0,0,.18);

}


/* =========================================================
   BOTONES AGREGAR AL CARRITO
   ========================================================= */

.agregar-carrito {

    position:
        relative !important;

    width:
        100% !important;

    min-height:
        50px;

    margin-top:
        14px;

    padding:
        0 18px !important;

    display:
        flex !important;

    align-items:
        center !important;

    justify-content:
        center !important;

    gap:
        8px;

    border:
        0 !important;

    border-radius:
        14px !important;

    background:
        linear-gradient(
            135deg,
            #0f7180,
            #0a596d
        ) !important;

    color:
        #ffffff !important;

    font-size:
        14px !important;

    font-weight:
        800 !important;

    letter-spacing:
        .1px;

    cursor:
        pointer;

    box-shadow:
        0 8px 18px rgba(10,89,109,.22),
        inset 0 1px 0 rgba(255,255,255,.14) !important;

    transition:
        var(--premium-transicion);

    overflow:
        hidden;

}


.agregar-carrito::before {

    content:
        "🛒";

    font-size:
        16px;

    transition:
        transform .2s ease;

}


.agregar-carrito::after {

    content:
        "";

    position:
        absolute;

    inset:
        0;

    background:
        linear-gradient(
            110deg,
            transparent 25%,
            rgba(255,255,255,.16) 50%,
            transparent 75%
        );

    transform:
        translateX(-100%);

    transition:
        transform .55s ease;

}


.agregar-carrito:hover {

    transform:
        translateY(-3px);

    background:
        linear-gradient(
            135deg,
            #14929a,
            #0a6477
        ) !important;

    box-shadow:
        0 13px 27px rgba(10,89,109,.32),
        inset 0 1px 0 rgba(255,255,255,.2) !important;

}


.agregar-carrito:hover::before {

    transform:
        scale(1.12)
        rotate(-6deg);

}


.agregar-carrito:hover::after {

    transform:
        translateX(100%);

}


.agregar-carrito:active {

    transform:
        translateY(-1px)
        scale(.985);

}


/* =========================================================
   FILTROS DEL CATÁLOGO
   ========================================================= */

.filtro-categoria,
.filtro,
.categoria-boton {

    min-height:
        43px;

    padding:
        0 18px !important;

    border:
        1px solid rgba(24,185,173,.45) !important;

    border-radius:
        50px !important;

    background:
        rgba(18,59,74,.42) !important;

    color:
        #ffffff !important;

    font-size:
        14px !important;

    font-weight:
        700 !important;

    cursor:
        pointer;

    transition:
        var(--premium-transicion);

}


.filtro-categoria:hover,
.filtro:hover,
.categoria-boton:hover {

    transform:
        translateY(-2px);

    background:
        rgba(24,185,173,.16) !important;

    border-color:
        #18b9ad !important;

    box-shadow:
        0 7px 18px rgba(0,0,0,.14);

}


/* =========================================================
   SELECTOR DE IDIOMA
   ========================================================= */

#boton-idioma {

    min-width:
        180px !important;

    height:
        52px !important;

    padding:
        0 18px !important;

    display:
        inline-flex !important;

    align-items:
        center !important;

    justify-content:
        center !important;

    border:
        2px solid rgba(24,185,173,.8) !important;

    border-radius:
        16px !important;

    background:
        rgba(255,255,255,.97) !important;

    color:
        #123b4a !important;

    font-size:
        15px !important;

    font-weight:
        800 !important;

    cursor:
        pointer;

    box-shadow:
        0 6px 18px rgba(0,0,0,.16),
        inset 0 1px 0 #ffffff !important;

    transition:
        var(--premium-transicion);

}


#boton-idioma:hover {

    transform:
        translateY(-2px);

    border-color:
        #18b9ad !important;

    box-shadow:
        0 12px 25px rgba(0,0,0,.2),
        0 0 0 4px rgba(24,185,173,.08) !important;

}


/* =========================================================
   MENÚ DE IDIOMAS
   ========================================================= */

.menu-idiomas {

    border:
        1px solid rgba(18,59,74,.12) !important;

    border-radius:
        17px !important;

    padding:
        8px !important;

    background:
        rgba(255,255,255,.98) !important;

    box-shadow:
        0 20px 45px rgba(5,31,42,.24) !important;

    backdrop-filter:
        blur(15px);

}


.menu-idiomas button {

    min-height:
        45px !important;

    padding:
        0 13px !important;

    border:
        0 !important;

    border-radius:
        10px !important;

    background:
        transparent !important;

    color:
        #123b4a !important;

    font-weight:
        700 !important;

    cursor:
        pointer;

    transition:
        var(--premium-transicion);

}


.menu-idiomas button:hover {

    transform:
        translateX(3px) !important;

    background:
        #edf8f8 !important;

    color:
        #0d7b87 !important;

}


.menu-idiomas button.idioma-activo {

    background:
        linear-gradient(
            135deg,
            #0d7180,
            #0b6070
        ) !important;

    color:
        #ffffff !important;

    box-shadow:
        0 5px 13px rgba(10,89,109,.2);

}


/* =========================================================
   SELECTOR DE MONEDA
   ========================================================= */

#selector-moneda,
.selector-pais-mi-tienda {

    min-height:
        50px !important;

    border:
        1px solid rgba(18,59,74,.15) !important;

    border-radius:
        15px !important;

    background:
        #ffffff !important;

    color:
        #123b4a !important;

    font-weight:
        700 !important;

    padding:
        0 14px !important;

    cursor:
        pointer;

    box-shadow:
        0 5px 15px rgba(0,0,0,.08);

    transition:
        var(--premium-transicion);

}


#selector-moneda:hover,
.selector-pais-mi-tienda:hover {

    border-color:
        #18b9ad !important;

    transform:
        translateY(-2px);

    box-shadow:
        0 10px 22px rgba(0,0,0,.14);

}


/* =========================================================
   CARRITO FLOTANTE
   ========================================================= */

.carrito-flotante {

    width:
        66px !important;

    height:
        66px !important;

    right:
        24px !important;

    bottom:
        24px !important;

    border:
        3px solid rgba(255,255,255,.95) !important;

    border-radius:
        50% !important;

    background:
        linear-gradient(
            145deg,
            #147d8b,
            #0b586b
        ) !important;

    box-shadow:
        0 12px 30px rgba(4,48,63,.28),
        0 0 0 5px rgba(20,125,139,.08) !important;

    transition:
        transform .22s ease,
        box-shadow .22s ease;

}


.carrito-flotante:hover {

    transform:
        translateY(-5px)
        scale(1.04) !important;

    box-shadow:
        0 18px 38px rgba(4,48,63,.35),
        0 0 0 7px rgba(20,125,139,.1) !important;

}


.icono-carrito-flotante {

    font-size:
        28px !important;

}


.contador-carrito-flotante {

    top:
        -3px !important;

    right:
        -3px !important;

    min-width:
        27px !important;

    height:
        27px !important;

    background:
        linear-gradient(
            135deg,
            #f6ad24,
            #e89312
        ) !important;

    border:
        3px solid #ffffff !important;

    font-size:
        11px !important;

    box-shadow:
        0 4px 10px rgba(0,0,0,.2);

}


/* =========================================================
   BOTÓN "VER CARRITO"
   ========================================================= */

.ver-carrito-notificacion {

    min-height:
        42px;

    padding:
        0 15px !important;

    border:
        0 !important;

    border-radius:
        11px !important;

    background:
        linear-gradient(
            135deg,
            #0d7180,
            #0a596d
        ) !important;

    color:
        #ffffff !important;

    font-weight:
        800 !important;

    cursor:
        pointer;

    transition:
        var(--premium-transicion);

}


.ver-carrito-notificacion:hover {

    transform:
        translateY(-2px);

    box-shadow:
        0 7px 16px rgba(10,89,109,.25);

}


/* =========================================================
   COMPARTIR CARRITO
   ========================================================= */

.compartir-carrito {

    width:
        100% !important;

    min-height:
        50px;

    border:
        1px solid rgba(13,113,128,.5) !important;

    border-radius:
        13px !important;

    background:
        linear-gradient(
            135deg,
            #f5fbfb,
            #eaf7f7
        ) !important;

    color:
        #086071 !important;

    font-weight:
        800 !important;

    cursor:
        pointer;

    transition:
        var(--premium-transicion);

}


.compartir-carrito:hover {

    transform:
        translateY(-2px);

    background:
        #ffffff !important;

    border-color:
        #0d8991 !important;

    box-shadow:
        0 8px 20px rgba(13,113,128,.13);

}


/* =========================================================
   VACIAR CARRITO
   ========================================================= */

.vaciar-carrito {

    border:
        0 !important;

    background:
        transparent !important;

    color:
        #b32632 !important;

    font-weight:
        750 !important;

    cursor:
        pointer;

    transition:
        var(--premium-transicion);

}


.vaciar-carrito:hover {

    color:
        #8f1721 !important;

    text-decoration:
        underline;

}


/* =========================================================
   FINALIZAR COMPRA WHATSAPP
   ========================================================= */

.finalizar-compra {

    position:
        relative !important;

    width:
        100% !important;

    min-height:
        60px !important;

    padding:
        0 20px !important;

    border:
        0 !important;

    border-radius:
        16px !important;

    background:
        linear-gradient(
            135deg,
            #20d66b,
            #18bc5a
        ) !important;

    color:
        #ffffff !important;

    font-size:
        16px !important;

    font-weight:
        850 !important;

    cursor:
        pointer;

    box-shadow:
        0 10px 25px rgba(24,188,90,.25),
        inset 0 1px 0 rgba(255,255,255,.3) !important;

    transition:
        var(--premium-transicion);

    overflow:
        hidden;

}


.finalizar-compra::before {

    content:
        "";

    position:
        absolute;

    inset:
        0;

    background:
        linear-gradient(
            110deg,
            transparent 20%,
            rgba(255,255,255,.22) 50%,
            transparent 80%
        );

    transform:
        translateX(-110%);

    transition:
        transform .55s ease;

}


.finalizar-compra:hover {

    transform:
        translateY(-3px);

    box-shadow:
        0 15px 32px rgba(24,188,90,.34),
        inset 0 1px 0 rgba(255,255,255,.4) !important;

}


.finalizar-compra:hover::before {

    transform:
        translateX(110%);

}


.finalizar-compra:active {

    transform:
        translateY(-1px)
        scale(.985);

}


/* =========================================================
   APLICAR CUPÓN
   ========================================================= */

#aplicar-cupon {

    min-height:
        48px !important;

    padding:
        0 20px !important;

    border:
        0 !important;

    border-radius:
        11px !important;

    background:
        linear-gradient(
            135deg,
            #0f7180,
            #0b596b
        ) !important;

    color:
        #ffffff !important;

    font-weight:
        800 !important;

    cursor:
        pointer;

    transition:
        var(--premium-transicion);

}


#aplicar-cupon:hover {

    transform:
        translateY(-2px);

    box-shadow:
        0 8px 18px rgba(10,89,109,.25);

}


/* =========================================================
   CONTROLES + / -
   ========================================================= */

.controles-cantidad button {

    width:
        40px !important;

    height:
        40px !important;

    min-width:
        40px;

    padding:
        0 !important;

    display:
        inline-flex !important;

    align-items:
        center !important;

    justify-content:
        center !important;

    border:
        0 !important;

    border-radius:
        11px !important;

    background:
        #edf3f5 !important;

    color:
        #123b4a !important;

    font-size:
        18px !important;

    font-weight:
        900 !important;

    cursor:
        pointer;

    transition:
        var(--premium-transicion);

}


.controles-cantidad button:hover {

    transform:
        translateY(-2px);

    background:
        #dcecee !important;

    box-shadow:
        0 5px 12px rgba(18,59,74,.12);

}


/* =========================================================
   ELIMINAR PRODUCTO
   ========================================================= */

.eliminar-producto {

    width:
        40px !important;

    height:
        40px !important;

    border:
        1px solid rgba(179,38,50,.14) !important;

    border-radius:
        11px !important;

    background:
        #fff5f5 !important;

    color:
        #b32632 !important;

    cursor:
        pointer;

    transition:
        var(--premium-transicion);

}


.eliminar-producto:hover {

    transform:
        translateY(-2px);

    background:
        #ffe7e8 !important;

    border-color:
        rgba(179,38,50,.3) !important;

}


/* =========================================================
   ASISTENTE
   ========================================================= */

.asistente-boton {

    border:
        2px solid rgba(255,255,255,.8) !important;

    background:
        linear-gradient(
            135deg,
            #3159bd,
            #28479d
        ) !important;

    box-shadow:
        0 10px 28px rgba(29,58,145,.3),
        0 0 0 5px rgba(49,89,189,.08) !important;

    transition:
        var(--premium-transicion);

}


.asistente-boton:hover {

    transform:
        translateY(-4px) !important;

    box-shadow:
        0 16px 34px rgba(29,58,145,.38),
        0 0 0 7px rgba(49,89,189,.1) !important;

}


/* =========================================================
   WHATSAPP
   ========================================================= */

.whatsapp-flotante {

    width:
        62px !important;

    height:
        62px !important;

    border:
        3px solid rgba(255,255,255,.95) !important;

    box-shadow:
        0 12px 30px rgba(0,0,0,.2),
        0 0 0 5px rgba(37,211,102,.08) !important;

    transition:
        var(--premium-transicion);

}


.whatsapp-flotante:hover {

    transform:
        translateY(-5px)
        scale(1.04) !important;

    box-shadow:
        0 18px 36px rgba(0,0,0,.27),
        0 0 0 7px rgba(37,211,102,.1) !important;

}


/* =========================================================
   ENLACES / BOTONES DE NAVEGACIÓN
   ========================================================= */

nav a,
.nav a {

    position:
        relative;

    border-radius:
        10px;

    transition:
        var(--premium-transicion);

}


nav a:hover,
.nav a:hover {

    transform:
        translateY(-2px);

    background:
        rgba(255,255,255,.07);

}


nav a::after,
.nav a::after {

    content:
        "";

    position:
        absolute;

    left:
        50%;

    bottom:
        4px;

    width:
        0;

    height:
        2px;

    border-radius:
        5px;

    background:
        #18b9ad;

    transform:
        translateX(-50%);

    transition:
        width .22s ease;

}


nav a:hover::after,
.nav a:hover::after {

    width:
        45%;

}


/* =========================================================
   BOTONES GENÉRICOS DE TARJETAS
   ========================================================= */

.producto button:not(
    .agregar-carrito
) {

    transition:
        var(--premium-transicion);

}


/* =========================================================
   DISPOSITIVOS TÁCTILES
   ========================================================= */

@media (hover: none) {

    .boton-carrito:hover,
    .boton-entrar:hover,
    .agregar-carrito:hover,
    .carrito-flotante:hover,
    .whatsapp-flotante:hover,
    .finalizar-compra:hover {

        transform:
            none;

    }

}


/* =========================================================
   TABLET
   ========================================================= */

@media (max-width: 900px) {

    .boton-entrar {

        min-width:
            115px;

    }


    .boton-carrito {

        min-width:
            145px;

    }


    #boton-idioma {

        min-width:
            165px !important;

    }

}


/* =========================================================
   TELÉFONO
   ========================================================= */

@media (max-width: 600px) {

    .boton-entrar {

        min-width:
            105px;

        height:
            47px;

        padding:
            0 13px !important;

        font-size:
            13px !important;

    }


    .boton-carrito {

        min-width:
            135px;

        height:
            48px;

        padding:
            0 13px !important;

        font-size:
            13px !important;

    }


    #boton-idioma {

        min-width:
            155px !important;

        width:
            155px !important;

        height:
            47px !important;

        font-size:
            13px !important;

    }


    .agregar-carrito {

        min-height:
            52px;

        font-size:
            14px !important;

    }


    .finalizar-compra {

        min-height:
            57px !important;

        font-size:
            15px !important;

    }


    .carrito-flotante {

        width:
            59px !important;

        height:
            59px !important;

        right:
            15px !important;

        bottom:
            15px !important;

    }


    .whatsapp-flotante {

        width:
            57px !important;

        height:
            57px !important;

    }

}


/* =========================================================
   TELÉFONOS PEQUEÑOS
   ========================================================= */

@media (max-width: 400px) {

    .boton-entrar {

        min-width:
            95px;

        font-size:
            12px !important;

    }


    .boton-carrito {

        min-width:
            125px;

        font-size:
            12px !important;

    }


    #boton-idioma {

        min-width:
            145px !important;

        width:
            145px !important;

    }

}