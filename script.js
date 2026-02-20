// --- CONFIGURACIÓN DOMTECH REPLAY ---
const SUPABASE_URL = "https://gxgqgqcwgsmsxlnxsrcj.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_P7eGeU0cO6luraeKLmExDQ_Lb9OXOOT";
const R2_PUBLIC_URL = "https://pub-30d153c22f29479a9e01afad5b2ed5f9.r2.dev"; 

// Conexión a la base de datos usando el cliente de Supabase
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function cargarVideos() {
    const galeria = document.getElementById('galeria');
    
    // Consulta para obtener los clips ordenados por fecha de creación descendente
    const { data, error } = await db
        .from('clips')
        .select('*')
        .order('created_at', { ascending: false });

    // Manejo de errores de conexión
    if (error) {
        console.error("Error de Supabase:", error);
        galeria.innerHTML = "<p>Error de conexión con la base de datos.</p>";
        return;
    }

    // Mensaje si no hay registros en la tabla
    if (!data || data.length === 0) {
        galeria.innerHTML = "<p>No se encontraron registros en la biblioteca.</p>";
        return;
    }

    galeria.innerHTML = ""; 

    // Generación de tarjetas con diseño profesional
    data.forEach(clip => {
        const videoUrl = `${R2_PUBLIC_URL}/${clip.nombre}`;
        const fechaOriginal = new Date(clip.created_at);
        
        // Formato de fecha localizado para México sin emojis
        const opciones = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
        const fechaFormateada = fechaOriginal.toLocaleString('es-MX', opciones).toUpperCase();

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="video-container">
                <video controls preload="metadata">
                    <source src="${videoUrl}" type="video/mp4">
                </video>
            </div>
            <div class="card-content">
                <span class="fecha">${fechaFormateada}</span>
                <a href="${videoUrl}" class="btn-download" target="_blank" download>
                    Descargar Video
                </a>
            </div>
        `;
        galeria.appendChild(card);
    });
}

// Inicializar la carga al abrir la página
cargarVideos();
