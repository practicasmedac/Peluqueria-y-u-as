// chatbot.js - StudioLux Asistente VERSIÓN COMPLETA


let estadoChat = {
    contexto: null,
    paso: 0,
    datosReserva: {}
};

// Base de conocimientos estructurada (CON PRECIOS ACTUALIZADOS Y RESPUESTAS MEJORADAS)
const conocimientos = {
    servicios: {
        pelo: {
            palabras: ["pelo", "cabello", "peluqueria", "peluquería", "cortar", "corte", "peinado", "tinte", "color", "reflejos", "balayage", "mechas", "alisar", "alisado", "keratina", "rizar", "rizos", "lavar", "lavado", "secar", "secado", "planchar", "planchado", "mascarilla", "hidratar", "hidratación", "brillo", "caspa", "caída", "volumen"],
            nombre: "Peluquería",
            precio: "desde 10€",
            duracion: "30-90 minutos",
            descripcion: "Corte y peinado (desde 10€), coloración, reflejos, balayage o mechas (desde 30€), tratamientos capilares como keratina o alisado (consultar precio según largo), y mascarillas de hidratación profunda."
        },
        uñas: {
            palabras: ["uña", "uñas", "manicura", "pedicura", "semipermanente", "gel", "acrílico", "esmalte", "pintar", "limar", "cutícula", "decoración", "francesa", "pintauñas"],
            nombre: "Manicura y Pedicura",
            precio: "desde 20€",
            duracion: "45-60 minutos",
            descripcion: "Manicura y pedicura desde 20€. Trabajamos con esmalte semipermanente, gel y acrílico. También hacemos decoración, uñas francesas y cuidados de cutícula."
        },
        maquillaje: {
            palabras: ["maquillaje", "maquillar", "pintar", "base", "sombras", "labios", "pestañas", "cejas", "colorete", "polvos", "novia", "novias", "social", "fiesta", "evento", "sesión", "sesion"],
            nombre: "Maquillaje",
            precio: "desde 25€",
            duracion: "30-60 minutos",
            descripcion: "Maquillaje desde 25€. Hacemos maquillaje social, para novias, para eventos y sesiones de fotos. Trabajamos con productos de alta calidad."
        },
        tratamiento: {
            palabras: ['tratamiento', 'keratina', 'alisado', 'hidratacion', 'capilar', 'tratamiento capilar', 'mascarilla', 'hidratar', 'hidratación', 'brillo', 'caspa', 'caída', 'volumen'],
            nombre: "Tratamientos Capilares",
            precio: "desde 35€",
            duracion: "45-90 minutos",
            descripcion: "Keratina, alisado, hidratación profunda, mascarillas. Precio a consultar según largo del cabello."
        },
        depilacion: {
            palabras: ['depilación', 'depilacion', 'depilar', 'cera', 'facial', 'limpieza', 'cutis', 'puntos negros', 'brillo facial', 'tratamiento facial', 'rostro'],
            nombre: "Depilación y Facial",
            precio: "desde 15€",
            duracion: "15-30 minutos",
            descripcion: "Depilación con cera (precio a consultar según zona) y tratamientos faciales: limpieza profunda, hidratación y revitalización."
        }
    },
    infoGeneral: {
        precios: {
            palabras: ["precio", "precios", "coste", "cuesta", "valor", "tarifa", "cuánto", "cuanto", "importe", "presupuesto"],
            respuesta: "💰 Te resumo precios orientativos: Corte y peinado desde 10€ · Coloración desde 30€ · Manicura desde 20€ · Pedicura desde 20€ · Maquillaje desde 25€ · Tratamientos capilares desde 35€ · Depilación desde 15€. Para servicios específicos, consulta presupuesto según necesidades."
        },
        horario: {
            palabras: ['horario', 'hora', 'abren', 'abierto', 'cierran', 'cerrado', 'horas', 'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'sabado'],
            respuesta: "🕒 Estamos abiertos de lunes a viernes de 9:00 a 20:00, y los sábados de 10:00 a 16:00. Los domingos cerramos. ¿Te gustaría pedir cita en algún horario concreto?"
        },
        ubicacion: {
            palabras: ['donde', 'dónde', 'ubicación', 'dirección', 'lugar', 'calle', 'están', 'encuentra', 'llegar', 'cómo', 'como', 'mapa', 'cerca', 'lejos', 'aparque', 'aparcamiento', 'parking'],
            respuesta: "📍 Estamos en Fuentes de Dios Lágrimas, 41019. Tenemos aparcamiento gratuito. Si necesitas indicaciones más exactas para llegar, dime desde qué zona vienes y te ayudo encantada."
        },
        cita: {
            palabras: ['cita', 'reserva', 'reservar', 'agendar', 'apuntar', 'turno', 'disponible', 'libre', 'día', 'semana', 'mañana', 'tarde', 'próximo', 'proximo'],
            respuesta: "📅 Para agendar cita solo tienes que hacer clic en el botón 'Agendar cita' que está arriba a la derecha. Allí pones tu nombre, apellido, teléfono y el día que prefieras. Atendemos de lunes a viernes de 9:00 a 20:00, y sábados de 10:00 a 16:00."
        },
        contacto: {
            palabras: ['teléfono', 'telefono', 'whatsapp', 'móvil', 'movil', 'email', 'correo', 'contacto', 'llamar', 'escribir', 'mensaje', 'número', 'numero'],
            respuesta: "📞 Puedes contactarnos por teléfono llamando al +123 456 7890, o por WhatsApp en el +123 456 7891. También por email en contacto@studiolux.com. ¿Prefieres que te ayude con algo concreto por aquí?"
        },
        servicios: {
            palabras: ['servicios', 'ofrecen', 'hacen', 'trabajan', 'carta', 'lista', 'qué', 'que', 'tipos', 'clases'],
            respuesta: "🌟 En StudioLux ofrecemos: corte y peinado, coloración (tintes, reflejos, balayage), manicura y pedicura, tratamientos capilares (keratina, alisado), maquillaje, depilación con cera y limpiezas faciales. ¿Te interesa alguno en especial?"
        },
        saludo: {
            palabras: ['hola', 'buenas', 'buen día', 'buenos días', 'buenas tardes', 'buenas noches', 'hey', 'que tal', 'cómo estás', 'como estas', 'saludos', 'gracias', 'adios', 'adiós', 'hasta luego', 'chao', 'bye'],
            respuesta: "🌸 ¡Hola! Encantada de atenderte. Cuéntame qué necesitas saber: cortes de pelo, color, uñas, precios, horarios, dónde estamos... Estoy aquí para ayudarte."
        }
    }
};

// Función de normalización de texto
function normalizarTexto(texto) {
    let normalizado = texto.toLowerCase();
    normalizado = normalizado.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    normalizado = normalizado.replace(/[¿?¡!.,;:()]/g, '');
    normalizado = normalizado.trim();
    return normalizado;
}

// Detectar servicios
function detectarServicio(texto) {
    const normalizado = normalizarTexto(texto);
    const serviciosEncontrados = [];
    
    for (const [key, servicio] of Object.entries(conocimientos.servicios)) {
        for (const palabra of servicio.palabras) {
            if (normalizado.includes(palabra.toLowerCase())) {
                serviciosEncontrados.push(key);
                break;
            }
        }
    }
    
    return serviciosEncontrados;
}

function detectarInfoGeneral(texto) {
    const normalizado = normalizarTexto(texto);
    
    for (const [key, info] of Object.entries(conocimientos.infoGeneral)) {
        for (const palabra of info.palabras) {
            if (normalizado.includes(palabra.toLowerCase())) {
                return key;
            }
        }
    }
    
    return null;
}

// Sistema de sugerencias rápidas
function mostrarSugerencias(opciones) {
    const contenedor = document.getElementById('contenedorMensajes');
    const sugerenciasDiv = document.createElement('div');
    sugerenciasDiv.className = 'sugerencias';
    
    opciones.forEach(opcion => {
        const btn = document.createElement('button');
        btn.textContent = opcion;
        btn.className = 'sugerencia-btn';
        btn.onclick = () => {
            const input = document.getElementById('inputUsuario');
            input.value = opcion;
            window.enviarMensaje();
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = '', 100);
        };
        sugerenciasDiv.appendChild(btn);
    });
    
    contenedor.appendChild(sugerenciasDiv);
    contenedor.scrollTop = contenedor.scrollHeight;
    
    setTimeout(() => {
        if (sugerenciasDiv.parentNode) {
            sugerenciasDiv.style.opacity = '0';
            setTimeout(() => {
                if (sugerenciasDiv.parentNode) sugerenciasDiv.remove();
            }, 300);
        }
    }, 30000);
}

