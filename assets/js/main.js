//es el que maneja las transiciones entre pantallas y la logica de navegacion, ademas de cargar los datos necesarios para cada pantalla y renderizarlos
// ==========================================================================
// CONTROLADOR DE TRANSICIONES, HISTORIAL Y ENCICLOPEDIA DINÁMICA MGS4
// ==========================================================================

// 1. Captura de Pantallas (Secciones del HTML)
const vistaInicio = document.getElementById('vista-inicio');
const vistaLogin = document.getElementById('vista-login');
const vistaMenu = document.getElementById('vista-menu');
const vistaEnciclopedia = document.getElementById('vista-enciclopedia');

const btnStart = document.getElementById('btn-start');
const formLogin = document.getElementById('form-login');
const btnIrEnciclopedia = document.getElementById('btn-ir-enciclopedia');
const btnVolverMenu = document.getElementById('btn-volver-menu');

const elArticuloTitulo = document.getElementById('articulo-titulo');
const elArticuloImagen = document.getElementById('articulo-imagen');
const elArticuloDescripcion = document.getElementById('articulo-descripcion');

const elListaArticulosDinamica = document.getElementById('lista-dinamica-articulos');
const elTextoEstado = document.getElementById('texto-estado-subpantalla');
const itemsCategorias = document.querySelectorAll('.categoria-item');

// ==========================================================================
// BASE DE DATOS EXTENDIDA CON METADATOS DE CATEGORÍA
// ==========================================================================
const baseDatosMGS4 = {
    // --- PEOPLE ---
    "solid-snake": {
        titulo: "Solid Snake (Old Snake)",
        categoria: "people",
        imagen: "./assets/img/old login.png",
        descripcion: "El legendario héroe que salvó al mundo de la amenaza de Outer Heaven, Zanzibar Land y Shadow Moses. En 2014, debido a su naturaleza como clon en el proyecto 'Les Enfants Terribles', sufre un envejecimiento celular acelerado. Ahora, bajo el nombre clave de Old Snake, se infiltra en los campos de batalla controlados por PMCs para detener a Liquid Ocelot."
    },
    "liquid-ocelot": {
        titulo: "Liquid Ocelot",
        categoria: "people",
        imagen: "./assets/img/art-ocelot.png",
        descripcion: "La fusión ideológica y física entre Revolver Ocelot y la voluntad de Liquid Snake a través de un brazo trasplantado y terapia nanomédica. Es el líder de las cinco PMCs más grandes del mundo reunidas bajo la corporación matriz Outer Heaven. Su objetivo principal es destruir el núcleo del sistema informático de los Patriots (JD) para liberar las armas mundiales."
    },

    // --- ORGANIZATIONS ---
    "the-patriots": {
        titulo: "The Patriots",
        categoria: "organizations",
        imagen: "./assets/img/art-patriots.png",
        descripcion: "Una organización clandestina y masiva fundada originalmente por la red de Cipher (Mayor Zero) para controlar los aspectos políticos, económicos y sociales de los Estados Unidos. En 2014, la organización ha evolucionado hacia una infraestructura descentralizada gobernada completamente por una red de Inteligencias Artificiales."
    },

    // --- SCIENCE ---
    "nanomashines": {
        titulo: "Nanomines / Nanomáquinas",
        categoria: "science",
        imagen: "./assets/img/art-nanomachines.png",
        descripcion: "Dispositivos microscópicos inyectados directamente en el torrente sanguíneo de los soldados modernos. En la generación actual (Generación 3), forman el pilar central del sistema SOP, permitiendo el monitoreo metabólico, la supresión del dolor y el estrés, y el bloqueo informático del armamento no autorizado."
    },

    // --- MILITARY ---
    "sop-system": {
        titulo: "SOP System",
        categoria: "military",
        imagen: "./assets/img/art-sop.png",
        descripcion: "Sons of the Patriots (Hijos de los Patriots). Un sistema informático militar masivo a nivel mundial que regula las funciones biológicas, emociones, puntería y uso de armas de todos los soldados contratados por PMCs mediante el uso estricto de nanomáquinas de última generación. Permite un control absoluto del campo de batalla."
    },
    "metal-gear-rex": {
        titulo: "Metal Gear REX",
        categoria: "military",
        imagen: "./assets/img/art-rex.png",
        descripcion: "El arma bípeda de asalto nuclear desarrollada en secreto en la isla de Shadow Moses en 2005. A diferencia de otros modelos, REX cuenta con un blindaje compuesto impenetrable y un cañón de riel (Railgun) capaz de lanzar ojivas nucleares indetectables por radar a cualquier parte del globo. Old Snake regresa por él en los acontecimientos finales."
    },

    // --- HISTORIC EVENTS ---
    "shadow-moses-incident": {
        titulo: "Shadow Moses Incident (2005)",
        categoria: "events",
        imagen: "./assets/img/art-shadow-moses.png",
        descripcion: "La crisis ocurrida en la isla de Shadow Moses, Alaska, donde la unidad FOXHOUND se rebeló contra el gobierno de los EE. UU. exigiendo los restos de Big Boss. El incidente expuso al mundo el desarrollo ilegal del Metal Gear REX y marcó el inicio del tráfico masivo de tecnología Metal Gear en el mercado negro."
    },

    // --- LOCATIONS ---
    "shadow-moses-island": {
        titulo: "Shadow Moses Island",
        categoria: "locations",
        imagen: "./assets/img/art-island.png",
        descripcion: "Un archipiélago fortificado y aislado situado en Alaska, utilizado originalmente como una instalación secreta de almacenamiento y desmantelamiento de armas nucleares. Nueve años después de la crisis, Old Snake regresa a este gélido complejo industrial abandonado en el Acto 4 para recuperar el Railgun de REX."
    }
};

