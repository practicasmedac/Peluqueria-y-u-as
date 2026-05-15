// Obtener elementos del DOM
const modal = document.getElementById('modalCita');
const btnAgendar = document.getElementById('btnAgendarHeader');
const cerrarBtn = document.getElementById('cerrarModalBtn');
const formCita = document.getElementById('formCita');

// Función para abrir el modal
function abrirModal() {
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('Modal abierto'); // Para depuración
    }
}

// Función para cerrar el modal
function cerrarModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log('Modal cerrado'); // Para depuración
    }
}

// Evento click en el botón Agendar cita
if (btnAgendar) {
    btnAgendar.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Botón clickeado'); // Para depuración
        abrirModal();
    });
} else {
    console.error('No se encontró el botón con id "btnAgendarHeader"');
}

// Evento click en la X para cerrar
if (cerrarBtn) {
    cerrarBtn.addEventListener('click', function() {
        cerrarModal();
    });
}

// Evento click fuera del modal (en el fondo)
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        cerrarModal();
    }
});

// Evento submit del formulario
if (formCita) {
    formCita.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const fecha = document.getElementById('fecha').value;
        const telefono = document.getElementById('telefono').value.trim();
        
        // Validar campos
        if (nombre === '' || apellido === '' || fecha === '' || telefono === '') {
            alert('Por favor, completa todos los campos.');
            return;
        }
        
        if (telefono.length < 9) {
            alert('Por favor, ingresa un número de teléfono válido (mínimo 9 dígitos).');
            return;
        }
        
        // Formatear fecha
        const fechaObj = new Date(fecha);
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        
        // Mostrar mensaje de confirmación
        alert(` Cita agendada con éxito en StudioLux\n\nDatos de la reserva:\n• Nombre: ${nombre} ${apellido}\n• Día: ${fechaFormateada}\n• Teléfono: ${telefono}\n\nNos pondremos en contacto para confirmar el horario.\n¡Te esperamos!`);
        
        // Limpiar formulario y cerrar modal
        formCita.reset();
        cerrarModal();
    });
}

// Animación del header al hacer scroll
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
        header.classList.add('amarillo-pastel');
    } else {
        header.classList.remove('amarillo-pastel');
    }
});

// Manejo de error del video
const video = document.querySelector('.video-fondo');
if (video) {
    video.addEventListener('error', function() {
        const seccionVideo = document.querySelector('.seccion-imagen');
        if (seccionVideo) {
            seccionVideo.style.background = 'linear-gradient(135deg, #b87c4f, #e6a151)';
        }
    });
}

console.log('Página cargada correctamente');

