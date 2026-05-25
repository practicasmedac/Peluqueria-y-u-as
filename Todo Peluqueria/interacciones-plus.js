// ========== INTERACCIONES AVANZADAS ==========
// 1. Barra de progreso de lectura
function initReadingProgress() {
    const bar = document.createElement('div');
    bar.id = 'reading-progress-bar';
    bar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #ffbd6c, #b86c40);
        z-index: 10001;
        transition: width 0.1s ease;
        box-shadow: 0 0 5px #ffbd6c;
    `;
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + '%';
    });
}

// 2. Efecto tilt 3D en contenedores con clase .tilt-img o .contenedor-imagen-deco, .contenedor-imagen-click
function initTiltEffect() {
    const elements = document.querySelectorAll('.contenedor-imagen-deco, .contenedor-imagen-click, .servicio-card, .valor');
    elements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            el.style.transition = 'transform 0.1s';
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            el.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        });
    });
}

// 3. Botones magnéticos (se mueven hacia el cursor)
function initMagneticButtons() {
    const btns = document.querySelectorAll('.btn-cita-header, .btn-enviar, .btn-whatsapp, .chatbot-button');
    btns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const moveX = (x - centerX) / 8;
            const moveY = (y - centerY) / 8;
            btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// 4. Partículas flotantes en fondo (solo estético)
function initFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particles-bg';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    document.body.insertBefore(particleContainer, document.body.firstChild);
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 8 + 2}px;
            height: ${Math.random() * 8 + 2}px;
            background: rgba(255, 189, 108, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 15 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        particleContainer.appendChild(particle);
    }
    // Añadir keyframes si no existen
    if (!document.querySelector('#particle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'particle-keyframes';
        style.textContent = `
            @keyframes floatParticle {
                0% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
                50% { transform: translateY(-80px) rotate(180deg); opacity: 0.6; }
                100% { transform: translateY(0) rotate(360deg); opacity: 0.2; }
            }
        `;
        document.head.appendChild(style);
    }
}

// 5. Revelado escalonado con IntersectionObserver (mejora el existente)
function initStaggeredReveal() {
    const items = document.querySelectorAll('.tarjeta-look, .servicio-card, .fila-interactiva, .info-look, .valor-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(35px)';
        item.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(item);
    });
}

// 6. Cursor personalizado con destello (solo si no está activo en pantallas táctiles)
function initCustomCursor() {
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 28px;
            height: 28px;
            border: 2px solid #b86c40;
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transform: translate(-50%, -50%);
            transition: transform 0.1s, width 0.2s, height 0.2s, background 0.2s;
            backdrop-filter: invert(0.1);
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });
        // efecto al pasar sobre elementos clickeables
        const clickables = document.querySelectorAll('a, button, .btn-cita-header, .enlace-header, .contenedor-imagen-click');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '44px';
                cursor.style.height = '44px';
                cursor.style.background = 'rgba(184,108,64,0.2)';
                cursor.style.borderColor = '#ffbd6c';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '28px';
                cursor.style.height = '28px';
                cursor.style.background = 'transparent';
                cursor.style.borderColor = '#b86c40';
            });
        });
    }
}

// 7. Latido en WhatsApp y chatbot
function initHeartbeat() {
    const whatsapp = document.querySelector('.btn-whatsapp');
    const chatbot = document.querySelector('.chatbot-button');
    if (whatsapp) {
        setInterval(() => {
            whatsapp.style.transform = 'scale(1.05)';
            setTimeout(() => { whatsapp.style.transform = 'scale(1)'; }, 300);
        }, 4000);
    }
    if (chatbot) {
        setInterval(() => {
            chatbot.style.transform = 'scale(1.05)';
            setTimeout(() => { chatbot.style.transform = 'scale(1)'; }, 300);
        }, 5000);
    }
}

// 8. Efecto parallax en imágenes de fondo (si alguna tiene background-image)
function initParallaxBackground() {
    const parallaxElements = document.querySelectorAll('.seccion-imagen, .intro, .seccion-info');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(el => {
            const speed = 0.2;
            const yPos = scrolled * speed;
            if (el.style.backgroundImage && el.style.backgroundImage !== 'none') {
                el.style.backgroundPositionY = `${yPos}px`;
            }
        });
    });
}

// Inicializar todo cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initReadingProgress();
    initTiltEffect();
    initMagneticButtons();
    initFloatingParticles();
    initStaggeredReveal();
    initCustomCursor();
    initHeartbeat();
    initParallaxBackground();
});
// Generar partículas flotantes
function crearParticulas() {
    const container = document.createElement('div');
    container.id = 'particles-container';
    document.body.appendChild(container);
    
    const numParticles = 60; // cantidad de partículas
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Tamaño aleatorio entre 2px y 8px
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Posición inicial horizontal aleatoria
        particle.style.left = `${Math.random() * 100}%`;
        
        // Duración de la animación entre 8s y 20s
        const duration = Math.random() * 12 + 8;
        particle.style.animationDuration = `${duration}s`;
        
        // Retraso aleatorio para que no salgan todas a la vez
        particle.style.animationDelay = `${Math.random() * 15}s`;
        
        container.appendChild(particle);
    }
}

// Ejecutar cuando cargue la página
document.addEventListener('DOMContentLoaded', crearParticulas);