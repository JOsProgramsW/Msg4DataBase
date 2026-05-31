//es el que maneja las transiciones entre pantallas y la logica de navegacion, ademas de cargar los datos necesarios para cada pantalla y renderizarlos
// ==========================================================================
// CONTROLADOR DE TRANSICIONES, HISTORIAL Y ENCICLOPEDIA DINÁMICA MGS4
// ==========================================================================

// 1. Captura de Pantallas (Secciones del HTML)
const vistaInicio = document.getElementById('vista-inicio');
const vistaLogin = document.getElementById('vista-login');
const vistaMenu = document.getElementById('vista-menu');
const vistaEnciclopedia = document.getElementById('vista-enciclopedia');
const vistaTimeline = document.getElementById('vista-timeline');
const vistaRelations = document.getElementById('vista-relations'); // CORREGIDO: Declaración faltante

const btnStart = document.getElementById('btn-start');
const formLogin = document.getElementById('form-login');
const btnIrEnciclopedia = document.getElementById('btn-ir-enciclopedia');
const btnVolverMenu = document.getElementById('btn-volver-menu');
const btnIrTimeline = document.getElementById('btn-ir-timeline');
const btnTimelineVolver = document.getElementById('btn-timeline-volver');
const btnIrRelations = document.getElementById('btn-ir-relations'); // CORREGIDO: Declaración faltante
const btnRelationsVolver = document.getElementById('btn-relations-volver'); // CORREGIDO: Botón de salida para Relations

const elArticuloTitulo = document.getElementById('articulo-titulo');
const elArticuloImagen = document.getElementById('articulo-imagen');
const elArticuloDescripcion = document.getElementById('articulo-descripcion');

const elListaArticulosDinamica = document.getElementById('lista-dinamica-articulos');
const elTextoEstado = document.getElementById('texto-estado-subpantalla');
const itemsCategorias = document.querySelectorAll('.categoria-item');

const elTimelineTitulo = document.getElementById('timeline-titulo');
const elTimelineImagen = document.getElementById('timeline-imagen');
const elTimelineFecha = document.getElementById('timeline-fecha');
const elTimelineDescripcion = document.getElementById('timeline-descripcion');
const elListaNodosCronologicos = document.getElementById('lista-nodos-cronologicos');
const elTextoEstadoTimeline = document.getElementById('texto-estado-timeline');

const elTableroRelacionesGrid = document.querySelector('.tablero-relaciones-grid');
const elRelationsMarcadorAnio = document.getElementById('relations-marcador-anio');
const btnRelationsPrev = document.getElementById('btn-relations-prev');
const btnRelationsNext = document.getElementById('btn-relations-next');

const elRelacionesFichaImg = document.getElementById('relaciones-ficha-img');
const elRelacionesFichaTitulo = document.getElementById('relaciones-ficha-titulo');
const elRelacionesFichaTexto = document.getElementById('relaciones-ficha-texto');

// Control cronológico de la vista de relaciones (Inicia en hito 0: Año 1922)
let indiceCron规律elaciones = 0; 
let indiceCronologicoRelaciones = 0;

// ==========================================================================
// BASES DE DATOS (MGS4 ARCHIVES & SOP TIMELINE)
// ==========================================================================
const baseDatosMGS4 = {
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
    "the-patriots": {
        titulo: "The Patriots",
        categoria: "organizations",
        imagen: "./assets/img/art-patriots.png",
        descripcion: "Una organización clandestina y masiva fundada originalmente por la red de Cipher (Mayor Zero) para controlar los aspectos políticos, económicos y sociales de los Estados Unidos. En 2014, la organización ha evolucionado hacia una infraestructura descentralizada gobernada completamente por una red de Inteligencias Artificiales."
    },
    "nanomashines": {
        titulo: "Nanomines / Nanomáquinas",
        categoria: "science",
        imagen: "./assets/img/art-nanomachines.png",
        descripcion: "Dispositivos microscópicos inyectados directamente en el torrente sanguíneo de los soldados modernos. En la generación actual (Generación 3), forman el pilar central del sistema SOP, permitiendo el monitoreo metabólico, la supresión del dolor y el estrés, y el bloqueo informático del armamento no autorizado."
    },
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
    "shadow-moses-incident": {
        titulo: "Shadow Moses Incident (2005)",
        categoria: "events",
        imagen: "./assets/img/art-shadow-moses.png",
        descripcion: "La crisis ocurrida en la isla de Shadow Moses, Alaska, donde la unidad FOXHOUND se rebeló contra el gobierno de los EE. UU. exigiendo los restos de Big Boss. El incidente expuso al mundo el desarrollo ilegal del Metal Gear REX y marcó el inicio del tráfico masivo de tecnología Metal Gear en el mercado negro."
    },
    "shadow-moses-island": {
        titulo: "Shadow Moses Island",
        categoria: "locations",
        imagen: "./assets/img/art-island.png",
        descripcion: "Un archipiélago fortificado y aislado situado en Alaska, utilizado originalmente como una instalación secreta de almacenamiento y desmantelamiento de armas nucleares. Nueve años después de la crisis, Old Snake regresa a este gélido complejo industrial abandonado en el Acto 4 para recuperar el Railgun de REX."
    }
};

