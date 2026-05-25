// ============================================
// STUDIO LUX - CON FIREBASE Y VERIFICACIÓN DE EMAIL
// RECUPERAR CONTRASEÑA + PERFIL + CANCELAR CITA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== NOTIFICACIONES ==========
    function mostrarMensaje(texto, tipo = 'exito') {
        const div = document.createElement('div');
        div.textContent = texto;
        div.style.cssText = `
            position: fixed; top: 100px; right: 20px;
            background: ${tipo === 'exito' ? '#4CAF50' : '#f44336'};
            color: white; padding: 12px 24px; border-radius: 8px;
            z-index: 10000;
            font-family: 'Segoe UI', Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 5000);
    }
    
    // ========== ANIMACIÓN SLIDEIN ==========
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // ========== MODALES ==========
    function abrirModal(modal) {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function cerrarModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // ========== ACTUALIZAR INTERFAZ ==========
    function actualizarInterfazUsuario() {
        const usuario = auth.currentUser;
        const headerDerecha = document.querySelector('.header-derecha');
        
        const perfilExistente = document.getElementById('userProfileDisplay');
        if (perfilExistente) perfilExistente.remove();
        
        if (usuario && usuario.emailVerified) {
            const nombre = usuario.displayName || usuario.email.split('@')[0];
            
            // Span del nombre (clickable para abrir perfil)
            const userSpan = document.createElement('span');
            userSpan.id = 'userProfileDisplay';
            userSpan.style.cssText = 'color:#7f3907; font-weight:bold; background:#fde9d5; padding:5px 15px; border-radius:50px; margin-right:10px; font-family:"Playfair Display", cursive; letter-spacing:1px; cursor:pointer;';
            userSpan.innerHTML = `👤 ${nombre}`;
            userSpan.onclick = async () => {
                await cargarPerfil();
                abrirModal(modalPerfil);
            };
            
            // Botón de cerrar sesión
            const logoutBtn = document.createElement('button');
            logoutBtn.textContent = 'Salir';
            logoutBtn.className = 'btn-cita-header';
            logoutBtn.id = 'btnCerrarSesion';
            logoutBtn.style.cssText = 'padding: 6px 18px; font-family:"Playfair Display", cursive; letter-spacing:2px; background: linear-gradient(135deg, #ffbd6c 0%, #b86c40 100%); border: none; border-radius: 50px; cursor: pointer; color: #fffaf5; box-shadow: 0 4px 12px rgba(127, 57, 7, 0.2);';
            logoutBtn.onclick = async function() {
                await auth.signOut();
                mostrarMensaje('👋 Sesión cerrada');
                location.reload();
            };
            
            // Ocultar botones de registro y login
            const btnReg = document.getElementById('btnRegistrarseHeader');
            const btnLog = document.getElementById('btnIniciarSesionHeader');
            if (btnReg) btnReg.style.display = 'none';
            if (btnLog) btnLog.style.display = 'none';
            
            // Insertar elementos
            const btnAgendar = document.getElementById('btnAgendarHeader');
            headerDerecha.insertBefore(userSpan, btnAgendar);
            headerDerecha.insertBefore(logoutBtn, btnAgendar);
        } else {
            const btnReg = document.getElementById('btnRegistrarseHeader');
            const btnLog = document.getElementById('btnIniciarSesionHeader');
            if (btnReg) btnReg.style.display = 'inline-block';
            if (btnLog) btnLog.style.display = 'inline-block';
            
            const usuarioNoVerificado = auth.currentUser;
            if (usuarioNoVerificado && !usuarioNoVerificado.emailVerified) {
                mostrarMensaje('⚠️ Por favor, verifica tu correo electrónico. Revisa tu bandeja de entrada.', 'error');
            }
        }
    }
    
    // ============================================
    // 1. REGISTRO CON VERIFICACIÓN DE EMAIL
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
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('regNombre').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const telefono = document.getElementById('regTelefono').value.trim();
            const password = document.getElementById('regPassword').value;

            if (!nombre || !email || !telefono || !password) {
                mostrarMensaje('❌ Completa todos los campos', 'error');
                return;
            }
            if (password.length < 6) {
                mostrarMensaje('❌ La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            if (!/^\d{9,}$/.test(telefono)) {
                mostrarMensaje('❌ Teléfono inválido (mínimo 9 dígitos)', 'error');
                return;
            }

            try {
                const resultado = await auth.createUserWithEmailAndPassword(email, password);
                const usuario = resultado.user;
                await usuario.updateProfile({ displayName: nombre });
                await usuario.sendEmailVerification();
                await db.collection('usuarios').doc(usuario.uid).set({
                    nombre: nombre,
                    email: email,
                    telefono: telefono,
                    fechaRegistro: new Date(),
                    emailVerificado: false
                });
                
                mostrarMensaje(`✅ ¡Registro exitoso! Se ha enviado un correo de verificación a ${email}. Revisa tu bandeja de entrada.`);
                formRegistro.reset();
                cerrarModal(modalRegistro);
                await auth.signOut();
                
            } catch(error) {
                if (error.code === 'auth/email-already-in-use') {
                    mostrarMensaje('❌ Este correo ya está registrado', 'error');
                } else if (error.code === 'auth/invalid-email') {
                    mostrarMensaje('❌ Correo electrónico inválido', 'error');
                } else {
                    mostrarMensaje('❌ Error: ' + error.message, 'error');
                }
            }
        });
    }

    // ============================================
    // 2. INICIAR SESIÓN (Y REDIRECCIÓN ADMIN)
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
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                mostrarMensaje('❌ Completa todos los campos', 'error');
                return;
            }

            try {
                const resultado = await auth.signInWithEmailAndPassword(email, password);
                const usuario = resultado.user;
                
                // REDIRECCIÓN ADMINISTRADOR MANUAL (Al hacer clic en el botón)
                if (usuario.email === 'studiolux331@gmail.com') { 
                    mostrarMensaje('👑 Bienvenido Administrador');
                    setTimeout(() => { window.location.href = 'admin.html'; }, 1000);
                    return;
                }
                
                if (!usuario.emailVerified) {
                    mostrarMensaje('⚠️ Por favor, verifica tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.', 'error');
                    await auth.signOut();
                    return;
                }
                
                mostrarMensaje(`✅ ¡Bienvenid@ ${usuario.displayName || email}!`);
                formLogin.reset();
                cerrarModal(modalLogin);
                actualizarInterfazUsuario();
                
            } catch(error) {
                if (error.code === 'auth/user-not-found') {
                    mostrarMensaje('❌ Usuario no encontrado', 'error');
                } else if (error.code === 'auth/wrong-password') {
                    mostrarMensaje('❌ Contraseña incorrecta', 'error');
                } else {
                    mostrarMensaje('❌ Error al iniciar sesión', 'error');
                }
            }
        });
    }

    // ============================================
    // 3. RECUPERAR CONTRASEÑA
    // ============================================
    const modalReset = document.getElementById('modalResetPassword');
    const btnOlvide = document.getElementById('btnOlvidePassword');
    const cerrarReset = document.getElementById('cerrarResetBtn');
    const formReset = document.getElementById('formResetPassword');

    if (btnOlvide) {
        btnOlvide.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarModal(modalLogin);
            abrirModal(modalReset);
        });
    }

    if (cerrarReset) {
        cerrarReset.addEventListener('click', () => {
            cerrarModal(modalReset);
        });
    }

    if (formReset) {
        formReset.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value.trim();
            
            if (!email) {
                mostrarMensaje('❌ Introduce tu correo electrónico', 'error');
                return;
            }
            
            try {
                await auth.sendPasswordResetEmail(email);
                mostrarMensaje(`✅ Se ha enviado un correo de recuperación a ${email}. Revisa tu bandeja de entrada.`);
                formReset.reset();
                cerrarModal(modalReset);
            } catch(error) {
                if (error.code === 'auth/user-not-found') {
                    mostrarMensaje('❌ No existe una cuenta con este correo', 'error');
                } else {
                    mostrarMensaje('❌ Error: ' + error.message, 'error');
                }
            }
        });
    }

    // ============================================
    // 4. PERFIL DE USUARIO + MIS CITAS (VERSIÓN SIMPLIFICADA - SIN ÍNDICES)
    // ============================================
    const modalPerfil = document.getElementById('modalPerfil');
    const cerrarPerfil = document.getElementById('cerrarPerfilBtn');
    const formPerfil = document.getElementById('formPerfil');

    // Cargar mis citas - VERSIÓN SIMPLIFICADA (solo busca por email, filtra en JavaScript)
    async function cargarMisCitas() {
        const usuario = auth.currentUser;
        if (!usuario) {
            console.log("No hay usuario logueado");
            return;
        }
        
        console.log("Email del usuario:", usuario.email);
        
        const container = document.getElementById('misCitasContainer');
        if (!container) return;
        
        const hoy = new Date().toISOString().split('T')[0];
        
        try {
            // 🔧 CONSULTA SIMPLE: solo por email (NO necesita índice compuesto)
            const snapshot = await db.collection('citas')
                .where('usuarioEmail', '==', usuario.email)
                .get();
            
            console.log("Total de citas encontradas:", snapshot.size);
            
            if (snapshot.empty) {
                container.innerHTML = '<p style="color:#999;">No tienes citas. Agenda una primera cita.</p>';
                return;
            }
            
            // Filtrar y ordenar manualmente en JavaScript
            const citasFuturas = [];
            snapshot.forEach(doc => {
                const cita = doc.data();
                console.log("Cita encontrada:", cita);
                
                // Filtrar por fecha futura y estado válido
                if (cita.fecha >= hoy && (cita.estado === 'pendiente' || cita.estado === 'confirmada')) {
                    citasFuturas.push({ id: doc.id, ...cita });
                }
            });
            
            // Ordenar por fecha
            citasFuturas.sort((a, b) => a.fecha.localeCompare(b.fecha));
            
            console.log("Citas futuras y pendientes:", citasFuturas.length);
            
            if (citasFuturas.length === 0) {
                container.innerHTML = '<p style="color:#999;">No tienes citas próximas.</p>';
                return;
            }
            
            let html = '<div style="display:flex; flex-direction:column; gap:15px;">';
            
            citasFuturas.forEach(cita => {
                const fechaObj = new Date(cita.fecha);
                const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });
                
                html += `
                    <div id="cita-${cita.id}" style="background:#fef5e8; border-radius:15px; padding:15px; border-left:4px solid #b86c40;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
                            <div>
                                <strong style="color:#7f3907;">📅 ${fechaFormateada}</strong><br>
                                <span>👤 ${cita.nombre} ${cita.apellido || ''}</span><br>
                                <span>📞 ${cita.telefono}</span><br>
                                <span style="font-size:12px; color:${cita.estado === 'pendiente' ? 'orange' : 'green'};">${cita.estado === 'pendiente' ? '⏳ Pendiente' : '✅ Confirmada'}</span>
                            </div>
                            <button onclick="cancelarCita('${cita.id}')" style="background:#f44336; color:white; border:none; padding:8px 20px; border-radius:25px; cursor:pointer; font-family:'Playfair Display', cursive;">
                                ❌ Cancelar
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            container.innerHTML = html;
            
        } catch(error) {
            console.error("Error detallado:", error);
            container.innerHTML = '<p style="color:#f44336;">Error al cargar tus citas. Mira la consola (F12).</p>';
        }
    }

    // Cancelar cita
    window.cancelarCita = async function(citaId) {
        if (!confirm('¿Estás seguro de que quieres cancelar esta cita?')) return;
        
        try {
            await db.collection('citas').doc(citaId).update({
                estado: 'cancelada'
            });
            
            mostrarMensaje('✅ Cita cancelada correctamente');
            await cargarMisCitas();
            
        } catch(error) {
            mostrarMensaje('❌ Error al cancelar la cita', 'error');
        }
    };

    // Cargar perfil
    async function cargarPerfil() {
        const usuario = auth.currentUser;
        if (!usuario) return;
        
        document.getElementById('perfilNombre').value = usuario.displayName || '';
        document.getElementById('perfilEmail').value = usuario.email || '';
        
        const userDoc = await db.collection('usuarios').doc(usuario.uid).get();
        if (userDoc.exists) {
            const data = userDoc.data();
            document.getElementById('perfilTelefono').value = data.telefono || '';
            
            if (data.fechaRegistro) {
                let fecha;
                if (data.fechaRegistro.seconds) {
                    fecha = new Date(data.fechaRegistro.seconds * 1000);
                } else {
                    fecha = new Date(data.fechaRegistro);
                }
                document.getElementById('perfilFecha').value = fecha.toLocaleDateString('es-ES');
            }
        }
        
        await cargarMisCitas();
    }

    if (formPerfil) {
        formPerfil.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usuario = auth.currentUser;
            const nuevoNombre = document.getElementById('perfilNombre').value.trim();
            const nuevoTelefono = document.getElementById('perfilTelefono').value.trim();
            
            try {
                await usuario.updateProfile({ displayName: nuevoNombre });
                await db.collection('usuarios').doc(usuario.uid).update({
                    nombre: nuevoNombre,
                    telefono: nuevoTelefono
                });
                mostrarMensaje('✅ Perfil actualizado correctamente');
                cerrarModal(modalPerfil);
                location.reload();
            } catch(error) {
                mostrarMensaje('❌ Error: ' + error.message, 'error');
            }
        });
    }

    if (cerrarPerfil) {
        cerrarPerfil.addEventListener('click', () => {
            cerrarModal(modalPerfil);
        });
    }

    // ============================================
    // 5. MODAL AGENDAR CITA
    // ============================================
    const modalCita = document.getElementById('modalCita');
    const btnAgendar = document.getElementById('btnAgendarHeader');
    const cerrarModalCita = document.getElementById('cerrarModalBtn');
    const formCita = document.getElementById('formCita');

    if (btnAgendar) {
        btnAgendar.addEventListener('click', (e) => {
            e.preventDefault();
            const usuario = auth.currentUser;
            if (!usuario || !usuario.emailVerified) {
                mostrarMensaje('⚠️ Debes iniciar sesión y verificar tu correo para agendar una cita', 'error');
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
        formCita.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const usuario = auth.currentUser;
            if (!usuario || !usuario.emailVerified) {
                mostrarMensaje('⚠️ Debes iniciar sesión para agendar una cita', 'error');
                cerrarModal(modalCita);
                abrirModal(modalLogin);
                return;
            }
            
            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const fecha = document.getElementById('fecha').value;
            const telefono = document.getElementById('telefono').value.trim();

            if (!nombre || !apellido || !fecha || !telefono) {
                mostrarMensaje('❌ Completa todos los campos', 'error');
                return;
            }
            if (!/^\d{9,}$/.test(telefono)) {
                mostrarMensaje('❌ Teléfono inválido (mínimo 9 dígitos)', 'error');
                return;
            }
            
            const fechaObj = new Date(fecha);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            if (fechaObj < hoy) {
                mostrarMensaje('❌ La fecha no puede ser anterior a hoy', 'error');
                return;
            }

            try {
                await db.collection('citas').add({
                    nombre: nombre,
                    apellido: apellido,
                    fecha: fecha,
                    telefono: telefono,
                    usuarioId: usuario.uid,
                    usuarioEmail: usuario.email,
                    estado: 'pendiente',
                    fechaRegistro: new Date()
                });
                
                const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                });
                
                mostrarMensaje(`✅ Cita agendada para el ${fechaFormateada}`);
                formCita.reset();
                cerrarModal(modalCita);
                
            } catch(error) {
                mostrarMensaje('❌ Error al guardar la cita', 'error');
            }
        });
    }

    // ============================================
    // 6. CERRAR MODALES
    // ============================================
    window.addEventListener('click', (e) => {
        if (e.target === modalRegistro) cerrarModal(modalRegistro);
        if (e.target === modalLogin) cerrarModal(modalLogin);
        if (e.target === modalReset) cerrarModal(modalReset);
        if (e.target === modalPerfil) cerrarModal(modalPerfil);
        if (e.target === modalCita) cerrarModal(modalCita);
    });

    // ============================================
    // 7. MODO OSCURO
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
    // 8. ESCUCHAR CAMBIOS EN AUTH
    // ============================================
    auth.onAuthStateChanged((usuario) => {
        actualizarInterfazUsuario();
        
        // REDIRECCIÓN AUTOMÁTICA SEGURA PARA EL ADMIN
        if (usuario && usuario.email === 'studiolux331@gmail.com') {
            // Verificamos que no estemos ya en la página admin para evitar bucles infinitos
            if (!window.location.pathname.includes('admin.html')) {
                window.location.href = 'admin.html';
            }
        }
    });
});