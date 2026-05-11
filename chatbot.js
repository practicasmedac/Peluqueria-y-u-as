// chatbot.js - StudioLux Asistente con reconocimiento de lenguaje natural
// Diseñado para personas mayores: entiende frases completas, sin palabras clave exactas

const botResponses = {
    // Servicios de peluquería / pelo
    pelo: {
        keywords: ["pelo", "cabello", "peluqueria", "peluquería", "cortar", "corte", "peinado", "tinte", "color", "reflejos", "balayage", "mechas", "alisar", "alisado", "keratina", "rizar", "rizos", "lavar", "lavado", "secar", "secado", "planchar", "planchado", "mascarilla", "hidratar", "hidratación", "brillo", "caspa", "caída", "volumen"],
        response: "✂️ Para el cabello ofrecemos: corte y peinado (desde 10€), coloración, reflejos, balayage o mechas (desde 30€), tratamientos capilares como keratina o alisado (consultar precio según largo), y mascarillas de hidratación profunda. ¿Quieres que te cuente más sobre alguno de estos servicios?"
    },
    
    // Uñas
    uñas: {
        keywords: ["uña", "uñas", "manicura", "pedicura", "semipermanente", "gel", "acrílico", "esmalte", "pintar", "limar", "cutícula", "decoración", "francesa", "pintauñas"],
        response: "💅 Para uñas tenemos: manicura y pedicura desde 20€. Trabajamos con esmalte semipermanente, gel y acrílico. También hacemos decoración, uñas francesas y cuidados de cutícula. ¿Te gustaría que te explique los precios más detallados?"
    },
    
    // Precios
    precios: {
        keywords: ["precio", "precios", "coste", "cuesta", "valor", "tarifa", "cuánto", "cuanto", "importe", "presupuesto"],
        response: "💰 Te resumo precios orientativos: Corte y peinado desde 10€ · Coloración desde 30€ · Manicura desde 20€ · Pedicura desde 20€ · Maquillaje desde 25€. Para tratamientos capilares específicos (keratina, alisado) y depilación, consulta presupuesto según necesidades. ¿Algún servicio en concreto que te interese?"
    },
    
    // Citas / reservas
    citas: {
        keywords: ["cita", "reserva", "agendar", "apuntar", "turno", "horario", "cuándo", "cuando", "disponible", "libre", "día", "semana", "mañana", "tarde", "próximo", "proximo"],
        response: "📅 Para agendar cita solo tienes que hacer clic en el botón 'Agendar cita' que está arriba a la derecha. Allí pones tu nombre, apellido, teléfono y el día que prefieras. Atendemos de lunes a viernes de 9:00 a 20:00, y sábados de 10:00 a 16:00. ¿Necesitas ayuda para pedir la cita?"
    },
    
    // Horarios
    horarios: {
        keywords: ["horario", "abren", "abierto", "cierran", "cerrado", "hora", "horas", "mañana", "tarde", "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "sabado"],
        response: "🕒 Estamos abiertos de lunes a viernes de 9:00 a 20:00, y los sábados de 10:00 a 16:00. Los domingos cerramos. ¿Te gustaría pedir cita en algún horario concreto?"
    },
    
    // Ubicación / dirección
    ubicacion: {
        keywords: ["donde", "dónde", "ubicación", "dirección", "lugar", "calle", "están", "encuentra", "llegar", "cómo", "como", "mapa", "cerca", "lejos", "aparque", "aparcamiento", "parking"],
        response: "📍 Estamos en Fuentes de Dios Lágrimas, 41019. Tenemos aparcamiento gratuito. Si necesitas indicaciones más exactas para llegar, dime desde qué zona vienes y te ayudo encantada."
    },
    
    // Contacto / teléfono / WhatsApp
    contacto: {
        keywords: ["teléfono", "telefono", "whatsapp", "móvil", "movil", "email", "correo", "contacto", "llamar", "escribir", "mensaje", "número", "numero"],
        response: "📞 Puedes contactarnos por teléfono llamando al +123 456 7890, o por WhatsApp en el +123 456 7891. También por email en contacto@studiolux.com. ¿Prefieres que te ayude con algo concreto por aquí?"
    },
    
    // Maquillaje
    maquillaje: {
        keywords: ["maquillaje", "maquillar", "pintar", "base", "sombras", "labios", "pestañas", "cejas", "colorete", "polvos", "novia", "novias", "social", "fiesta", "evento", "sesión", "sesion"],
        response: "💄 Ofrecemos maquillaje desde 25€. Hacemos maquillaje social, para novias, para eventos y sesiones de fotos. Trabajamos con productos de alta calidad y podemos adaptarnos a tu estilo. ¿Te gustaría saber más detalles?"
    },
    
    // Depilación y facial
    depilacion: {
        keywords: ["depilación", "depilar", "cera", "facial", "limpieza", "cutis", "puntos negros", "brillo facial", "tratamiento facial", "rostro"],
        response: "✨ Para depilación usamos cera (precio a consultar según zona) y para tratamientos faciales ofrecemos limpieza profunda, hidratación y revitalización. ¿Qué zona o tratamiento te interesa más?"
    },
    
    // Servicios en general
    servicios: {
        keywords: ["servicios", "ofrecen", "hacen", "trabajan", "carta", "lista", "qué", "que", "tipos", "clases"],
        response: "🌟 En StudioLux ofrecemos: corte y peinado, coloración (tintes, reflejos, balayage), manicura y pedicura, tratamientos capilares (keratina, alisado), maquillaje, depilación con cera y limpiezas faciales. ¿Te interesa alguno en especial?"
    },
    
    // Saludo/despedida
    saludo: {
        keywords: ["hola", "buenas", "buen día", "buenos días", "buenas tardes", "buenas noches", "hey", "que tal", "cómo estás", "como estas", "saludos", "gracias", "adios", "adiós", "hasta luego", "chao", "bye"],
        response: "🌸 ¡Hola! Encantada de atenderte. Cuéntame qué necesitas saber: cortes de pelo, color, uñas, precios, horarios, dónde estamos... Estoy aquí para ayudarte."
    },
    
    // Por defecto (cuando no entiende bien)
    default: {
        response: "😊 Perdona, no entendí del todo. ¿Podrías contarme más sobre qué servicio te interesa? Tenemos: corte y peinado, coloración, uñas, tratamientos capilares, maquillaje, depilación... También puedo darte precios, horarios o ayudarte con tu cita. ¡Lo que necesites!"
    }
};

// Función para detectar qué intención tiene el mensaje del usuario
function detectarIntencion(mensaje) {
    // Limpiar y normalizar el mensaje
    let texto = mensaje.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Recorrer todas las categorías buscando coincidencias
    let mejorCoincidencia = null;
    let maxPuntos = 0;
    
    for (let [intencion, data] of Object.entries(botResponses)) {
        if (intencion === "default") continue;
        
        let puntos = 0;
        for (let keyword of data.keywords) {
            if (texto.includes(keyword.toLowerCase())) {
                // Si la palabra clave está en el mensaje, sumamos puntos
                puntos++;
                // Bonus si la palabra aparece más veces
                let regex = new RegExp(keyword.toLowerCase(), "g");
                let ocurrencias = (texto.match(regex) || []).length;
                puntos += (ocurrencias - 1) * 0.5;
            }
        }
        
        if (puntos > maxPuntos) {
            maxPuntos = puntos;
            mejorCoincidencia = intencion;
        }
    }
    
    // Si hemos encontrado algo con al menos 1 punto, devolvemos esa intención
    if (maxPuntos >= 1) {
        return mejorCoincidencia;
    }
    
    return "default";
}

// Función principal para obtener respuesta del bot
function obtenerRespuesta(mensajeUsuario) {
    if (!mensajeUsuario || mensajeUsuario.trim() === "") {
        return "¿En qué puedo ayudarte? Dime algo sobre pelo, uñas, precios, cita...";
    }
    
    const intencion = detectarIntencion(mensajeUsuario);
    return botResponses[intencion].response;
}

// --- Control del chat en la página ---
document.addEventListener('DOMContentLoaded', function() {
    const botonChat = document.getElementById('chatbotBtn');
    const ventanaChat = document.getElementById('ventanaChat');
    const cerrarChat = document.getElementById('cerrarChatBtn');
    const inputUsuario = document.getElementById('inputUsuario');
    const enviarBtn = document.getElementById('enviarBtn');
    const contenedorMensajes = document.getElementById('contenedorMensajes');
    
    let chatAbierto = false;
    
    // Abrir/cerrar chat con el botón
    if (botonChat) {
        botonChat.addEventListener('click', function() {
            if (chatAbierto) {
                ventanaChat.style.display = 'none';
                chatAbierto = false;
            } else {
                ventanaChat.style.display = 'flex';
                chatAbierto = true;
                // Enfocar input automáticamente
                setTimeout(() => inputUsuario.focus(), 100);
            }
        });
    }
    
    // Cerrar chat con la X
    if (cerrarChat) {
        cerrarChat.addEventListener('click', function() {
            ventanaChat.style.display = 'none';
            chatAbierto = false;
        });
    }
    
    // Función para agregar mensaje al chat
    function agregarMensaje(texto, tipo) {
        const div = document.createElement('div');
        div.classList.add(tipo === 'usuario' ? 'mensaje-usuario' : 'mensaje-bot');
        div.textContent = texto;
        contenedorMensajes.appendChild(div);
        // Auto-scroll al final
        contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
    }
    
    // Procesar mensaje del usuario
    function procesarMensaje() {
        const mensaje = inputUsuario.value.trim();
        if (mensaje === "") return;
        
        // Mostrar mensaje del usuario
        agregarMensaje(mensaje, 'usuario');
        inputUsuario.value = '';
        
        // Obtener respuesta del bot
        const respuesta = obtenerRespuesta(mensaje);
        
        // Pequeño delay para simular "escritura"
        setTimeout(() => {
            agregarMensaje(respuesta, 'bot');
        }, 300);
    }
    
    // Eventos: botón enviar y tecla Enter
    if (enviarBtn) {
        enviarBtn.addEventListener('click', procesarMensaje);
    }
    
    if (inputUsuario) {
        inputUsuario.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                procesarMensaje();
            }
        });
    }
});