const baseDatosTimeline = {
    "1964": {
        titulo: "Snake Eater Incident",
        fecha: "AÑO: 1964 (Guerra Fría)",
        imagen: "./assets/img/time-64.png",
        descripcion: "Durante la crisis de los misiles, Naked Snake es desplegado en las selvas de Tselinoyarsk con la misión de rescatar al científico Nikolai Sokolov y eliminar a su mentora, The Boss, quien desertó a la Unión Soviética. Tras completar la misión con éxito, recibe el título de Big Boss, sembrando el origen ideológico de todo el conflicto del siglo XXI."
    },
    "1970": {
        titulo: "San Hieronymo Takeover",
        fecha: "AÑO: 1970 (Península de San Hieronymo)",
        imagen: "./assets/img/time-70.png",
        descripcion: "La unidad FOX renegada toma control de un silo de misiles soviéticos en Colombia. Big Boss, capturado en la base, une fuerzas con Roy Campbell para organizar una resistencia. Este incidente marca la disolución formal de FOX y sienta los cimientos financieros para la creación de la red Cipher junto al Mayor Zero."
    },
    "2005": {
        titulo: "Shadow Moses Incident",
        fecha: "AÑO: 2005 (Crisis Nuclear en Alaska)",
        imagen: "./assets/img/art-shadow-moses.png",
        descripcion: "La unidad de fuerzas especiales FOXHOUND de nueva generación, liderada por Liquid Snake, se apodera de la isla de Shadow Moses y del prototipo Metal Gear REX. Exigen la entrega de las células genéticas de Big Boss. Solid Snake es sacado del retiro para infiltrarse y neutralizar la amenaza terrorista."
    },
    "2014": {
        titulo: "Guns of the Patriots Crisis",
        fecha: "AÑO: 2014 (Economía de Guerra Mundial)",
        imagen: "./assets/img/art-sop.png",
        descripcion: "El sistema SOP regula por completo los campos de batalla a través de nanomáquinas. Liquid Ocelot ejecuta un alzamiento a escala global controlando las cinco PMCs más poderosas del planeta. Su objetivo final es secuestrar la red central de IAs de los Patriots. Old Snake inicia su última misión encubierta para detenerlo."
    }
};

const baseDatosSOP = {
    articulos: {
        the_boss: {
            id: "the_boss",
            titulo: "The Boss",
            categoria: "people",
            imagen: "./assets/img/the-boss.png",
            descripcion: "Fundadora de la Unidad Cobra y madre de las fuerzas especiales de EE.UU. Su sacrificio en 1964 alteró el curso de la historia global."
        },
        cobra_unit: {
            id: "cobra_unit",
            titulo: "Unidad Cobra",
            categoria: "organizations",
            imagen: "./assets/img/cobra-unit.png",
            descripcion: "Unidad militar legendaria formada por The Boss durante la Segunda Guerra Mundial, compuesta por soldados con habilidades sobrehumanas."
        }
    },
    timeline: [
        {
            anio: "1922",
            titulo: "Nace The Boss",
            imagen: "./assets/img/time-1922.png",
            descripcion: "Nace The Boss, hija de un miembro clave de los Filósofos.",
            personajes: ["the_boss"],
            conexiones: []
        },
        {
            anio: "1942",
            titulo: "Institución de la Unidad Cobra",
            imagen: "./assets/img/time-1942.png",
            descripcion: "The Boss establece la mítica Unidad Cobra para asegurar la victoria aliada en la Segunda Guerra Mundial.",
            personajes: ["the_boss", "cobra_unit"],
            conexiones: [{ desde: "the_boss", hacia: "cobra_unit", tipo: "Líder / Creadora" }]
        }
    ]
};

