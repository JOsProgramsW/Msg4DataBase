// el puente de conexion entre el frontend y el backend, aqui se hacen las peticiones a la api
// y se reciben las respuestas, luego se procesan y se envian al frontend para su visualizacion
// ==========================================================================
// API SERVICE LAYER: PUENTE DE CONEXIÓN CON BACKEND ASP.NET CORE
// ======================================================================
const API_BASE_URL = "https://localhost:7157/api"; // Asegúrate de que coincida con tu puerto de IIS/Kestrel

const api = {
    
    // 🟢 SQA FIX: Exponemos la constante dentro del objeto api para que main.js la consuma
    API_BASE_URL: "https://localhost:7157", 
    
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
    },

    // ==========================================================================
    // NUEVOS MÉTODOS: ESCRITURA Y GESTIÓN (USUARIO / ADMINISTRADOR)
    // ==========================================================================

    /**
     * Envía un nuevo artículo propuesto por un usuario al backend.
     * @param {Object} articulo - Objeto con Titulo, Slug, Categoria, Resumen y Contenido.
     * @param {number} idUser - ID del usuario que propone la transmisión.
     * @param {string} motivo - Descripción o bitácora del envío.
     */
    async publicarArticulo(articuloData, idUser, motivo) {
        // 🧹 LIMPIEZA DE CATEGORÍA: Si contiene espacios o paréntesis, toma solo la primera palabra
        let categoriaLimpia = articuloData.Categoria;

        const cuerpoPeticion = {
            Titulo: articuloData.Titulo,
            Slug: articuloData.Slug,
            Categoria: categoriaLimpia, 
            Resumen: articuloData.Resumen,
            Contenido: articuloData.Contenido,
            IdUser: idUser, 
            Motivo: motivo || "Propuesta inicial de sistema"
        };

        // 🟢 SQA FIX: Se reemplaza la URL explícita por la constante dinámica template string
        const response = await fetch(`${API_BASE_URL}/Articulos/proponer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cuerpoPeticion)
        });

        if (!response.ok) {
            const errorTexto = await response.text();
            throw new Error(errorTexto);
        }

        return await response.json();
    },

    async subirImagenArticulo(idArticulo, archivoFisico) {
        const formData = new FormData();
        formData.append("archivo", archivoFisico); 

        // 🟢 SQA FIX: Se reemplaza la URL explícita por la constante dinámica template string
        const response = await fetch(`${API_BASE_URL}/Articulos/subir-imagen-articulo/${idArticulo}`, {
            method: "POST",
            body: formData 
        });

        if (!response.ok) {
            const errorTexto = await response.text();
            throw new Error(`Fallo en el transporte de imágenes: ${errorTexto}`);
        }

        return await response.json(); 
    },

    /**
     * Actualiza el estado o la información de un artículo (Aceptar/Modificar).
     * @param {string|number} id - Identificador único del artículo.
     * @param {Object} datosActualizados - Objeto con los campos modificados (ej: { aprobado: true }).
     */
    async modificarArticulo(id, datosActualizados) {
        const respuesta = await fetch(`${API_BASE_URL}/articulos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });
        if (!respuesta.ok) {
            const errorTexto = await respuesta.text();
            throw new Error(`HTTP ${respuesta.status}: ${errorTexto}`);
        }
        return respuesta.status === 204 ? null : await respuesta.json();
    },

    /**
     * Elimina permanentemente un artículo de la base de datos (Rol Admin).
     * @param {string|number} id - Identificador único del artículo.
     */
    async eliminarArticulo(id) {
        const respuesta = await fetch(`${API_BASE_URL}/articulos/${id}`, {
            method: 'DELETE'
        });
        if (!respuesta.ok) {
            const errorTexto = await respuesta.text();
            throw new Error(`HTTP ${respuesta.status}: ${errorTexto}`);
        }
        return true;
    }
};