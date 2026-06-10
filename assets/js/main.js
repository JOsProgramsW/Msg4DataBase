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
const vistaRelations = document.getElementById('vista-relations'); 

const btnStart = document.getElementById('btn-start');
const formLogin = document.getElementById('form-login');
const btnIrEnciclopedia = document.getElementById('btn-ir-enciclopedia');
const btnVolverMenu = document.getElementById('btn-volver-menu');
const btnIrTimeline = document.getElementById('btn-ir-timeline');
const btnTimelineVolver = document.getElementById('btn-timeline-volver');
const btnIrRelations = document.getElementById('btn-ir-relations'); 
const btnRelationsVolver = document.getElementById('btn-relations-volver'); 

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

const vistaPublicar = document.getElementById('vista-publicar');
const btnIrPublicar = document.getElementById('btn-ir-publicar'); // Suponiendo que pones este botón en tu vistaMenu
const btnPublicarVolver = document.getElementById('btn-publicar-volver');
const formPublicar = document.getElementById('form-publicar-articulo');

// Control cronológico de la vista de relaciones (Inicia en hito 0: Año 1922)
let indiceCronologicoRelaciones = 0;

// BASES DE DATOS (MGS4 ARCHIVES & SOP TIMELINE)
const baseDatosMGS4 = {
    "naked-snake": {   
        titulo: "Naked Snake",
        categoria: "people",
        imagen: "./assets/img/art-sop.png",
        descripcion: "Agente operativo de FOX y protagonista de la Operación Snake Eater."
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
//================================
// MÓDULO 1: ENCICLOPEDIA DINÁMICA
function registrarEnHistorial(slug, titulo) {
    let historial = JSON.parse(localStorage.getItem('mgs4_historial')) || [];
    historial = historial.filter(item => item.slug !== slug);
    historial.unshift({ 
        slug: slug, 
        titulo: titulo, 
        fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    });
    if (historial.length > 10) historial.pop();
    localStorage.setItem('mgs4_historial', JSON.stringify(historial));
}

function alternarFavorito(slug, titulo) {
    let favoritos = JSON.parse(localStorage.getItem('mgs4_favoritos')) || [];
    const existe = favoritos.some(item => item.slug === slug);

    if (existe) {
        favoritos = favoritos.filter(item => item.slug !== slug);
    } else {
        favoritos.push({ slug: slug, titulo: titulo });
    }
    localStorage.setItem('mgs4_favoritos', JSON.stringify(favoritos));
    return !existe;
}

// ==========================================================================
// MÓDULO 1: ENCICLOPEDIA DINÁMICA & CONSUMO DE INTEGRACIÓN CON API.JS
// ==========================================================================

async function filtrarYMostrarArticulos(categoria) {
    if (!elListaArticulosDinamica) return;
    elListaArticulosDinamica.innerHTML = "";

    if (elTextoEstado) {
        elTextoEstado.textContent = categoria === 'all' ? "Display all entries" : `Display entries in [${categoria.toUpperCase()}]`;
    }

    if (categoria === 'historial' || categoria === 'favoritos') {
        mostrarSeccionEspecial(categoria);
        return;
    }

    let articulosParaRenderizar = [];

    try {
        // 🟢 SOLUCIÓN SQA: Se integra api.js eliminando el fetch manual a API_URL
        const articulosAPI = await api.obtenerArticulos(); 
        
        articulosParaRenderizar = articulosAPI.map(art => ({
            id: art.slug || art.idArt,
            titulo: art.titulo,
            categoria: art.categoria
        }));
        
    } catch (err) {
        console.warn("[SOP RECOVERY]: Servidor inaccesible para listado global. Cargando catálogo local.", err);
        articulosParaRenderizar = Object.entries(baseDatosUnificada).map(([llaveId, datos]) => ({
            id: llaveId,
            titulo: datos.titulo,
            categoria: datos.categoria
        }));
    }

    articulosParaRenderizar.forEach(articulo => {
        const catArticulo = articulo.categoria.toLowerCase();
        const catFiltro = categoria.toLowerCase();
        let esCoincidencia = false;

        if (catFiltro === 'all') esCoincidencia = true;
        else if (catFiltro === 'people' && ['people', 'personajes', 'personaje'].includes(catArticulo)) esCoincidencia = true;
        else if (catFiltro === 'events' && ['eventos', 'events', 'historico'].includes(catArticulo)) esCoincidencia = true;
        else if (catFiltro === 'organizations' && ['organizations', 'organizaciones', 'organizacion'].includes(catArticulo)) esCoincidencia = true;
        else if (catFiltro === 'science' && ['science', 'ciencia', 'tecnologia'].includes(catArticulo)) esCoincidencia = true;
        else if (catFiltro === 'military' && ['military', 'militar', 'armas'].includes(catArticulo)) esCoincidencia = true;
        else if (catFiltro === 'locations' && ['locations', 'lugares', 'ubicaciones'].includes(catArticulo)) esCoincidencia = true;
        else if (catFiltro === 'other' && ['other', 'otros', ''].includes(catArticulo)) esCoincidencia = true;
        else if (catArticulo === catFiltro) esCoincidencia = true;

        if (esCoincidencia) {
            const li = document.createElement('li');
            li.className = 'articulo-item';
            li.setAttribute('data-id', articulo.id);
            li.textContent = articulo.titulo.split(" (")[0]; 

            li.addEventListener('click', () => {
                document.querySelectorAll('.articulo-item').forEach(i => i.classList.remove('activo-mgs'));
                li.classList.add('activo-mgs');
                
                registrarEnHistorial(articulo.id, articulo.titulo);
                cargarContenidoVisorDesdeServidor(articulo.id);
            });
            elListaArticulosDinamica.appendChild(li);
        }
    });

    const primerArticulo = elListaArticulosDinamica.querySelector('.articulo-item');
    if (primerArticulo) {
        primerArticulo.classList.add('activo-mgs');
        const defaultSlug = primerArticulo.getAttribute('data-id');
        const defaultTitulo = primerArticulo.textContent;
        registrarEnHistorial(defaultSlug, defaultTitulo);
        cargarContenidoVisorDesdeServidor(defaultSlug);
    } else {
        limpiarVisor();
    }
}

async function cargarContenidoVisorDesdeServidor(slug) {
    if (elArticuloTitulo && elArticuloDescripcion) {
        elArticuloTitulo.textContent = "ACCEDIENDO...";
        elArticuloDescripcion.textContent = "ESTABLECIENDO CONEXIÓN SEGURA CON LA RED PATRIOTS / TRANSMITIENDO CÓDEC...";
    }

    try {
        const articuloAPI = await api.obtenerArticuloPorSlug(slug);
        
        if (elArticuloTitulo && elArticuloImagen && elArticuloDescripcion) {
            elArticuloTitulo.textContent = articuloAPI.titulo;
            elArticuloDescripcion.textContent = `${articuloAPI.resumen} ${articuloAPI.contenido || ""}`;
            
            if (articuloAPI.artImagenes && articuloAPI.artImagenes.length > 0) {
                const imgPrincipal = articuloAPI.artImagenes.find(img => img.esPrincipal) || articuloAPI.artImagenes[0];
                
                // 🟢 SQA SANITIZACIÓN: Nos aseguramos de obtener la RAÍZ limpia del servidor (sin el '/api')
                let raizServidor = api.API_BASE_URL;
                if (raizServidor.endsWith('/api')) {
                    raizServidor = raizServidor.replace('/api', '');
                }
                
                // Limpiamos barras duplicadas por si acaso
                let rutaImagen = imgPrincipal.urlImg;
                if (rutaImagen.startsWith('/') && raizServidor.endsWith('/')) {
                    rutaImagen = rutaImagen.substring(1);
                }

                // Asignamos la URL limpia reconstruida
                elArticuloImagen.src = `${raizServidor}${rutaImagen}`;
                console.log("[SOP RENDER] Intentando cargar imagen desde:", elArticuloImagen.src);
            } else {
                // Fallback a un placeholder genérico de internet si el tuyo local falla
                elArticuloImagen.src = "https://placehold.co/600x400?text=Sin+Imagen";
            }
                
            elArticuloImagen.alt = articuloAPI.titulo;
        }
    } catch (err) {
        console.error("[SOP VISOR ERROR]:", err);
        if (elArticuloTitulo && elArticuloImagen && elArticuloDescripcion) {
            elArticuloTitulo.textContent = "ERROR DE CARGA";
            elArticuloImagen.src = "https://placehold.co/600x400?text=Error+Conexion";
            elArticuloImagen.alt = "Error de conexión";
            elArticuloDescripcion.textContent = "No se logró establecer la sincronización de datos.";
        }
    }
}
function mostrarSeccionEspecial(tipo) {
    let datos = [];
    if (tipo === 'historial') {
        datos = JSON.parse(localStorage.getItem('mgs4_historial')) || [];
    } else if (tipo === 'favoritos') {
        datos = JSON.parse(localStorage.getItem('mgs4_favoritos')) || [];
    }

    if (datos.length === 0) {
        elListaArticulosDinamica.innerHTML = `<li class="vacio-mgs" style="color:#7c7c7c; padding:10px; font-family:monospace;">SOP: NO HAY REGISTROS EN [${tipo.toUpperCase()}]</li>`;
        limpiarVisor();
        return;
    }

    datos.forEach(item => {
        const li = document.createElement('li');
        li.className = "articulo-item";
        li.innerHTML = tipo === 'historial' 
            ? `<span>${item.titulo}</span> <small style="float:right; color:#00ff00;">${item.fecha}</small>` 
            : `<span>${item.titulo}</span>`;
            
        li.addEventListener('click', () => {
            document.querySelectorAll('.articulo-item').forEach(i => i.classList.remove('activo-mgs'));
            li.classList.add('activo-mgs');
            cargarContenidoVisorDesdeServidor(item.slug);
        });
        elListaArticulosDinamica.appendChild(li);
    });

    const primerItem = elListaArticulosDinamica.querySelector('.articulo-item');
    if (primerItem) primerItem.click();
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

function inicializarFormularioPublicar() {
    const formulario = document.getElementById("form-publicar-articulo");

    if (!formulario) {
        console.warn("SOP SYSTEM: El formulario de publicación no está activo en el DOM actual.");
        return; 
    }

    formulario.removeEventListener("submit", manejarEnvioArticulo);
    formulario.addEventListener("submit", manejarEnvioArticulo);
}

// 🟩 REEMPLAZA TODA LA FUNCIÓN MANEJADORA POR ESTA VERSIÓN:
async function manejarEnvioArticulo(event) {

console.log("===> SOP SYSTEM: EVENTO SUBMIT CAPTURADO CON ÉXITO ===");
    event.preventDefault(); // Detiene la recarga de la página de forma inmediata

    // Mapeo estricto con Mayúsculas para la coincidencia con el Modelo de C#
    const articuloData = {
        Titulo: document.querySelector('input[placeholder="Ej: Metal Gear SOLID"]')?.value.trim() || document.getElementById('input-pub-titulo')?.value.trim(),
        Slug: document.querySelector('input[placeholder="Ej: metal-gear-solid"]')?.value.trim().toLowerCase() || document.getElementById('input-pub-slug')?.value.trim().toLowerCase(),
        Categoria: document.querySelector('#form-publicar-articulo select')?.value || document.getElementById('select-pub-categoria')?.value,
        Resumen: document.querySelector('input[placeholder="Breve introducción..."]')?.value.trim() || document.getElementById('input-pub-resumen')?.value.trim(),
        Contenido: document.querySelector('textarea')?.value.trim() || document.getElementById('textarea-pub-contenido')?.value.trim()
    };

    // Control de Calidad en el Cliente
    if (!articuloData.Titulo || !articuloData.Slug || !articuloData.Contenido) {
        alert("SOP ERROR: Los campos Título, Slug y Contenido Completo son obligatorios.");
        return; 
    }

    // Parámetros mandatorios para el Historial de Moderación en tu base de datos
    const idUser = 4; 
    const motivo = "Creación inicial de artículo SOP";

    // Ubicamos el botón de submit para prevenir clicks dobles accidentales
    const botonEnviar = document.getElementById("btn-enviar-articulo") || document.querySelector(".btn-submit-mgs");
    if (botonEnviar) botonEnviar.disabled = true;

    try {
        console.log("SOP: Iniciando transmisión de propuesta asíncrona mediante api.js...");
        
        // Invocamos el método corregido de tu api.js pasándole los 3 argumentos requeridos
const data = await api.publicarArticulo(articuloData, idUser, motivo);
        
        console.log("Respuesta central del sistema SOP:", data);

        const selectorImagen = document.getElementById('input-pub-imagen');

        if (selectorImagen && selectorImagen.files.length > 0) {
            console.log("SOP: Recurso multimedia detectado. Esperando consolidación de base de datos...");
            const archivoFisico = selectorImagen.files[0];

            // 🟢 SQA FIX: Retrasamos la ejecución 500ms para evitar la colisión de Llave Foránea en SQL Server
            await new Promise(resolve => setTimeout(resolve, 500));

            console.log("SOP: Iniciando transmisión binaria de la imagen...");
            // Invocamos el método de api.js pasándole el ticketId devuelto por C#
            const dataImagen = await api.subirImagenArticulo(data.ticketId, archivoFisico);
            console.log("Respuesta central del sistema SOP (Imagen):", dataImagen);
        }
        alert(`SOP SUCCESS: ${data.mensaje || "Operación transmitida con éxito a la base de datos."}`);
        
        // Limpiamos el formulario tras la persistencia exitosa
        document.getElementById("form-publicar-articulo").reset();

        // Regresar automáticamente al menú táctico si existe el botón de retorno
        if (typeof btnPublicarVolver !== 'undefined' && btnPublicarVolver) {
            btnPublicarVolver.click();
        }
    } catch (error) {
        console.error("FALLO EN LA RED NEURAL SOP:", error);
        alert(`SOP CRITICAL ERROR: ${error.message}`);
    } finally {
        // Reactivamos el botón pase lo que pase
        if (botonEnviar) botonEnviar.disabled = false;
    }
}

// ==========================================================================
// MÓDULO 2: LÍNEA DE TIEMPO (TIMELINE)
// ==========================================================================
async function cargarTimelineDinamico() {
    if (!elListaNodosCronologicos) return;
    elListaNodosCronologicos.innerHTML = "";

    try {

        const registrosAPI = await api.obtenerCronologia();

        registrosAPI.forEach(evento => {
            const li = document.createElement('li');
            li.className = 'nodo-tiempo-item';
            li.setAttribute('data-ano', evento.anio);
            li.innerHTML = `
                <div class="nodo-indicador"></div>
                <div class="nodo-meta">
                    <span class="nodo-ano">${evento.anio}</span>
                    <span class="nodo-evento-titulo">${evento.tituloCorto}</span>
                </div>
            `;

            li.addEventListener('click', () => {
                document.querySelectorAll('.nodo-tiempo-item').forEach(n => n.classList.remove('activo-nodo'));
                li.classList.add('activo-nodo');
                elTimelineTitulo.textContent = evento.tituloCorto.toUpperCase();
                elTimelineFecha.textContent = `AÑO: ${evento.anio}`;
                elTimelineDescripcion.textContent = evento.desc;
                elTimelineImagen.src = evento.imagen || "./assets/img/placeholder-art.png";
                if (elTextoEstadoTimeline) elTextoEstadoTimeline.textContent = `Displaying historical archive for the year [${evento.anio}].`;
            });
            elListaNodosCronologicos.appendChild(li);
        });

        const primerNodo = elListaNodosCronologicos.querySelector('.nodo-tiempo-item');
        if (primerNodo) primerNodo.click();

    } catch (error) {
        console.warn("[SOP CRITICAL TIMELINE]: Servidor inaccesible. Cargando línea de tiempo estática.", error);
        elListaNodosCronologicos.innerHTML = "";
        
        Object.entries(baseDatosTimeline).forEach(([ano, datos]) => {
            const li = document.createElement('li');
            li.className = 'nodo-tiempo-item';
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
                elTimelineTitulo.textContent = datos.titulo;
                elTimelineImagen.src = datos.imagen;
                elTimelineFecha.textContent = datos.fecha;
                elTimelineDescripcion.textContent = datos.descripcion;
            });
            elListaNodosCronologicos.appendChild(li);
        });
        
        const primerNodoLocal = elListaNodosCronologicos.querySelector('.nodo-tiempo-item');
        if (primerNodoLocal) primerNodoLocal.click();
    }
}

// ==========================================================================
// MÓDULO 3: MAPA DE RELACIONES INTERACTIVO (GRAFO)
// ==========================================================================
async function actualizarMapaRelaciones() {
    if (!elTableroRelacionesGrid || !elRelationsMarcadorAnio) return;
    elTableroRelacionesGrid.innerHTML = `<div style="color:#7c7c7c; padding:20px; font-family:monospace; text-align:center; width:100%;">MAPEANDO CONEXIONES RED PATRIOTS...</div>`;

    try {
        // 🟢 SOLUCIÓN SQA: Se integra api.js llamando a obtenerRelaciones()
        const datosGrafo = await api.obtenerRelaciones();

        if (!datosGrafo || !datosGrafo.nodes || datosGrafo.nodes.length === 0) {
            elTableroRelacionesGrid.innerHTML = `<div style="color:#ff3333; padding:20px;">SISTEMA DE RELACIONES SIN NODOS ACTIVOS</div>`;
            return;
        }

        elTableroRelacionesGrid.innerHTML = "";
        const nodoPrincipal = datosGrafo.nodes[0];
        elRelationsMarcadorAnio.textContent = `SOP GRAPH LAYER: UNIDAD [${nodoPrincipal.categoria.toUpperCase()}]`;

        const totalNodos = datosGrafo.nodes.length;
        const radioX = 180; 
        const radioY = 110; 
        const centroX = 275; 
        const centroY = 160;

        datosGrafo.nodes.forEach((nodo, index) => {
            let posX = centroX;
            let posY = centroY;
            if (totalNodos > 1) {
                const angulo = (index * 2 * Math.PI) / totalNodos;
                posX = centroX + radioX * Math.cos(angulo);
                posY = centroY + radioY * Math.sin(angulo);
            }

            const divNodo = document.createElement('div');
            divNodo.className = 'nodo-personaje-dinamico';
            divNodo.style.left = `${posX}px`;
            divNodo.style.top = `${posY}px`;
            
            const imagenAsignada = baseDatosMGS4[nodo.slug]?.imagen || "./assets/img/placeholder-art.png";

            divNodo.innerHTML = `
                <div class="avatar-marco-tactico">
                    <img src="${imagenAsignada}" alt="${nodo.label}">
                </div>
                <div class="nodo-identificador">${nodo.label.toUpperCase()}</div>
            `;

            divNodo.addEventListener('click', async () => {
                document.querySelectorAll('.nodo-personaje-dinamico').forEach(n => n.classList.remove('activo-nodo-neural'));
                divNodo.classList.add('activo-nodo-neural');
                
                const conexionAsociada = datosGrafo.edges.find(e => e.origen === nodo.id);
                let detalleConexionHTML = "";
                
                if (conexionAsociada) {
                    const nodoDestino = datosGrafo.nodes.find(n => n.id === conexionAsociada.destino);
                    detalleConexionHTML = `<br><br><strong>VÍNCULO DETECTADO:</strong> Relación de tipo [${conexionAsociada.tipo}] con objetivo en: ${nodoDestino ? nodoDestino.label : 'ID ' + conexionAsociada.destino}.`;
                }

                try {
                    // 🟢 SOLUCIÓN SQA: Se integra api.js para reutilizar la consulta del nodo específico
                    const artData = await api.obtenerArticuloPorSlug(nodo.slug);
                    if (elRelacionesFichaTitulo && elRelacionesFichaTexto && elRelacionesFichaImg) {
                        elRelacionesFichaTitulo.textContent = artData.titulo;
                        elRelacionesFichaTexto.innerHTML = `${artData.resumen}${detalleConexionHTML}`;
                        elRelacionesFichaImg.src = imagenAsignada;
                    }
                } catch {
                    if (elRelacionesFichaTitulo && elRelacionesFichaTexto && elRelacionesFichaImg) {
                        elRelacionesFichaTitulo.textContent = nodo.label;
                        elRelacionesFichaTexto.innerHTML = `Identificador de sistema SOP asignado con ID ${nodo.id}. Categoría: ${nodo.categoria}.${detalleConexionHTML}`;
                        elRelacionesFichaImg.src = imagenAsignada;
                    }
                }
            });
            elTableroRelacionesGrid.appendChild(divNodo);
        });

        const primerNodoDOM = elTableroRelacionesGrid.querySelector('.nodo-personaje-dinamico');
        if (primerNodoDOM) primerNodoDOM.click();

    } catch (falla) {
        console.error("[SOP GRAFO COMPONENT FAIL]:", falla);
        elTableroRelacionesGrid.innerHTML = "";
        
        const divNodoLocal = document.createElement('div');
        divNodoLocal.className = 'nodo-personaje-dinamico';
        divNodoLocal.style.left = `275px`;
        divNodoLocal.style.top = `160px`;
        divNodoLocal.innerHTML = `
            <div class="avatar-marco-tactico">
                <img src="./assets/img/placeholder-art.png" alt="Naked Snake">
            </div>
            <div class="nodo-identificador">NAKED SNAKE (LOCAL)</div>
        `;
        elTableroRelacionesGrid.appendChild(divNodoLocal);
    }
}
// ==========================================================================
// CONTROLADORES DE PANTALLAS (TRANSICIONES)
// ==========================================================================

if (btnStart) {
    btnStart.addEventListener('click', () => {
        vistaInicio.classList.replace('activa', 'oculta');
        vistaLogin.classList.replace('oculta', 'activa');
        history.pushState({ pantalla: 'login' }, '', '#login');
    });
}

if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        vistaLogin.classList.replace('activa', 'oculta');
        vistaMenu.classList.replace('oculta', 'activa');
        history.pushState({ pantalla: 'menu' }, '', '#menu');
    });
}

