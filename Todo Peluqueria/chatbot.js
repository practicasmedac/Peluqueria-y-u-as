document.addEventListener('DOMContentLoaded', function() {
    const chatbotBtn = document.getElementById('chatbotBtn');
    const ventanaChat = document.getElementById('ventanaChat');
    const cerrarChat = document.getElementById('cerrarChatBtn');
    const inputUsuario = document.getElementById('inputUsuario');
    const enviarBtn = document.getElementById('enviarBtn');
    const contenedorMsgs = document.getElementById('contenedorMensajes');

    if (!chatbotBtn || !ventanaChat) return;

    // Abrir/cerrar chat
    chatbotBtn.addEventListener('click', () => {
        ventanaChat.style.display = 'flex';
        setTimeout(() => inputUsuario.focus(), 200);
    });
    cerrarChat.addEventListener('click', () => {
        ventanaChat.style.display = 'none';
    });

    // Añadir mensaje al chat
    function addMensaje(texto, tipo) {
        const div = document.createElement('div');
        div.classList.add(tipo === 'user' ? 'mensaje-usuario' : 'mensaje-bot');
        div.innerText = texto;
        contenedorMsgs.appendChild(div);
        contenedorMsgs.scrollTop = contenedorMsgs.scrollHeight;
    }

    // Indicador "escribiendo..."
    function mostrarEscribiendo() {
        const escribiendoDiv = document.createElement('div');
        escribiendoDiv.classList.add('escribiendo');
        escribiendoDiv.id = 'escribiendo-indicador';
        escribiendoDiv.innerText = '✍️ Asistente está escribiendo...';
        contenedorMsgs.appendChild(escribiendoDiv);
        contenedorMsgs.scrollTop = contenedorMsgs.scrollHeight;
    }
    function ocultarEscribiendo() {
        const indicador = document.getElementById('escribiendo-indicador');
        if (indicador) indicador.remove();
    }

    // Respuestas del bot (puedes personalizarlas)
    function obtenerRespuesta(mensaje) {
        const msg = mensaje.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (msg.includes('corte') || msg.includes('pelo')) {
            return "✂️ Ofrecemos cortes modernos, clásicos y personalizados. Precios desde 10€. ¿Te gustaría reservar?";
        } else if (msg.includes('color') || msg.includes('tinte') || msg.includes('balayage')) {
            return "🎨 Nuestros servicios de coloración incluyen tintes, reflejos, balayage y mechas. Desde 30€.";
        } else if (msg.includes('manicura') || msg.includes('uñas')) {
            return "💅 Disponemos de manicura semipermanente (20€), gel (35€) y acrílico (45€). ¿Te interesa?";
        } else if (msg.includes('tratamiento') || msg.includes('capilar')) {
            return "💆 Tratamientos capilares: keratina, alisado, hidratación intensiva. Consulta precios según tu tipo de cabello.";
        } else if (msg.includes('depilacion') || msg.includes('depilación')) {
            return "🪒 Depilación con cera de alta calidad. Zonas: piernas (15€), axilas (8€), ingles (12€).";
        } else if (msg.includes('precio') || msg.includes('cuesta') || msg.includes('tarifa')) {
            return "💰 Precios generales:\n• Corte: 10€\n• Coloración: 30€\n• Manicura: 20€\n• Tratamientos: desde 25€\n• Depilación: desde 8€";
        } else if (msg.includes('horario') || msg.includes('abren') || msg.includes('atencion')) {
            return "🕒 Lunes a Viernes: 9:00 - 20:00, Sábados: 10:00 - 16:00. Domingos cerrado.";
        } else if (msg.includes('ubicacion') || msg.includes('direccion') || msg.includes('donde')) {
            return "📍 Estamos en Fuentes de Dios Lágrimas, 41019. ¡Aparcamiento gratuito!";
        } else if (msg.includes('reservar') || msg.includes('cita') || msg.includes('agendar')) {
            return "📅 Para reservar, haz clic en el botón 'Agendar cita' arriba a la derecha. ¡Te esperamos!";
        } else {
            return "🎉 ¡Hola! Soy el asistente virtual de StudioLux. Puedo ayudarte con información sobre nuestros servicios, precios, horario y ubicación. ¿Qué te gustaría saber?";
        }
    }

    // MOSTRAR SUGERENCIAS (exactamente como en tu imagen)
    function mostrarSugerencias() {
        // Eliminar sugerencias anteriores si existen
        const oldSugerencias = document.querySelector('.sugerencias');
        if (oldSugerencias) oldSugerencias.remove();

        const sugerenciasDiv = document.createElement('div');
        sugerenciasDiv.classList.add('sugerencias');
        
        // Lista de sugerencias (igual que en la imagen)
        const sugerenciasLista = [
            "Corte de pelo", "Coloración", "Manicura", 
            "Tratamientos", "Depilación", "Precios", "Horario"
        ];
        
        sugerenciasLista.forEach(sug => {
            const btn = document.createElement('button');
            btn.innerText = sug;
            btn.classList.add('sugerencia-btn');
            btn.addEventListener('click', () => {
                inputUsuario.value = sug;
                enviarMensaje();
            });
            sugerenciasDiv.appendChild(btn);
        });
        
        contenedorMsgs.appendChild(sugerenciasDiv);
        contenedorMsgs.scrollTop = contenedorMsgs.scrollHeight;
    }

    // Enviar mensaje del usuario
    function enviarMensaje() {
        const texto = inputUsuario.value.trim();
        if (texto === "") return;
        
        addMensaje(texto, 'user');
        inputUsuario.value = '';
        mostrarEscribiendo();
        
        setTimeout(() => {
            ocultarEscribiendo();
            const respuesta = obtenerRespuesta(texto);
            addMensaje(respuesta, 'bot');
            // Vuelve a mostrar sugerencias después de la respuesta
            mostrarSugerencias();
        }, 800);
    }

    // Eventos
    enviarBtn.addEventListener('click', enviarMensaje);
    inputUsuario.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') enviarMensaje();
    });

    // Mostrar sugerencias al cargar el chat (solo si el chat está abierto)
    setTimeout(() => {
        if (ventanaChat.style.display === 'flex') {
            mostrarSugerencias();
        }
    }, 500);
    
    // También mostrar sugerencias cuando se abre el chat por primera vez
    const originalOpen = chatbotBtn.onclick;
    chatbotBtn.addEventListener('click', function() {
        setTimeout(() => {
            if (document.querySelectorAll('.sugerencias').length === 0) {
                mostrarSugerencias();
            }
        }, 300);
    });
    
    console.log('✅ Chatbot StudioLux con sugerencias activado');
});
document.addEventListener('DOMContentLoaded', function() {
    const chatbotBtn = document.getElementById('chatbotBtn');
    const ventanaChat = document.getElementById('ventanaChat');
    const cerrarChat = document.getElementById('cerrarChatBtn');
    const inputUsuario = document.getElementById('inputUsuario');
    const enviarBtn = document.getElementById('enviarBtn');
    const contenedorMsgs = document.getElementById('contenedorMensajes');

    if (!chatbotBtn || !ventanaChat) return;

    // Abrir/cerrar chat
    chatbotBtn.addEventListener('click', () => {
        ventanaChat.style.display = 'flex';
        setTimeout(() => inputUsuario.focus(), 200);
        // Mostrar sugerencias si no hay
        if (document.querySelectorAll('.sugerencias').length === 0) {
            setTimeout(mostrarSugerencias, 300);
        }
    });
    cerrarChat.addEventListener('click', () => {
        ventanaChat.style.display = 'none';
    });

    // Función para añadir mensajes
    function addMensaje(texto, tipo) {
        const div = document.createElement('div');
        div.classList.add(tipo === 'user' ? 'mensaje-usuario' : 'mensaje-bot');
        div.innerText = texto;
        contenedorMsgs.appendChild(div);
        contenedorMsgs.scrollTop = contenedorMsgs.scrollHeight;
    }

    // Indicador "escribiendo..."
    let escribiendoTimeout = null;
    function mostrarEscribiendo() {
        // Evitar duplicados
        if (document.getElementById('escribiendo-indicador')) return;
        const escribiendoDiv = document.createElement('div');
        escribiendoDiv.classList.add('escribiendo');
        escribiendoDiv.id = 'escribiendo-indicador';
        escribiendoDiv.innerText = '✍️ Asistente está escribiendo...';
        contenedorMsgs.appendChild(escribiendoDiv);
        contenedorMsgs.scrollTop = contenedorMsgs.scrollHeight;
    }
    function ocultarEscribiendo() {
        const indicador = document.getElementById('escribiendo-indicador');
        if (indicador) indicador.remove();
    }

    // Respuestas inteligentes
    function obtenerRespuesta(mensaje) {
        const msg = mensaje.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (msg.includes('corte') || msg.includes('pelo')) {
            return "✂️ Ofrecemos cortes modernos, clásicos y personalizados. Precios desde 10€. ¿Te gustaría reservar?";
        } else if (msg.includes('color') || msg.includes('tinte') || msg.includes('balayage')) {
            return "🎨 Nuestros servicios de coloración incluyen tintes, reflejos, balayage y mechas. Desde 30€.";
        } else if (msg.includes('manicura') || msg.includes('uñas')) {
            return "💅 Disponemos de manicura semipermanente (20€), gel (35€) y acrílico (45€). ¿Te interesa?";
        } else if (msg.includes('tratamiento') || msg.includes('capilar')) {
            return "💆 Tratamientos capilares: keratina, alisado, hidratación intensiva. Consulta precios.";
        } else if (msg.includes('depilacion') || msg.includes('depilación')) {
            return "🪒 Depilación con cera de alta calidad. Piernas (15€), axilas (8€), ingles (12€).";
        } else if (msg.includes('precio') || msg.includes('cuesta')) {
            return "💰 Precios: Corte 10€, Coloración 30€, Manicura 20€, Depilación desde 8€.";
        } else if (msg.includes('horario')) {
            return "🕒 L-V: 9:00-20:00, Sáb: 10:00-16:00. Domingos cerrado.";
        } else if (msg.includes('ubicacion') || msg.includes('direccion')) {
            return "📍 Fuentes de Dios Lágrimas, 41019. ¡Aparcamiento gratuito!";
        } else if (msg.includes('reservar') || msg.includes('cita')) {
            return "📅 Reserva en 'Agendar cita' (arriba a la derecha). ¡Te esperamos!";
        } else {
            return "🎉 ¡Hola! Soy el asistente virtual de StudioLux. Puedo ayudarte con información sobre nuestros servicios, precios, horario y ubicación. ¿Qué te gustaría saber?";
        }
    }

    // Mostrar sugerencias (botones)
    function mostrarSugerencias() {
        const oldSugerencias = document.querySelector('.sugerencias');
        if (oldSugerencias) oldSugerencias.remove();

        const sugerenciasDiv = document.createElement('div');
        sugerenciasDiv.classList.add('sugerencias');
        const sugerenciasLista = ["Corte de pelo", "Coloración", "Manicura", "Tratamientos", "Depilación", "Precios", "Horario"];
        
        sugerenciasLista.forEach(sug => {
            const btn = document.createElement('button');
            btn.innerText = sug;
            btn.classList.add('sugerencia-btn');
            btn.addEventListener('click', () => {
                inputUsuario.value = sug;
                enviarMensaje();
            });
            sugerenciasDiv.appendChild(btn);
        });
        contenedorMsgs.appendChild(sugerenciasDiv);
        contenedorMsgs.scrollTop = contenedorMsgs.scrollHeight;
    }

    // Enviar mensaje
    function enviarMensaje() {
        const texto = inputUsuario.value.trim();
        if (texto === "") return;
        
        addMensaje(texto, 'user');
        inputUsuario.value = '';
        mostrarEscribiendo();
        
        setTimeout(() => {
            ocultarEscribiendo();
            const respuesta = obtenerRespuesta(texto);
            addMensaje(respuesta, 'bot');
            mostrarSugerencias();
        }, 800);
    }

    // Eventos
    enviarBtn.addEventListener('click', enviarMensaje);
    inputUsuario.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') enviarMensaje();
    });

    // Mostrar sugerencias al inicio (si el chat está visible)
    if (ventanaChat.style.display === 'flex') {
        setTimeout(mostrarSugerencias, 500);
    }
    
    console.log('✅ Chatbot con indicador "escribiendo..." y sugerencias activado');
});