// Indicador de escritura
function mostrarEscribiendo() {
    const contenedor = document.getElementById('contenedorMensajes');
    const escribiendoDiv = document.createElement('div');
    escribiendoDiv.className = 'mensaje-bot escribiendo';
    escribiendoDiv.innerHTML = '✍️ escribiendo...';
    escribiendoDiv.id = 'indicadorEscritura';
    contenedor.appendChild(escribiendoDiv);
    contenedor.scrollTop = contenedor.scrollHeight;
    return escribiendoDiv;
}

function ocultarEscribiendo() {
    const escribiendo = document.getElementById('indicadorEscritura');
    if (escribiendo) escribiendo.remove();
}

function enviarRespuestaBot(texto, sugerencias = null) {
    const escribiendo = mostrarEscribiendo();
    const tiempoRespuesta = Math.min(800 + texto.length * 10, 2000);
    
    setTimeout(() => {
        ocultarEscribiendo();
        
        const contenedor = document.getElementById('contenedorMensajes');
        const divBot = document.createElement('div');
        divBot.className = 'mensaje-bot';
        divBot.innerText = texto;
        contenedor.appendChild(divBot);
        contenedor.scrollTop = contenedor.scrollHeight;
        
        if (sugerencias && sugerencias.length > 0) {
            setTimeout(() => {
                mostrarSugerencias(sugerencias);
            }, 500);
        }
    }, tiempoRespuesta);
}

