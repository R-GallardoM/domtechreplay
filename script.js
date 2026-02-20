// --- CONFIGURACIÓN DOMTECH REPLAY ---
const SUPABASE_URL = "https://gxgqgqcwgsmsxlnxsrcj.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_P7eGeU0cO6luraeKLmExDQ_Lb9OXOOT";
const R2_PUBLIC_URL = "https://pub-30d153c22f29479a9e01afad5b2ed5f9.r2.dev"; 

// Usamos 'db' para evitar el SyntaxError
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function cargarVideos() {
    const galeria = document.getElementById('galeria');
    
    const { data, error } = await db
        .from('clips')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error de Supabase:", error);
        galeria.innerHTML = "<p>Hubo un error al conectar con la base de datos.</p>";
        return;
    }

    if (!data || data.length === 0) {
        galeria.innerHTML = "<p>Aún no hay jugadas grabadas. ¡Ve a la cancha y dispara una!</p>";
        return;
    }

    galeria.innerHTML = ""; 

    data.forEach(clip => {
        const videoUrl = `${R2_PUBLIC_URL}/${clip.nombre}`;
        const fechaOriginal = new Date(clip.created_at);
        const opciones = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
        const fechaFormateada = fechaOriginal.toLocaleString('es-MX', opciones);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <video controls preload="metadata">
                <source src="${videoUrl}" type="video/mp4">
            </video>
            <p class="fecha">📅 ${fechaFormateada}</p>
            <a href="${videoUrl}" class="btn-download" target="_blank" download>📥 Descargar Clip</a>
        `;
        galeria.appendChild(card);
    });
}

cargarVideos();