if (btnIrEnciclopedia) {
    btnIrEnciclopedia.addEventListener('click', () => {
        vistaMenu.classList.replace('activa', 'oculta');
        vistaEnciclopedia.classList.replace('oculta', 'activa');
        filtrarYMostrarArticulos('all');
        history.pushState({ pantalla: 'enciclopedia' }, '', '#enciclopedia');
    });
}

if (btnVolverMenu) {
    btnVolverMenu.addEventListener('click', () => {
        vistaEnciclopedia.classList.replace('activa', 'oculta');
        vistaMenu.classList.replace('oculta', 'activa');
        history.pushState({ pantalla: 'menu' }, '', '#menu');
    });
}

if (btnIrTimeline) {
    btnIrTimeline.addEventListener('click', () => {
        vistaMenu.classList.replace('activa', 'oculta');
        vistaTimeline.classList.replace('oculta', 'activa');
        cargarTimelineDinamico();
        history.pushState({ pantalla: 'timeline' }, '', '#timeline');
    });
}

if (btnTimelineVolver) {
    btnTimelineVolver.addEventListener('click', () => {
        vistaTimeline.classList.replace('activa', 'oculta');
        vistaMenu.classList.replace('oculta', 'activa');
        history.pushState({ pantalla: 'menu' }, '', '#menu');
    });
}