// Función para obtener respuesta (compatibilidad)
function obtenerRespuesta(mensajeUsuario) {
    if (!mensajeUsuario || mensajeUsuario.trim() === "") {
        return "¿En qué puedo ayudarte? Dime algo sobre pelo, uñas, precios, cita...";
    }
    
    const respuesta = generarRespuesta(mensajeUsuario);
    return respuesta.texto;
}

// Generar respuesta
function generarRespuesta(texto) {
    const normalizado = normalizarTexto(texto);
    
    if (estadoChat.contexto === "esperando_respuesta_cita") {
        estadoChat.contexto = null;
    }
    
    // Detectar información general primero
    const infoGeneral = detectarInfoGeneral(texto);
    if (infoGeneral) {
        const respuesta = conocimientos.infoGeneral[infoGeneral].respuesta;
        if (infoGeneral === 'cita') {
            return { texto: respuesta, sugerencias: ['Horario', 'Dirección', 'Servicios'] };
        }
        if (infoGeneral === 'precios') {
            return { texto: respuesta, sugerencias: ['Corte', 'Color', 'Manicura', 'Tratamientos', 'Depilación'] };
        }
        if (infoGeneral === 'saludo') {
            return { texto: respuesta, sugerencias: ['Corte de pelo', 'Precios', 'Horario', 'Cita'] };
        }
        return { 
            texto: respuesta, 
            sugerencias: ['Corte', 'Color', 'Manicura', 'Tratamientos', 'Depilación', 'Precios'] 
        };
    }
    
    // Detectar servicios
    const serviciosDetectados = detectarServicio(texto);
    
    if (serviciosDetectados.length > 0) {
        const servicioKey = serviciosDetectados[0];
        const servicio = conocimientos.servicios[servicioKey];
        
        let respuesta = "";
        
        if (normalizado.includes('precio') || normalizado.includes('cuesta') || normalizado.includes('costo')) {
            respuesta = `${servicio.descripcion} Precio: ${servicio.precio}. Duración: ${servicio.duracion}.`;
        } else {
            respuesta = `${servicio.descripcion} Precio: ${servicio.precio}. Duración: ${servicio.duracion}. ¿Quieres que te cuente más sobre este servicio?`;
        }
        
        let sugerencias = ['Otro servicio', 'Precios', 'Horario', 'Dirección', 'Cita'];
        
        return { 
            texto: respuesta, 
            sugerencias: sugerencias
        };
    }
    
    // Cómo reservar
    if (normalizado.includes('como reservo') || normalizado.includes('como agendo') || normalizado.includes('como hago para reservar')) {
        return {
            texto: "📅 Para reservar una cita, usa el botón 'Agendar Cita' que se encuentra en la parte superior de la página web. Es muy fácil y rápido. Allí pones tu nombre, apellido, teléfono y el día que prefieras.",
            sugerencias: ['Ver servicios', 'Horario', 'Dirección', 'Precios']
        };
    }
    
    // Si no se detecta nada
    return {
        texto: "😊 Perdona, no entendí del todo. ¿Podrías contarme más sobre qué servicio te interesa? Tenemos: corte y peinado, coloración, uñas, tratamientos capilares, maquillaje, depilación... También puedo darte precios, horarios o ayudarte con tu cita. ¡Lo que necesites!",
        sugerencias: ['Corte de pelo', 'Coloración', 'Manicura', 'Tratamientos', 'Depilación', 'Precios', 'Horario', 'Dirección']
    };
}

