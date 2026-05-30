//es el que maneja las transiciones entre pantallas y la logica de navegacion, ademas de cargar los datos necesarios para cada pantalla y renderizarlos
const vistaInicio = document.getElementById('vista-inicio');
const vistaLogin = document.getElementById('vista-login');
const vistaMenu = document.getElementById('vista-menu');
const vistaEnciclopedia = document.getElementById('vista-enciclopedia');

// 2. Captura de Botones de Navegación
const btnStart = document.getElementById('btn-start');
const formLogin = document.getElementById('form-login');
const btnIrEnciclopedia = document.getElementById('btn-ir-enciclopedia');

/**
 * Cambia la pantalla de forma segura comprobando que los elementos existan
 * @param {HTMLElement} pantallaActual 
 * @param {HTMLElement} pantallaSiguiente 
 * @param {string} nombreHash - El hash para la URL (#login, #menu, etc)
 */
function cambiarPantalla(pantallaActual, pantallaSiguiente, nombreHash) {
    if (pantallaActual && pantallaSiguiente) {
        // Ocultamos la actual
        pantallaActual.classList.remove('activa');
        pantallaActual.classList.add('oculta');

        // Mostramos la siguiente
        pantallaSiguiente.classList.remove('oculta');
        pantallaSiguiente.classList.add('activa');

        // Guardamos el movimiento en el historial si es necesario
        if (nombreHash && history.state?.pantalla !== nombreHash) {
            history.pushState({ pantalla: nombreHash }, '', `#${nombreHash}`);
        }
    }
}

// --------------------------------------------------------------------------
// ESCUCHADORES DE EVENTOS DE INTERFAZ (LISTENERS)
// --------------------------------------------------------------------------

// Avanzar de Inicio a Login
if (btnStart) {
    btnStart.addEventListener('click', () => {
        cambiarPantalla(vistaInicio, vistaLogin, 'login');
    });
}

// Avanzar de Login a Menú Principal
if (formLogin) {
    formLogin.addEventListener('submit', (evento) => {
        evento.preventDefault();
        cambiarPantalla(vistaLogin, vistaMenu, 'menu');
    });
}

// Avanzar de Menú Principal a Enciclopedia
if (btnIrEnciclopedia) {
    btnIrEnciclopedia.addEventListener('click', () => {
        cambiarPantalla(vistaMenu, vistaEnciclopedia, 'enciclopedia');
    });
}

// --------------------------------------------------------------------------
// CONTROL DE LAS FLECHAS DEL NAVEGADOR (BACK / FORWARD)
// --------------------------------------------------------------------------
window.addEventListener('popstate', (evento) => {
    // Apagamos visualmente todas primero para evitar amontonamientos accidentales
    const todasLasPantallas = [vistaInicio, vistaLogin, vistaMenu, vistaEnciclopedia];
    todasLasPantallas.forEach(p => {
        if(p) { p.classList.remove('activa'); p.classList.add('oculta'); }
    });

    const pantallaDestino = evento.state?.pantalla;

    // Activamos la pantalla correspondiente según el historial
    if (pantallaDestino === 'login' && vistaLogin) {
        vistaLogin.classList.remove('oculta');
        vistaLogin.classList.add('activa');
    } else if (pantallaDestino === 'menu' && vistaMenu) {
        vistaMenu.classList.remove('oculta');
        vistaMenu.classList.add('activa');
    } else if (pantallaDestino === 'enciclopedia' && vistaEnciclopedia) {
        vistaEnciclopedia.classList.remove('oculta');
        vistaEnciclopedia.classList.add('activa');
    } else if (vistaInicio) {
        // Si no hay estado o es 'inicio', regresa al inicio puro
        vistaInicio.classList.remove('oculta');
        vistaInicio.classList.add('activa');
    }
});

// Al cargar el sistema por primera vez, inicializamos el historial base
window.addEventListener('DOMContentLoaded', () => {
    if (!history.state) {
        history.replaceState({ pantalla: 'inicio' }, '', '#inicio');
    }
});