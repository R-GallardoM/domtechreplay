// --- CONFIGURACIÓN DOMTECH REPLAY ---
const SUPABASE_URL = "https://gxgqgqcwgsmsxlnxsrcj.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_P7eGeU0cO6luraeKLmExDQ_Lb9OXOOT";
const R2_PUBLIC_URL = "https://pub-30d153c22f29479a9e01afad5b2ed5f9.r2.dev"; 

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function cargarVideos() {
    const galeria = document.getElementById('galeria');
    
    const { data, error } = await db
        .from('clips')
        .select('*')
        .order('created_at', { ascending: false });

    if (error || !data) {
        console.error("Error:", error);
        galeria.innerHTML = "<div id='loader'>ERROR DE SINCRONIZACIÓN</div>";
        return;
    }

    if (data.length === 0) {
        galeria.innerHTML = "<div id='loader'>BIBLIOTECA VACÍA</div>";
        return;
    }

    galeria.innerHTML = ""; 

    data.forEach((clip) => {
        const videoUrl = `${R2_PUBLIC_URL}/${clip.nombre}`;
        const fechaOriginal = new Date(clip.created_at);
        
        // Formato profesional: 20 FEB, 09:30 AM
        const fechaFormateada = fechaOriginal.toLocaleString('es-MX', { 
            day: '2-digit', 
            month: 'short', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        }).toUpperCase();

        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <div class="video-wrapper">
                <div class="play-hint"><i data-lucide="play" fill="white"></i></div>
                <div class="video-overlay"></div>
                <video src="${videoUrl}" preload="metadata" muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>
            </div>
            <div class="card-info">
                <div class="card-meta">
                    <span class="label">REPLAY HD</span>
                    <div style="color: var(--text-dim); font-size: 0.7rem; display: flex; align-items: center; gap: 4px;">
                        <i data-lucide="clock" style="width:12px"></i> ANALIZADO
                    </div>
                </div>
                <span class="date-text">${fechaFormateada}</span>
                <a href="${videoUrl}" download="${clip.nombre}" class="btn-action">
                    <i data-lucide="download" style="width:16px"></i>
                    DESCARGAR ANÁLISIS
                </a>
            </div>
        `;
        galeria.appendChild(card);
    });

    // Esta línea es VITAL para que aparezcan los iconos de Lucide en las nuevas tarjetas
    lucide.createIcons();
}

cargarVideos();