// --- Control del chat en la página ---
document.addEventListener('DOMContentLoaded', function() {
    const ventana = document.getElementById('ventanaChat');
    const boton = document.getElementById('chatbotBtn');
    const cerrar = document.getElementById('cerrarChatBtn');
    const input = document.getElementById('inputUsuario');
    const enviar = document.getElementById('enviarBtn');
    const contenedor = document.getElementById('contenedorMensajes');
    
    if (!ventana || !boton || !cerrar || !input || !enviar || !contenedor) {
        console.error('Falta algún elemento del chatbot');
        return;
    }
    
    let chatAbierto = false;
    
    // Mensaje de bienvenida
    setTimeout(() => {
        if (contenedor.children.length === 0) {
            enviarRespuestaBot(
                "🌸 ¡Hola! Soy el asistente virtual de StudioLux. Puedo ayudarte con información sobre nuestros servicios, precios, horario y ubicación. ¿Qué te gustaría saber?",
                ['Corte de pelo', 'Coloración', 'Manicura', 'Tratamientos', 'Depilación', 'Precios', 'Horario']
            );
        }
    }, 500);
    
    // Abrir/cerrar chat
    boton.onclick = function() {
        if (chatAbierto) {
            ventana.style.display = 'none';
            chatAbierto = false;
        } else {
            ventana.style.display = 'block';
            chatAbierto = true;
            if (contenedor.children.length === 0) {
                enviarRespuestaBot(
                    "👋 Bienvenido de nuevo. ¿En qué puedo ayudarte hoy?",
                    ['Precios', 'Dirección', 'Reservar cita', 'Horario', 'Tratamientos', 'Depilación']
                );
            }
            setTimeout(() => input.focus(), 100);
        }
    };
    
    cerrar.onclick = function() {
        ventana.style.display = 'none';
        chatAbierto = false;
    };
    
    // Enviar mensaje
    window.enviarMensaje = function() {
        const texto = input.value.trim();
        if (texto === "") return;
        
        // Mostrar mensaje usuario
        const divUsuario = document.createElement('div');
        divUsuario.className = 'mensaje-usuario';
        divUsuario.innerText = texto;
        contenedor.appendChild(divUsuario);
        input.value = "";
        contenedor.scrollTop = contenedor.scrollHeight;
        
        // Generar respuesta
        const respuesta = generarRespuesta(texto);
        enviarRespuestaBot(respuesta.texto, respuesta.sugerencias);
    };
    
    // Eventos
    enviar.onclick = window.enviarMensaje;
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            window.enviarMensaje();
        }
    });
});
