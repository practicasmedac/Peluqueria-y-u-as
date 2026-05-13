// ============================================
// STUDIO LUX - ARCHIVO PRINCIPAL JS
// Módulos: Modal Registro, Modal Login, Modal Cita, Modo Oscuro
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== FUNCIÓN PARA ABRIR MODAL ==========
    function abrirModal(modal) {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    // ========== FUNCIÓN PARA CERRAR MODAL ==========
    function cerrarModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // ========== FUNCIÓN PARA ACTUALIZAR LA INTERFAZ ==========
    function actualizarInterfazUsuario() {
        const usuarioActivo = sessionStorage.getItem('usuarioActivo');
        const headerDerecha = document.querySelector('.header-derecha');
        
        // Eliminar perfil existente si lo hay
        const perfilExistente = document.getElementById('userProfileDisplay');
        if (perfilExistente) perfilExistente.remove();
        
        if (usuarioActivo) {
            const usuario = JSON.parse(usuarioActivo);
            
            // Crear elemento para mostrar el usuario logueado
            const userSpan = document.createElement('span');
            userSpan.id = 'userProfileDisplay';
            userSpan.style.cssText = 'color:#7f3907; font-weight:bold; background:#fde9d5; padding:5px 15px; border-radius:50px; margin-right:10px;';
            userSpan.innerHTML = `👤 ${usuario.nombre}`;
            
            // Crear botón de cerrar sesión
            const logoutBtn = document.createElement('button');
            logoutBtn.textContent = 'Salir';
            logoutBtn.className = 'btn-cita-header';
            logoutBtn.id = 'btnCerrarSesion';
            logoutBtn.style.padding = '6px 18px';
            logoutBtn.onclick = function() {
                sessionStorage.removeItem('usuarioActivo');
                actualizarInterfazUsuario();
                alert('👋 Sesión cerrada');
                // Recargar la página para resetear los botones
                location.reload();
            };
            
            // Ocultar botones de registro y login
            const btnReg = document.getElementById('btnRegistrarseHeader');
            const btnLog = document.getElementById('btnIniciarSesionHeader');
            if (btnReg) btnReg.style.display = 'none';
            if (btnLog) btnLog.style.display = 'none';
            
            // Insertar perfil antes del botón de agendar cita
            const btnAgendar = document.getElementById('btnAgendarHeader');
            headerDerecha.insertBefore(userSpan, btnAgendar);
            headerDerecha.insertBefore(logoutBtn, btnAgendar);
        } else {
            // Mostrar botones de registro y login
            const btnReg = document.getElementById('btnRegistrarseHeader');
            const btnLog = document.getElementById('btnIniciarSesionHeader');
            if (btnReg) btnReg.style.display = 'inline-block';
            if (btnLog) btnLog.style.display = 'inline-block';
        }
    }
    
    // ============================================
    // 1. MODAL REGISTRO
    // ============================================
    const modalRegistro = document.getElementById('modalRegistro');
    const btnRegistrar = document.getElementById('btnRegistrarseHeader');
    const cerrarRegistro = document.getElementById('cerrarRegistroBtn');
    const formRegistro = document.getElementById('formRegistro');

    if (btnRegistrar) {
        btnRegistrar.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal(modalRegistro);
        });
    }
    
    if (cerrarRegistro) {
        cerrarRegistro.addEventListener('click', () => {
            cerrarModal(modalRegistro);
        });
    }

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('regNombre').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const telefono = document.getElementById('regTelefono').value.trim();
            const password = document.getElementById('regPassword').value;

            if (!nombre || !email || !telefono || !password) {
                alert('❌ Completa todos los campos');
                return;
            }
            if (password.length < 6) {
                alert('❌ La contraseña debe tener al menos 6 caracteres');
                return;
            }
            if (!/^\d{9,}$/.test(telefono)) {
                alert('❌ Teléfono inválido (mínimo 9 dígitos)');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('❌ Correo electrónico inválido');
                return;
            }

            alert(`✅ ¡Registro exitoso!\n\nBienvenid@ ${nombre}\n📧 ${email}\n📞 ${telefono}\n\nYa puedes iniciar sesión`);
            
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            usuarios.push({ nombre, email, telefono, password });
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            
            formRegistro.reset();
            cerrarModal(modalRegistro);
        });
    }

    // ============================================
    // 2. MODAL INICIAR SESIÓN (MODIFICADO)
    // ============================================
    const modalLogin = document.getElementById('modalLogin');
    const btnLogin = document.getElementById('btnIniciarSesionHeader');
    const cerrarLogin = document.getElementById('cerrarLoginBtn');
    const formLogin = document.getElementById('formLogin');

    if (btnLogin) {
        btnLogin.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal(modalLogin);
        });
    }
    
    if (cerrarLogin) {
        cerrarLogin.addEventListener('click', () => {
            cerrarModal(modalLogin);
        });
    }

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                alert('❌ Completa todos los campos');
                return;
            }

            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            const usuarioExistente = usuarios.find(u => u.email === email && u.password === password);
            
            if (usuarioExistente) {
                alert(`✅ ¡Sesión iniciada!\n\nBienvenid@ de nuevo ${usuarioExistente.nombre}`);
                sessionStorage.setItem('usuarioActivo', JSON.stringify(usuarioExistente));
                formLogin.reset();
                cerrarModal(modalLogin);
                // Actualizar la interfaz para mostrar el usuario
                actualizarInterfazUsuario();
            } else {
                alert('❌ Credenciales incorrectas.\n¿No tienes cuenta? Regístrate primero.');
            }
        });
    }

    // ============================================
    // 3. MODAL AGENDAR CITA
    // ============================================
    const modalCita = document.getElementById('modalCita');
    const btnAgendar = document.getElementById('btnAgendarHeader');
    const cerrarModalCita = document.getElementById('cerrarModalBtn');
    const formCita = document.getElementById('formCita');

    if (btnAgendar) {
        btnAgendar.addEventListener('click', (e) => {
            e.preventDefault();
            // Verificar si hay sesión activa
            const usuarioActivo = sessionStorage.getItem('usuarioActivo');
            if (!usuarioActivo) {
                alert('⚠️ Debes iniciar sesión para agendar una cita');
                abrirModal(modalLogin);
                return;
            }
            abrirModal(modalCita);
        });
    }
    
    if (cerrarModalCita) {
        cerrarModalCita.addEventListener('click', () => {
            cerrarModal(modalCita);
        });
    }

    if (formCita) {
        formCita.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const usuarioActivo = sessionStorage.getItem('usuarioActivo');
            if (!usuarioActivo) {
                alert('⚠️ Debes iniciar sesión para agendar una cita');
                cerrarModal(modalCita);
                abrirModal(modalLogin);
                return;
            }
            
            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const fecha = document.getElementById('fecha').value;
            const telefono = document.getElementById('telefono').value.trim();

            if (!nombre || !apellido || !fecha || !telefono) {
                alert('❌ Completa todos los campos');
                return;
            }
            if (!/^\d{9,}$/.test(telefono)) {
                alert('❌ Teléfono inválido (mínimo 9 dígitos)');
                return;
            }
            
            const fechaObj = new Date(fecha);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            if (fechaObj < hoy) {
                alert('❌ La fecha no puede ser anterior a hoy');
                return;
            }

            const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            });
            
            alert(`✅ Cita agendada\n\n👤 ${nombre} ${apellido}\n📅 ${fechaFormateada}\n📞 ${telefono}\n\n✨ Te esperamos en StudioLux ✨`);
            
            const citas = JSON.parse(localStorage.getItem('citas') || '[]');
            citas.push({ nombre, apellido, fecha, telefono, fechaCreacion: new Date().toISOString() });
            localStorage.setItem('citas', JSON.stringify(citas));
            
            formCita.reset();
            cerrarModal(modalCita);
        });
    }

    // ============================================
    // 4. CERRAR MODALES AL HACER CLIC FUERA
    // ============================================
    window.addEventListener('click', (e) => {
        if (e.target === modalRegistro) cerrarModal(modalRegistro);
        if (e.target === modalLogin) cerrarModal(modalLogin);
        if (e.target === modalCita) cerrarModal(modalCita);
    });

    // ============================================
    // 5. MODO OSCURO
    // ============================================
    const btnModoOscuro = document.getElementById("modoOscuroFloat");
    const body = document.body;
    
    const modoOscuroGuardado = localStorage.getItem('modoOscuro');
    if (modoOscuroGuardado === 'true') {
        body.classList.add("dark");
        if (btnModoOscuro) btnModoOscuro.textContent = "☀️";
    } else {
        body.classList.remove("dark");
        if (btnModoOscuro) btnModoOscuro.textContent = "🌙";
    }
    
    if (btnModoOscuro) {
        btnModoOscuro.addEventListener("click", () => {
            body.classList.toggle("dark");
            const isDark = body.classList.contains("dark");
            btnModoOscuro.textContent = isDark ? "☀️" : "🌙";
            localStorage.setItem('modoOscuro', isDark);
        });
    }

    // ============================================
    // 6. ACTUALIZAR INTERFAZ AL CARGAR
    // ============================================
    actualizarInterfazUsuario();
});