// ==========================================================================
// MÓDULO 1: ENCICLOPEDIA DINÁMICA
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
        filtrarYMostrarArticulos(cat.getAttribute('data-categoria'));
    });
});

// ==========================================================================
// MÓDULO 2: LÍNEA DE TIEMPO (TIMELINE)
// ==========================================================================
function cargarTimelineDinamico() {
    if (!elListaNodosCronologicos) return;
    elListaNodosCronologicos.innerHTML = "";

    Object.entries(baseDatosTimeline).forEach(([ano, datos]) => {
        const li = document.createElement('li');
        li.className = 'nodo-tiempo-item';
        li.setAttribute('data-ano', ano);
        li.innerHTML = `
            <div class="nodo-indicador"></div>
            <div class="nodo-meta">
                <span class="nodo-ano">${ano}</span>
                <span class="nodo-evento-titulo">${datos.titulo}</span>
            </div>
        `;

        li.addEventListener('click', () => {
            document.querySelectorAll('.nodo-tiempo-item').forEach(n => n.classList.remove('activo-nodo'));
            li.classList.add('activo-nodo');
            mostrarDetalleTimeline(ano);
        });
        elListaNodosCronologicos.appendChild(li);
    });

    const primerNodo = elListaNodosCronologicos.querySelector('.nodo-tiempo-item');
    if (primerNodo) {
        primerNodo.classList.add('activo-nodo');
        mostrarDetalleTimeline(primerNodo.getAttribute('data-ano'));
    }
}

function mostrarDetalleTimeline(anoId) {
    const datos = baseDatosTimeline[anoId];
    if (datos && elTimelineTitulo && elTimelineImagen && elTimelineFecha && elTimelineDescripcion) {
        elTimelineTitulo.textContent = datos.titulo;
        elTimelineImagen.src = datos.imagen;
        elTimelineImagen.alt = datos.titulo;
        elTimelineFecha.textContent = datos.fecha;
        elTimelineDescripcion.textContent = datos.descripcion;

        if (elTextoEstadoTimeline) {
            elTextoEstadoTimeline.textContent = `Displaying historical archive for the year [${anoId}].`;
        }
    }
}

// ==========================================================================
// MÓDULO 3: MAPA DE RELACIONES DINÁMICO (SOP GEOMETRÍA ELÍPTICA)
// ==========================================================================
function actualizarMapaRelaciones() {
    if (!elTableroRelacionesGrid || !elRelationsMarcadorAnio) return;
    elTableroRelacionesGrid.innerHTML = "";

    const hitoActual = baseDatosSOP.timeline[indiceCronologicoRelaciones];
    elRelationsMarcadorAnio.textContent = `SCHEMA RELAZIONI : ${hitoActual.anio}`;

    const totalPersonajes = hitoActual.personajes.length;
    const radioX = 180; 
    const radioY = 110; 
    const centroX = 275; 
    const centroY = 160;

    hitoActual.personajes.forEach((idPersonaje, index) => {
        const datosArticulo = baseDatosSOP.articulos[idPersonaje];
        if (!datosArticulo) return;

        let posX = centroX;
        let posY = centroY;
        
        if (totalPersonajes > 1) {
            const angulo = (index * 2 * Math.PI) / totalPersonajes;
            posX = centroX + radioX * Math.cos(angulo);
            posY = centroY + radioY * Math.sin(angulo);
        }

        const divNodo = document.createElement('div');
        divNodo.className = 'nodo-personaje-dinamico';
        divNodo.style.left = `${posX}px`;
        divNodo.style.top = `${posY}px`;
        divNodo.innerHTML = `
            <div class="avatar-marco-tactico">
                <img src="${datosArticulo.imagen}" alt="${datosArticulo.titulo}">
            </div>
            <div class="nodo-identificador">${datosArticulo.titulo}</div>
        `;

        divNodo.addEventListener('click', () => {
            document.querySelectorAll('.nodo-personaje-dinamico').forEach(n => n.classList.remove('activo-nodo-neural'));
            divNodo.classList.add('activo-nodo-neural');
            
            if (elRelacionesFichaTitulo && elRelacionesFichaTexto && elRelacionesFichaImg) {
                elRelacionesFichaTitulo.textContent = datosArticulo.titulo;
                elRelacionesFichaTexto.textContent = datosArticulo.descripcion;
                elRelacionesFichaImg.src = datosArticulo.imagen;
            }
        });
        elTableroRelacionesGrid.appendChild(divNodo);
    });

    if (totalPersonajes > 0) {
        const primerId = hitoActual.personajes[0];
        const datosPrimerArticulo = baseDatosSOP.articulos[primerId];
        if (datosPrimerArticulo && elRelacionesFichaTitulo && elRelacionesFichaTexto && elRelacionesFichaImg) {
            elRelacionesFichaTitulo.textContent = datosPrimerArticulo.titulo;
            elRelacionesFichaTexto.textContent = datosPrimerArticulo.descripcion;
            elRelacionesFichaImg.src = datosPrimerArticulo.imagen;

            const primerNodoDOM = elTableroRelacionesGrid.querySelector('.nodo-personaje-dinamico');
            if (primerNodoDOM) primerNodoDOM.classList.add('activo-nodo-neural');
        }
    }
}

