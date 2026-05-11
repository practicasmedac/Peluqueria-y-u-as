// chatbot.js - VERSION CON PRECIOS COMPLETOS

let estadoChat = {
    contexto: null,
    paso: 0,
    datosReserva: {}
};

// MEJORA 6: Base de conocimientos estructurada (CON PRECIOS ACTUALIZADOS)
const conocimientos = {
    servicios: {
        corte: {
            palabras: ['corte', 'cortar', 'peinado', 'cortarme', 'cortes'],
            nombre: "Corte y Peinado",
            precio: "10€ - 15€",
            duracion: "30-45 minutos",
            descripcion: "Corte personalizado segun tu estilo"
        },
        color: {
            palabras: ['color', 'tinte', 'mechas', 'balayage', 'reflejos', 'coloracion', 'coloración'],
            nombre: "Coloracion",
            precio: "desde 30€",
            duracion: "1.5 - 2 horas",
            descripcion: "Tintes, mechas, balayage y mas"
        },
        manicura: {
            palabras: ['manicura', 'unas', 'semipermanente', 'gel', 'acrilico', 'pedicura', 'unas de gel'],
            nombre: "Manicura y Pedicura",
            precio: "desde 20€",
            duracion: "45-60 minutos",
            descripcion: "Cuidado de manos y pies"
        },
        maquillaje: {
            palabras: ['maquillaje', 'maquillar', 'novia', 'social', 'maquillaje social', 'maquillaje novia'],
            nombre: "Maquillaje",
            precio: "desde 25€",
            duracion: "30-60 minutos",
            descripcion: "Maquillaje social, novias y eventos"
        },
        tratamiento: {
            palabras: ['tratamiento', 'keratina', 'alisado', 'hidratacion', 'capilar', 'tratamiento capilar'],
            nombre: "Tratamientos Capilares",
            precio: "desde 35€",  // ✅ PRECIO AÑADIDO
            duracion: "45-90 minutos",
            descripcion: "Keratina, alisado, hidratacion profunda"
        },
        depilacion: {
            palabras: ['depilacion', 'depilar', 'cera', 'facial', 'depilacion facial', 'depilacion cera'],
            nombre: "Depilacion",
            precio: "desde 15€",  // ✅ PRECIO AÑADIDO
            duracion: "15-30 minutos",
            descripcion: "Depilacion con cera y limpieza facial"
        }
    },
    infoGeneral: {
        horario: {
            palabras: ['horario', 'hora', 'abren', 'cierran', 'abierto', 'cerrado'],
            respuesta: "Horario: Lunes a Viernes de 9:00 a 20:00, Sabados de 10:00 a 16:00"
        },
        ubicacion: {
            palabras: ['ubicacion', 'direccion', 'donde', 'como llegar', 'cerca', 'calle'],
            respuesta: "Estamos en Calle Fuentes de Dios Lagrimas, 41019 - Te esperamos"
        },
        cita: {
            palabras: ['cita', 'reservar', 'reserva', 'agendar', 'agendar cita'],
            respuesta: "Para reservar cita, usa el boton 'Agendar Cita' en la parte superior de la web"
        }
    }
};

// MEJORA 3: Funcion de normalizacion de texto (mejorada)
function normalizarTexto(texto) {
    let normalizado = texto.toLowerCase();
    normalizado = normalizado.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    normalizado = normalizado.replace(/[¿?¡!.,;:()]/g, '');
    normalizado = normalizado.trim();
    return normalizado;
}

// MEJORA 3: Detectar servicios (CORREGIDA)
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

// MEJORA 2: Sistema de sugerencias rapidas
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

