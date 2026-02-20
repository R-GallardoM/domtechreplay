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
        galeria.innerHTML = "<p>Error de sincronización.</p>";
        return;
    }

    galeria.innerHTML = ""; 

    data.forEach((clip, index) => {
        const videoUrl = `${R2_PUBLIC_URL}/${clip.nombre}`;
        const fecha = new Date(clip.created_at);
        const fechaFormateada = fecha.toLocaleString('es-MX', { 
            day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' 
        }).toUpperCase();

        const card = document.createElement('div');
        card.className = 'card';
        // Esto hace que las tarjetas aparezcan una por una
        card.style.animationDelay = `${index * 0.1}s`; 
        
        card.innerHTML = `
            <div class="video-wrapper">
                <video preload="metadata" playsinline loop muted onmouseover="this.play()" onmouseout="this.pause()">
                    <source src="${videoUrl}" type="video/mp4">
                </video>
            </div>
            <div class="card-info">
                <span class="label">Match Highlight</span>
                <span class="date-text">${fechaFormateada}</span>
                <a href="${videoUrl}" class="btn-action" target="_blank" download>
                    GUARDAR CLIP
                </a>
            </div>
        `;
        galeria.appendChild(card);
    });
}

cargarVideos();