// Controladores de avance temporal (Gatillos L1 / R1)
if (btnRelationsPrev) {
    btnRelationsPrev.addEventListener('click', () => {
        if (indiceCronologicoRelaciones > 0) {
            indiceCronologicoRelaciones--;
            actualizarMapaRelaciones();
        }
    });
}

if (btnRelationsNext) {
    btnRelationsNext.addEventListener('click', () => {
        if (indiceCronologicoRelaciones < baseDatosSOP.timeline.length - 1) {
            indiceCronologicoRelaciones++;
            actualizarMapaRelaciones();
        }
    });
}

// ==========================================================================
// MAQUINARIA DE NAVEGACIÓN (MAQUINA DE ESTADOS HASH)
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

// Asignación de Listeners de los Menús
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

if (btnIrTimeline) {
    btnIrTimeline.addEventListener('click', () => {
        cambiarPantalla(vistaMenu, vistaTimeline, 'timeline');
        cargarTimelineDinamico();
    });
}

if (btnTimelineVolver) {
    btnTimelineVolver.addEventListener('click', () => cambiarPantalla(vistaTimeline, vistaMenu, 'menu'));
}

if (btnIrRelations) {
    btnIrRelations.addEventListener('click', () => {
        cambiarPantalla(vistaMenu, vistaRelations, 'relations');
        indiceCronologicoRelaciones = 0; 
        actualizarMapaRelaciones();
    });
}

if (btnRelationsVolver) {
    btnRelationsVolver.addEventListener('click', () => cambiarPantalla(vistaRelations, vistaMenu, 'menu'));
}

// ==========================================================================
// GESTOR DE HISTORIAL INTEGRAL (POPSTATE CORREGIDO)
// ==========================================================================
window.addEventListener('popstate', (evento) => {
    const todasLasPantallas = [vistaInicio, vistaLogin, vistaMenu, vistaEnciclopedia, vistaTimeline, vistaRelations];
    
    // Apagamos todas las pantallas de forma masiva y limpia
    todasLasPantallas.forEach(p => { 
        if(p) { 
            p.classList.remove('activa'); 
            p.classList.add('oculta'); 
        } 
    });

    const pantallaDestino = evento.state?.pantalla;

    // Evaluación estricta por casos de Hash de Estado
    if (pantallaDestino === 'login' && vistaLogin) {
        vistaLogin.classList.remove('oculta'); vistaLogin.classList.add('activa');
    } else if (pantallaDestino === 'menu' && vistaMenu) {
        vistaMenu.classList.remove('oculta'); vistaMenu.classList.add('activa');
    } else if (pantallaDestino === 'enciclopedia' && vistaEnciclopedia) {
        vistaEnciclopedia.classList.remove('oculta'); vistaEnciclopedia.classList.add('activa');
        filtrarYMostrarArticulos('all');
    } else if (pantallaDestino === 'timeline' && vistaTimeline) {
        vistaTimeline.classList.remove('oculta'); vistaTimeline.classList.add('activa');
        cargarTimelineDinamico();
    } else if (pantallaDestino === 'relations' && vistaRelations) {
        vistaRelations.classList.remove('oculta'); vistaRelations.classList.add('activa');
        actualizarMapaRelaciones();
    } else if (vistaInicio) {
        // Estado por defecto (Inicio) blindado al final de la condicional
        vistaInicio.classList.remove('oculta'); vistaInicio.classList.add('activa');
    }
});

window.addEventListener('DOMContentLoaded', () => {
    if (!history.state) {
        history.replaceState({ pantalla: 'inicio' }, '', '#inicio');
    }
});