// MEJORA 4: Indicador de escritura
function mostrarEscribiendo() {
    const contenedor = document.getElementById('contenedorMensajes');
    const escribiendoDiv = document.createElement('div');
    escribiendoDiv.className = 'mensaje-bot escribiendo';
    escribiendoDiv.innerHTML = 'escribiendo...';
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

// Esperar a que el DOM este completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    const ventana = document.getElementById('ventanaChat');
    const boton = document.getElementById('chatbotBtn');
    const cerrar = document.getElementById('cerrarChatBtn');
    const input = document.getElementById('inputUsuario');
    const enviar = document.getElementById('enviarBtn');
    const contenedor = document.getElementById('contenedorMensajes');
    
    if (!ventana || !boton || !cerrar || !input || !enviar || !contenedor) {
        console.error('Falta algun elemento del chatbot');
        return;
    }
    
    // Mensaje de bienvenida
    setTimeout(() => {
        if (contenedor.children.length === 0) {
            enviarRespuestaBot(
                "Hola, soy el asistente virtual. Puedo ayudarte con informacion sobre nuestros servicios, precios, horario y ubicacion. Que te gustaria saber?",
                ['Corte de pelo', 'Coloracion', 'Manicura', 'Tratamientos', 'Depilacion', 'Horario']
            );
        }
    }, 500);
    
    // Abrir chat
    window.abrirChat = function() {
        ventana.style.display = (ventana.style.display === 'block') ? 'none' : 'block';
        if (ventana.style.display === 'block' && contenedor.children.length === 0) {
            enviarRespuestaBot(
                "Bienvenido de nuevo. En que puedo ayudarte hoy?",
                ['Precios', 'Direccion', 'Reservar cita', 'Horario', 'Tratamientos', 'Depilacion']
            );
        }
    };
    
    cerrar.onclick = function() {
        ventana.style.display = 'none';
    };
    
    // Funcion para generar respuesta
    function generarRespuesta(texto) {
        const normalizado = normalizarTexto(texto);
        
        // CONTEXTO DE RESERVA ELIMINADO
        if (estadoChat.contexto === "esperando_respuesta_cita") {
            estadoChat.contexto = null;
        }
        
        // Detectar informacion general primero
        const infoGeneral = detectarInfoGeneral(texto);
        if (infoGeneral) {
            const respuesta = conocimientos.infoGeneral[infoGeneral].respuesta;
            if (infoGeneral === 'cita') {
                return { texto: respuesta, sugerencias: ['Horario', 'Direccion', 'Servicios'] };
            }
            return { 
                texto: respuesta, 
                sugerencias: ['Corte', 'Color', 'Manicura', 'Tratamientos', 'Depilacion', 'Horario'] 
            };
        }
        
        // Detectar servicios
        const serviciosDetectados = detectarServicio(texto);
        
        if (serviciosDetectados.length > 0) {
            const servicioKey = serviciosDetectados[0];
            const servicio = conocimientos.servicios[servicioKey];
            
            let respuesta = "";
            
            if (normalizado.includes('precio') || normalizado.includes('cuesta') || normalizado.includes('costo')) {
                respuesta = `${servicio.nombre}: ${servicio.precio}. Duracion: ${servicio.duracion}. ${servicio.descripcion}`;
            } else {
                respuesta = `${servicio.nombre}: ${servicio.descripcion}. Precio: ${servicio.precio}. Duracion: ${servicio.duracion}. Para reservar, usa el boton 'Agendar Cita' en la parte superior.`;
            }
            
            // Sugerencias personalizadas según el servicio
            let sugerencias = ['Otro servicio', 'Precios', 'Horario', 'Direccion'];
            if (servicioKey === 'tratamiento') {
                sugerencias = ['Corte', 'Color', 'Depilacion', 'Precios'];
            } else if (servicioKey === 'depilacion') {
                sugerencias = ['Manicura', 'Maquillaje', 'Tratamientos', 'Precios'];
            }
            
            return { 
                texto: respuesta, 
                sugerencias: sugerencias
            };
        }
        
        // Preguntas sobre precios en general
        if (normalizado.includes('precio') || normalizado.includes('cuesta') || normalizado.includes('costo') || normalizado.includes('precios')) {
            let listaServicios = "Estos son nuestros servicios y precios:\n\n";
            for (const [key, servicio] of Object.entries(conocimientos.servicios)) {
                listaServicios += `• ${servicio.nombre}: ${servicio.precio}\n`;
            }
            listaServicios += "\nPara mas informacion, pregunta por cualquier servicio especifico.";
            return { texto: listaServicios, sugerencias: ['Corte', 'Color', 'Manicura', 'Tratamientos', 'Depilacion'] };
        }
        
        // Preguntas sobre servicios en general
        if (normalizado.includes('servicio') || normalizado.includes('hacen') || normalizado.includes('ofrecen')) {
            let listaServicios = "Estos son todos nuestros servicios:\n\n";
            for (const [key, servicio] of Object.entries(conocimientos.servicios)) {
                listaServicios += `• ${servicio.nombre}: ${servicio.descripcion}\n`;
            }
            listaServicios += "\n¿Sobre cual quieres mas informacion?";
            return { texto: listaServicios, sugerencias: ['Corte', 'Color', 'Manicura', 'Tratamientos', 'Depilacion'] };
        }
        
        // Como reservar
        if (normalizado.includes('como reservo') || normalizado.includes('como agendo') || normalizado.includes('como hago para reservar')) {
            return {
                texto: "Para reservar una cita, usa el boton 'Agendar Cita' que se encuentra en la parte superior de la pagina web. Es muy facil y rapido.",
                sugerencias: ['Ver servicios', 'Horario', 'Direccion', 'Precios']
            };
        }
        
        // Si no se detecta nada
        return {
            texto: "No entiendo bien. Preguntame por:\n• Corte de pelo\n• Coloracion (tintes, mechas)\n• Manicura y Pedicura\n• Maquillaje\n• Tratamientos capilares\n• Depilacion\n• Horario\n• Ubicacion",
            sugerencias: ['Corte', 'Color', 'Manicura', 'Tratamientos', 'Depilacion', 'Horario', 'Direccion']
        };
    }
    
    // Enviar mensaje mejorado
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
    
    // Asignar eventos
    boton.onclick = window.abrirChat;
    enviar.onclick = window.enviarMensaje;
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') window.enviarMensaje();
    });
});
