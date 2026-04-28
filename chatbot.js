let contexto = "";

function abrirChat() {
    const v = document.getElementById('ventanaChat');
    v.style.display = (v.style.display === 'block') ? 'none' : 'block';
}

function enviarMensaje() {
    const input = document.getElementById('inputUsuario');
    const contenedor = document.getElementById('contenedorMensajes');
    const texto = input.value.trim();
    if (texto === "") return;

    const divUsuario = document.createElement('div');
    divUsuario.className = 'mensaje-usuario';
    divUsuario.innerText = texto;
    contenedor.appendChild(divUsuario);
    input.value = "";
    contenedor.scrollTop = contenedor.scrollHeight;

    const m = texto.toLowerCase();
    let respuesta = "";

    // 1. Contexto de reserva
    if (contexto === "esperando_respuesta_cita") {
        if (m.includes('si') || m.includes('sí') || m.includes('vale') || m.includes('claro')) {
            respuesta = "¡Perfecto! Usa el botón 'Agendar Cita' que se encuentra en la parte superior de nuestra web para completar tu reserva. ¡Te esperamos!";
        } else if (m.includes('no')) {
            respuesta = "Entendido. Aquí sigo para lo que necesites.";
        } else {
            respuesta = "¿Quieres que te guíe para reservar tu cita? (Responde sí o no).";
            contexto = "esperando_respuesta_cita";
            enviarRespuestaBot(respuesta);
            return;
        }
        contexto = ""; 
    } 
    // 2. Detección de Servicios
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
    // 3. Información general
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
        respuesta = "Estamos en Calle - ¡Te esperamos!";
    }
    else {
        respuesta = "No entiendo bien. Pregúntame por: corte, color, manicura, maquillaje, tratamientos, depilación, horario o ubicación.";
    }

    enviarRespuestaBot(respuesta);
}

function enviarRespuestaBot(texto) {
    setTimeout(() => {
        const divBot = document.createElement('div');
        divBot.className = 'mensaje-bot';
        divBot.innerText = texto;
        const contenedor = document.getElementById('contenedorMensajes');
        contenedor.appendChild(divBot);
        contenedor.scrollTop = contenedor.scrollHeight;
    }, 500);
}