// ==========================================================================
// NÚCLEO DE RENDERIZADO DE ENCICLOPEDIA DINÁMICA
// ==========================================================================

function filtrarYMostrarArticulos(categoria) {
    if (!elListaArticulosDinamica) return;

    elListaArticulosDinamica.innerHTML = "";

    if (elTextoEstado) {
        elTextoEstado.textContent = categoria === 'all' ? "Display all entries" : `Display entries in [${categoria.toUpperCase()}]`;
    }

    Object.entries(baseDatosMGS4).forEach(([llaveId, datos]) => {
        if (categoria === 'all' || datos.categoria === categoria) {
            const li = document.createElement('li');
            li.className = 'articulo-item';
            li.setAttribute('data-id', llaveId);
            li.textContent = datos.titulo.split(" (")[0]; 

            li.addEventListener('click', () => {
                document.querySelectorAll('.articulo-item').forEach(i => i.classList.remove('activo-mgs'));
                li.classList.add('activo-mgs');
                cargarContenidoVisor(llaveId);
            });

            elListaArticulosDinamica.appendChild(li);
        }
    });

    const primerArticulo = elListaArticulosDinamica.querySelector('.articulo-item');
    if (primerArticulo) {
        primerArticulo.classList.add('activo-mgs');
        cargarContenidoVisor(primerArticulo.getAttribute('data-id'));
    } else {
        limpiarVisor();
    }
}

function cargarContenidoVisor(idArticulo) {
    const datos = baseDatosMGS4[idArticulo];
    if (datos && elArticuloTitulo && elArticuloImagen && elArticuloDescripcion) {
        elArticuloTitulo.textContent = datos.titulo;
        elArticuloImagen.src = datos.imagen;
        elArticuloImagen.alt = datos.titulo;
        elArticuloDescripcion.textContent = datos.descripcion;
    }
}

function limpiarVisor() {
    if(elArticuloTitulo) elArticuloTitulo.textContent = "VACÍO";
    if(elArticuloDescripcion) elArticuloDescripcion.textContent = "No hay registros cargados en esta base de datos táctica.";
    if(elArticuloImagen) elArticuloImagen.src = "./assets/img/placeholder-art.png";
}

itemsCategorias.forEach(cat => {
    cat.addEventListener('click', () => {
        itemsCategorias.forEach(c => c.classList.remove('activa-cat'));
        cat.classList.add('activa-cat');
        
        const filtro = cat.getAttribute('data-categoria');
        filtrarYMostrarArticulos(filtro);
    });
});

// ==========================================================================
// MAQUINARIA DE NAVEGACIÓN Y LOGICA INTERNA
// ==========================================================================

function cambiarPantalla(pantallaActual, pantallaSiguiente, nombreHash) {
    if (pantallaActual && pantallaSiguiente) {
        pantallaActual.classList.remove('activa');
        pantallaActual.classList.add('oculta');
        pantallaSiguiente.classList.remove('oculta');
        pantallaSiguiente.classList.add('activa');

        if (nombreHash && history.state?.pantalla !== nombreHash) {
            history.pushState({ pantalla: nombreHash }, '', `#${nombreHash}`);
        }
    }
}

if (btnStart) {
    btnStart.addEventListener('click', () => cambiarPantalla(vistaInicio, vistaLogin, 'login'));
}

if (formLogin) {
    formLogin.addEventListener('submit', (evento) => {
        evento.preventDefault();
        cambiarPantalla(vistaLogin, vistaMenu, 'menu');
    });
}

if (btnIrEnciclopedia) {
    btnIrEnciclopedia.addEventListener('click', () => {
        cambiarPantalla(vistaMenu, vistaEnciclopedia, 'enciclopedia');
        filtrarYMostrarArticulos('all');
    });
}

if (btnVolverMenu) {
    btnVolverMenu.addEventListener('click', () => cambiarPantalla(vistaEnciclopedia, vistaMenu, 'menu'));
}

window.addEventListener('popstate', (evento) => {
    const todasLasPantallas = [vistaInicio, vistaLogin, vistaMenu, vistaEnciclopedia];
    todasLasPantallas.forEach(p => { if(p) { p.classList.remove('activa'); p.classList.add('oculta'); } });

    const pantallaDestino = evento.state?.pantalla;
    if (pantallaDestino === 'login' && vistaLogin) {
        vistaLogin.classList.remove('oculta'); vistaLogin.classList.add('activa');
    } else if (pantallaDestino === 'menu' && vistaMenu) {
        vistaMenu.classList.remove('oculta'); vistaMenu.classList.add('activa');
    } else if (pantallaDestino === 'enciclopedia' && vistaEnciclopedia) {
        vistaEnciclopedia.classList.remove('oculta'); vistaEnciclopedia.classList.add('activa');
        filtrarYMostrarArticulos('all');
    } else if (vistaInicio) {
        vistaInicio.classList.remove('oculta'); vistaInicio.classList.add('activa');
    }
});

window.addEventListener('DOMContentLoaded', () => {
    if (!history.state) {
        history.replaceState({ pantalla: 'inicio' }, '', '#inicio');
    }
});