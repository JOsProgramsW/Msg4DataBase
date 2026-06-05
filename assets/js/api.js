// el puente de conexion entre el frontend y el backend, aqui se hacen las peticiones a la api
// y se reciben las respuestas, luego se procesan y se envian al frontend para su visualizacion
// ==========================================================================
// API SERVICE LAYER: PUENTE DE CONEXIÓN CON BACKEND ASP.NET CORE
// ==========================================================================

const API_BASE_URL = "https://localhost:7157/api"; // Asegúrate de que coincida con tu puerto de IIS/Kestrel

const api = {
    /**
     * Recupera el listado completo de artículos registrados en el servidor.
     */
    async obtenerArticulos() {
        const respuesta = await fetch(`${API_BASE_URL}/articulos`);
        if (!respuesta.ok) throw new Error(`HTTP Error: ${respuesta.status}`);
        return await respuesta.json();
    },

    /**
     * Recupera la información extendida de un artículo mediante su slug.
     */
    async obtenerArticuloPorSlug(slug) {
        const respuesta = await fetch(`${API_BASE_URL}/articulos/slug/${slug}`);
        if (!respuesta.ok) throw new Error(`HTTP Error: ${respuesta.status}`);
        return await respuesta.json();
    },

    /**
     * Recupera los hitos cronológicos de la saga desde el backend.
     */
    async obtenerCronologia() {
        const respuesta = await fetch(`${API_BASE_URL}/cronologia`);
        if (!respuesta.ok) throw new Error(`HTTP Error: ${respuesta.status}`);
        return await respuesta.json();
    },

    /**
     * Recupera la estructura relacional de grafos (nodes y edges).
     */
    async obtenerRelaciones() {
        const respuesta = await fetch(`${API_BASE_URL}/relaciones`);
        if (!respuesta.ok) throw new Error(`HTTP Error: ${respuesta.status}`);
        return await respuesta.json();
    }
};