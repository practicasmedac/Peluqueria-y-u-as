// chatbot.js - VERSIÓN CORREGIDA
let contexto = "";

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    const ventana = document.getElementById('ventanaChat');
    const boton = document.getElementById('chatbotBtn');
    const cerrar = document.getElementById('cerrarChatBtn');
    const input = document.getElementById('inputUsuario');
    const enviar = document.getElementById('enviarBtn');
    const contenedor = document.getElementById('contenedorMensajes');
    
    // Verificar que todos los elementos existen
    if (!ventana || !boton || !cerrar || !input || !enviar || !contenedor) {
        console.error('Falta algún elemento del chatbot');
        return;
    }
    
    // Abrir/cerrar chat
    window.abrirChat = function() {
        ventana.style.display = (ventana.style.display === 'block') ? 'none' : 'block';
    };
    
    // Cerrar chat
    cerrar.onclick = function() {
        ventana.style.display = 'none';
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
        
        const m = texto.toLowerCase();
        let respuesta = "";
        
        // Contexto de reserva
        if (contexto === "esperando_respuesta_cita") {
            if (m.includes('si') || m.includes('sí') || m.includes('vale') || m.includes('claro')) {
                respuesta = "¡Perfecto! Usa el botón 'Agendar Cita' que se encuentra en la parte superior de nuestra web para completar tu reserva. ¡Te esperamos!";
                contexto = "";
            } else if (m.includes('no')) {
                respuesta = "Entendido. Aquí sigo para lo que necesites.";
                contexto = "";
            } else {
                respuesta = "¿Quieres que te guíe para reservar tu cita? (Responde sí o no)";
                contexto = "esperando_respuesta_cita";
                enviarRespuestaBot(respuesta);
                return;
            }
        } 
        // Servicios
        else if (m.includes('tratamiento') || m.includes('keratina') || m.includes('alisado') || m.includes('hidratacion')) {
            respuesta = "En nuestros Tratamientos Capilares ofrecemos: Keratina, alisado e hidratación. Los precios son a consultar. ¿Quieres reservar una cita para una valoración?";
            contexto = "esperando_respuesta_cita";
        }
        else if (m.includes('corte')) {
            respuesta = "Corte y Peinado: Estilos modernos, clásicos y personalizados desde 10€. ¿Quieres reservar cita?";
            contexto = "esperando_respuesta_cita";
        }
        else if (m.includes('color') || m.includes('tinte') || m.includes('mechas') || m.includes('balayage')) {
            respuesta = "Coloración (tintes, reflejos, balayage, mechas) desde 30€. ¿Quieres reservar cita?";
            contexto = "esperando_respuesta_cita";
        }
        else if (m.includes('manicura') || m.includes('pedicura') || m.includes('uñas')) {
            respuesta = "Manicura y Pedicura (semipermanente, gel, acrílico) desde 20€. ¿Quieres reservar cita?";
            contexto = "esperando_respuesta_cita";
        }
        else if (m.includes('maquillaje')) {
            respuesta = "Maquillaje (social, novias, sesiones) desde 25€. ¿Quieres reservar cita?";
            contexto = "esperando_respuesta_cita";
        }
        else if (m.includes('depilacion') || m.includes('facial') || m.includes('limpieza')) {
            respuesta = "Depilación con cera y limpieza facial. Precio a consultar. ¿Quieres reservar cita?";
            contexto = "esperando_respuesta_cita";
        }
        // Información general
        else if (m.includes('precio') || m.includes('servicios') || m.includes('hacen')) {
            respuesta = "Ofrecemos: Corte, Color, Manicura, Maquillaje, Tratamientos y Depilación. ¿Sobre cuál quieres más info?";
        }
        else if (m.includes('cita') || m.includes('reservar')) {
            respuesta = "Para reservar una cita, por favor utiliza el botón 'Agendar Cita' que se encuentra en la parte superior de nuestra página web.";
        }
        else if (m.includes('horario')) {
            respuesta = "Estamos de Lunes a Viernes de 9:00 a 20:00 y Sábados de 10:00 a 16:00.";
        }
        else if (m.includes('ubicacion') || m.includes('donde') || m.includes('direccion')) {
            respuesta = "Estamos en Calle Fuentes de Dios Lágrimas, 41019 - ¡Te esperamos!";
        }
        else {
            respuesta = "No entiendo bien. Pregúntame por: corte, color, manicura, maquillaje, tratamientos, depilación, horario o ubicación.";
        }
        
        enviarRespuestaBot(respuesta);
    };
    
    function enviarRespuestaBot(texto) {
        setTimeout(() => {
            const divBot = document.createElement('div');
            divBot.className = 'mensaje-bot';
            divBot.innerText = texto;
            contenedor.appendChild(divBot);
            contenedor.scrollTop = contenedor.scrollHeight;
        }, 500);
    }
    
    // Asignar eventos
    boton.onclick = window.abrirChat;
    enviar.onclick = window.enviarMensaje;
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') window.enviarMensaje();
    });
});