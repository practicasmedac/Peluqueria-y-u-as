// Inicio
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. BOTÓN DE INICIO
    // ============================================
    const boton_inicio = document.getElementById('Inicio');
    
    // Mejoramos tu código para que al hacer clic te lleve a index.html
    if (boton_inicio) {
        boton_inicio.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // ============================================
    // 2. MODO OSCURO
    // ============================================
    const btnModoOscuro = document.getElementById("modoOscuroFloat");
    const body = document.body;
    
    // Comprobamos si el usuario ya tenía el modo oscuro activado en la página principal
    const modoOscuroGuardado = localStorage.getItem('modoOscuro');
    if (modoOscuroGuardado === 'true' || modoOscuroGuardado === 'activado') {
        body.classList.add("dark");
        if (btnModoOscuro) btnModoOscuro.textContent = "☀️";
    } else {
        body.classList.remove("dark");
        if (btnModoOscuro) btnModoOscuro.textContent = "🌙";
    }
    
    // Cambiar entre modo claro/oscuro al hacer clic
    if (btnModoOscuro) {
        btnModoOscuro.addEventListener("click", () => {
            body.classList.toggle("dark");
            const isDark = body.classList.contains("dark");
            btnModoOscuro.textContent = isDark ? "☀️" : "🌙";
            
            // Guardamos la preferencia para que se mantenga al cambiar de página
            localStorage.setItem('modoOscuro', isDark ? 'true' : 'false');
        });
    }
});