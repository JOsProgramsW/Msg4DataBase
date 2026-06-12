// el puente de conexion entre el frontend y el backend, aqui se hacen las peticiones a la api
// y se reciben las respuestas, luego se procesan y se envian al frontend para su visualizacion
// ==========================================================================
// API SERVICE LAYER: PUENTE DE CONEXIÓN CON BACKEND ASP.NET CORE
// ======================================================================
const api = {
    
    // URL Base única del servidor de desarrollo ASP.NET Core
    API_BASE_URL: "https://localhost:7157", 

    /**
     * Auxiliar interno para construir las URLs de forma limpia.
     * Si el endpoint ya contiene una ruta completa, respeta la base general de la API.
     */
    _obtenerApiUrl(endpoint, esControladorArticulos = true) {
        if (esControladorArticulos) {
            return `${this.API_BASE_URL}/api/Articulos/${endpoint.replace(/^\//, '')}`;
        }
        return `${this.API_BASE_URL}/api/${endpoint.replace(/^\//, '')}`;
    },
    
    /**
     * Recupera el listado completo de artículos registrados (Usado por la Enciclopedia).
     */
    async obtenerArticulos() {
        // SQA FIX: Corrección del bug 'this.this'
        const respuesta = await fetch(this._obtenerApiUrl(""));
        if (!respuesta.ok) throw new Error(`HTTP Error: ${respuesta.status}`);
        return await respuesta.json();
    },

    /**
     * Recupera la información extendida de un artículo mediante su slug (Usado por la Enciclopedia).
     */
    async obtenerArticuloPorSlug(slug) {
        const respuesta = await fetch(this._obtenerApiUrl(`slug/${slug}`));
        if (!respuesta.ok) throw new Error(`HTTP Error: ${respuesta.status}`);
        return await respuesta.json();
    },

    /**
     * Recupera los hitos cronológicos de la saga desde el backend.
     */
    async obtenerCronologia() {
        // SQA FIX: Ruta dirigida al controlador independiente de cronología
        const respuesta = await fetch(this._obtenerApiUrl("cronologia", false));
        if (!respuesta.ok) throw new Error(`HTTP Error: ${respuesta.status}`);
        return await respuesta.json();
    },

    /**
     * Recupera la estructura relacional de grafos (nodes y edges).
     */
    async obtenerRelaciones() {
        // SQA FIX: Ruta dirigida al controlador independiente de relaciones
        const respuesta = await fetch(this._obtenerApiUrl("relaciones", false));
        if (!respuesta.ok) throw new Error(`HTTP Error: ${respuesta.status}`);
        return await respuesta.json();
    },

    // ==========================================================================
    // MÉTODOS DE ESCRITURA Y GESTIÓN (USUARIO / ADMINISTRADOR)
    // ==========================================================================

    async publicarArticulo(articuloData, idUser, motivo) {
        const cuerpoPeticion = {
            Titulo: articuloData.Titulo,
            Slug: articuloData.Slug,
            Categoria: articuloData.Categoria, 
            Resumen: articuloData.Resumen,
            Contenido: articuloData.Contenido,
            IdUser: idUser, 
            Motivo: motivo || "Propuesta inicial de sistema"
        };

        const response = await fetch(this._obtenerApiUrl("proponer"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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

        const response = await fetch(this._obtenerApiUrl(`subir-imagen-articulo/${idArticulo}`), {
            method: "POST",
            body: formData 
        });

        if (!response.ok) {
            const errorTexto = await response.text();
            throw new Error(`Fallo en el transporte de imágenes: ${errorTexto}`);
        }
        return await response.json(); 
    },

    async modificarArticulo(id, datosActualizados) {
        const cuerpoCsharp = {
            IdArt: parseInt(id),
            Titulo: datosActualizados.titulo,
            Slug: datosActualizados.slug,
            Categoria: datosActualizados.categoria,
            Resumen: datosActualizados.resumen,
            Contenido: datosActualizados.contenido
        };

        const respuesta = await fetch(this._obtenerApiUrl(`${id}`), {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cuerpoCsharp)
        });
        if (!respuesta.ok) {
            const errorTexto = await respuesta.text();
            throw new Error(`HTTP ${respuesta.status}: ${errorTexto}`);
        }
        return respuesta.status === 204 ? null : await respuesta.json();
    },

    async eliminarArticulo(id) {
        const respuesta = await fetch(this._obtenerApiUrl(`${id}`), {
            method: 'DELETE'
        });
        if (!respuesta.ok) {
            const errorTexto = await respuesta.text();
            throw new Error(`HTTP ${respuesta.status}: ${errorTexto}`);
        }
        return true;
    },

    async obtenerPendientes() {
        const respuesta = await fetch(this._obtenerApiUrl("pendientes"));
        if (!respuesta.ok) throw new Error(`HTTP Error工程: ${respuesta.status}`);
        return await respuesta.json();
    },

async resolverPropuesta(idHistorial, estado, motivo) {
    if (!idHistorial || idHistorial === "undefined") {
        throw new Error("El ID de historial provisto no es válido.");
    }

    // 🚨 CORRECCIÓN AQUÍ: Se añade /api/ a la ruta para que coincida con el [Route] de C#
    const url = `https://localhost:7157/api/Historial/resolver/${idHistorial}`; 

    console.log("SOP AUDIT: Transmitiendo resolución de auditoría a:", url);
    
    const respuesta = await fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idHist: parseInt(idHistorial, 10),
            estado: estado,       // Envía "Aprobado"
            motivoCambio: motivo  // Envía el texto de la revisión
        })
    });

    if (!respuesta.ok) {
        const errorTexto = await respuesta.text();
        throw new Error(`HTTP ${respuesta.status}: ${errorTexto}`);
    }

    return respuesta.status === 204 ? null : await respuesta.json();
}
};