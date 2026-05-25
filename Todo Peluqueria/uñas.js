// ==============================================
// STUDIO LUX - FUNCIONALIDAD COMPLETA
// ==============================================

document.addEventListener('DOMContentLoaded', function() {

    // 1. ANIMACIÓN CLICK EN IMÁGENES (toggle texto)
    const filas = document.querySelectorAll('.fila-interactiva');
    filas.forEach(fila => {
        const imagenContainer = fila.querySelector('.contenedor-imagen-click');
        if (imagenContainer) {
            imagenContainer.style.cursor = 'pointer';
            imagenContainer.addEventListener('click', (e) => {
                e.stopPropagation();
                fila.classList.toggle('animada');
            });
        }
    });

    // 2. MODAL CITA (igual que antes)
    const modal = document.getElementById('modalCita');
    const btnAgendar = document.getElementById('btnAgendarHeader');
    const cerrarModal = document.getElementById('cerrarModalBtn');
    const formCita = document.getElementById('formCita');

    if (btnAgendar) {
        btnAgendar.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    if (cerrarModal) {
        cerrarModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    if (formCita) {
        formCita.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const fecha = document.getElementById('fecha').value;
            const telefono = document.getElementById('telefono').value.trim();
            if (!nombre || !apellido || !fecha || !telefono) {
                alert('Completa todos los campos');
                return;
            }
            if (telefono.length < 9) {
                alert('Teléfono inválido (mínimo 9 dígitos)');
                return;
            }
            const fechaObj = new Date(fecha);
            const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {year:'numeric', month:'long', day:'numeric'});
            alert(`Cita agendada ✅\n\nNombre: ${nombre} ${apellido}\nDía: ${fechaFormateada}\nTeléfono: ${telefono}\n\n¡Te esperamos en Studio Lux!`);
            formCita.reset();
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // 3. CHATBOT (igual que antes)
    const chatbotBtn = document.getElementById('chatbotBtn');
    const ventanaChat = document.getElementById('ventanaChat');
    const cerrarChat = document.getElementById('cerrarChatBtn');
    const inputUsuario = document.getElementById('inputUsuario');
    const enviarBtn = document.getElementById('enviarBtn');
    const contenedorMsgs = document.getElementById('contenedorMensajes');

    function addMensaje(texto, tipo) {
        if (!contenedorMsgs) return;
        const div = document.createElement('div');
        div.classList.add(tipo === 'user' ? 'mensaje-usuario' : 'mensaje-bot');
        div.innerText = texto;
        contenedorMsgs.appendChild(div);
        contenedorMsgs.scrollTop = contenedorMsgs.scrollHeight;
    }

    function respuestaBot(mensaje) {
        const msg = mensaje.toLowerCase();
        if (msg.includes('precio') || msg.includes('cuesta') || msg.includes('tarifa')) {
            return "💅 Manicura básica desde 35€ | Gel semipermanente 45€ | Nail art desde +55€. ¡Consulta promociones!";
        } else if (msg.includes('duracion') || msg.includes('dura') || msg.includes('semanas')) {
            return "✨ Nuestros esmaltes duran entre 3 y 4 semanas sin desconchones. El mantenimiento se recomienda cada 21 días.";
        } else if (msg.includes('cita') || msg.includes('reservar') || msg.includes('agendar')) {
            return "📅 Para agendar una cita, haz clic en el botón 'Agendar cita' (arriba a la derecha). Te esperamos 💖";
        } else if (msg.includes('manicura') || msg.includes('uñas') || msg.includes('tratamiento')) {
            return "💎 Ofrecemos manicura de autor, gel, acrílico, kapping, y diseños personalizados. ¡Todos con protocolo de higiene premium!";
        } else {
            return "🌟 ¿Necesitas más info? Pregúntame sobre precios, duración, manicura o cómo reservar. ¡Estoy para ayudarte!";
        }
    }

    function enviarMensaje() {
        if (!inputUsuario || !contenedorMsgs) return;
        const texto = inputUsuario.value.trim();
        if (texto === "") return;
        addMensaje(texto, 'user');
        inputUsuario.value = '';
        setTimeout(() => {
            const respuesta = respuestaBot(texto);
            addMensaje(respuesta, 'bot');
        }, 400);
    }

    if (chatbotBtn && ventanaChat && cerrarChat && enviarBtn && inputUsuario) {
        chatbotBtn.addEventListener('click', () => { ventanaChat.style.display = 'flex'; });
        cerrarChat.addEventListener('click', () => { ventanaChat.style.display = 'none'; });
        enviarBtn.addEventListener('click', enviarMensaje);
        inputUsuario.addEventListener('keypress', (e) => { if (e.key === 'Enter') enviarMensaje(); });
    }

    // 4. LOADER Y NAVEGACIÓN
    const loader = document.getElementById('global-loader-overlay');
    function hideLoader() {
        if (loader) {
            loader.classList.remove('active-loader');
            document.body.classList.remove('loader-active');
        }
    }
    function showLoader() {
        if (loader) {
            loader.classList.add('active-loader');
            document.body.classList.add('loader-active');
        }
    }

    const fakeInicio = document.getElementById('fakeInicio');
    const fakePelo = document.getElementById('fakePelo');
    if (fakeInicio) {
        fakeInicio.addEventListener('click', (e) => {
            e.preventDefault();
            showLoader();
            setTimeout(() => { window.location.href = 'Peluquería.html'; }, 1500);
        });
    }
    if (fakePelo) {
        fakePelo.addEventListener('click', (e) => {
            e.preventDefault();
            showLoader();
            setTimeout(() => { window.location.href = 'Pelo.html'; }, 1500);
        });
    }

    window.addEventListener('load', () => {
        setTimeout(() => { hideLoader(); }, 300);
    });

    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        if (href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        if (link.id === 'fakeInicio' || link.id === 'fakePelo') return;
        if (link.classList.contains('btn-whatsapp')) return;
        if (href.includes('Peluquería.html') || href.includes('Pelo.html')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showLoader();
                setTimeout(() => { window.location.href = href; }, 1500);
            });
        }
    });

    console.log('✅ Studio Lux: animación, modal, chatbot y loader activos');
});