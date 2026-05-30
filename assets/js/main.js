//es el que maneja las transiciones entre pantallas y la logica de navegacion, ademas de cargar los datos necesarios para cada pantalla y renderizarlos
const vistaInicio = document.getElementById('vista-inicio');
const vistaLogin = document.getElementById('vista-login');
const vistaMenu = document.getElementById('vista-menu');
const vistaEnciclopedia = document.getElementById('vista-enciclopedia');

// Captura de Botones de Navegación
const btnStart = document.getElementById('btn-start');
const formLogin = document.getElementById('form-login');
const btnIrEnciclopedia = document.getElementById('btn-ir-enciclopedia');

// Función encargada de cambiar las pantallas de la SPA
function cambiarPantalla(pantallaActual, pantallaSiguiente) {
    pantallaActual.classList.remove('activa');
    pantallaActual.classList.add('oculta');

    pantallaSiguiente.classList.remove('oculta');
    pantallaSiguiente.classList.add('activa');
}

// --------------------------------------------------------------------------
// ESCUCHADORES DE EVENTOS (LISTENERS)
// --------------------------------------------------------------------------

// 1. De Inicio a Login
btnStart.addEventListener('click', () => {
    cambiarPantalla(vistaInicio, vistaLogin);
});

// 2. De Login a Menú Principal (Simulado al enviar el formulario)
formLogin.addEventListener('submit', (evento) => {
    evento.preventDefault();
    // Aquí puedes meter la lógica de validación de inputs más adelante
    cambiarPantalla(vistaLogin, vistaMenu);
});

// 3. De Menú Principal a Enciclopedia
btnIrEnciclopedia.addEventListener('click', () => {
    cambiarPantalla(vistaMenu, vistaEnciclopedia);
});