if (btnIrRelations) {
    btnIrRelations.addEventListener('click', () => {
        vistaMenu.classList.replace('activa', 'oculta');
        vistaRelations.classList.replace('oculta', 'activa');
        actualizarMapaRelaciones();
        history.pushState({ pantalla: 'relations' }, '', '#relations');
    });
}

if (btnRelationsVolver) {
    btnRelationsVolver.addEventListener('click', () => {
        vistaRelations.classList.replace('activa', 'oculta');
        vistaMenu.classList.replace('oculta', 'activa');
        history.pushState({ pantalla: 'menu' }, '', '#menu');
    });
}

if (btnIrPublicar) {
    btnIrPublicar.addEventListener('click', () => {
        vistaMenu.classList.replace('activa', 'oculta');
        vistaPublicar.classList.replace('oculta', 'activa');
        inicializarFormularioPublicar();
        history.pushState({ pantalla: 'publicar' }, '', '#publicar');
    });
}

if (btnPublicarVolver) {
    btnPublicarVolver.addEventListener('click', () => {
        vistaPublicar.classList.replace('activa', 'oculta');
        vistaMenu.classList.replace('oculta', 'activa');
        history.pushState({ pantalla: 'menu' }, '', '#menu');
    });
}
// ==========================================================================
// GESTOR DE HISTORIAL INTEGRAL (POPSTATE)
// ==========================================================================


window.addEventListener('popstate', (evento) => {
    const todasLasPantallas = [vistaInicio, vistaLogin, vistaMenu, vistaEnciclopedia, vistaTimeline, vistaRelations, vistaPublicar];
    
    todasLasPantallas.forEach(p => { 
        if(p) { 
            p.classList.remove('activa'); 
            p.classList.add('oculta'); 
        } 
    });

    const pantallaDestino = evento.state?.pantalla;

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
        vistaInicio.classList.remove('oculta'); vistaInicio.classList.add('activa');
    } else if (pantallaDestino === 'publicar' && vistaPublicar) {
        vistaPublicar.classList.remove('oculta'); vistaPublicar.classList.add('activa');
    } else if (vistaInicio) {
        vistaInicio.classList.remove('oculta'); vistaInicio.classList.add('activa');

        
    }
});
window.addEventListener('DOMContentLoaded', () => {
    if (!history.state) {
        history.replaceState({ pantalla: 'inicio' }, '', '#inicio');
    }
});