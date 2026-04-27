
// Precios de referencia
const precios = {
    "Corte y Peinado": 10,
    "Coloración": 30,
    "Manicura y Pedicura": 20,
    "Tratamiento Capilar": 45,
    "Maquillaje": 25,
    "Depilación y Facial": 35
};

// FUNCIONES GLOBALES 
function formatoFecha(fecha) {
    let f = new Date(fecha);
    return f.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function actualizarTabla() {
    const tbody = document.getElementById('tbodyCitas');
    if (!tbody) {
        console.error('No se encontró tbodyCitas');
        return;
    }
    
    tbody.innerHTML = '';
    
    citas.forEach(cita => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = cita.id;
        row.insertCell(1).textContent = cita.nombre;
        row.insertCell(2).textContent = cita.telefono;
        row.insertCell(3).textContent = cita.servicio;
        row.insertCell(4).textContent = formatoFecha(cita.fecha);
        row.insertCell(5).innerHTML = `<span class="estado ${cita.estado}">${cita.estado === 'confirmada' ? 'Confirmada' : 'Pendiente'}</span>`;
        row.insertCell(6).innerHTML = `
            <button class="btn-accion" onclick="cambiarEstado(${cita.id})">Cambiar</button>
            <button class="btn-accion" onclick="eliminarCita(${cita.id})">Eliminar</button>
        `;
    });
    
    actualizarEstadisticas();
    console.log('Tabla actualizada, total citas:', citas.length);
}

function actualizarEstadisticas() {
    // Citas de hoy
    const hoy = new Date().toISOString().slice(0, 10);
    const citasHoy = citas.filter(c => c.fecha === hoy).length;
    const citasHoyElem = document.getElementById('citasHoy');
    if (citasHoyElem) citasHoyElem.textContent = citasHoy;
    
    // Total clientes únicos
    const clientesUnicos = new Set(citas.map(c => c.telefono)).size;
    const totalClientesElem = document.getElementById('totalClientes');
    if (totalClientesElem) totalClientesElem.textContent = clientesUnicos;
    
    // Ingresos del mes actual
    const mesActual = new Date().getMonth();
    const anioActual = new Date().getFullYear();
    let ingresos = 0;
    citas.forEach(cita => {
        let fechaCita = new Date(cita.fecha);
        if (fechaCita.getMonth() === mesActual && fechaCita.getFullYear() === anioActual && cita.estado === 'confirmada') {
            ingresos += precios[cita.servicio] || 0;
        }
    });
    const ingresosMesElem = document.getElementById('ingresosMes');
    if (ingresosMesElem) ingresosMesElem.textContent = ingresos + '€';
    
    // Servicios más solicitados
    const conteoServicios = {};
    citas.forEach(cita => {
        conteoServicios[cita.servicio] = (conteoServicios[cita.servicio] || 0) + 1;
    });
    const serviciosOrdenados = Object.entries(conteoServicios).sort((a, b) => b[1] - a[1]);
    const listaDiv = document.getElementById('listaServicios');
    if (listaDiv) {
        listaDiv.innerHTML = '';
        serviciosOrdenados.forEach(([servicio, cantidad]) => {
            listaDiv.innerHTML += `<div class="servicio-item"><span class="servicio-nombre">${servicio}</span><span class="servicio-count">${cantidad} citas</span></div>`;
        });
        if (serviciosOrdenados.length === 0) {
            listaDiv.innerHTML = '<p>No hay servicios registrados aún.</p>';
        }
    }
}

function cambiarEstado(id) {
    const cita = citas.find(c => c.id === id);
    if (cita) {
        cita.estado = cita.estado === 'confirmada' ? 'pendiente' : 'confirmada';
        actualizarTabla();
    }
}

function eliminarCita(id) {
    if (confirm('¿Eliminar esta cita?')) {
        citas = citas.filter(c => c.id !== id);
        actualizarTabla();
    }
}

function agregarCita(nombre, telefono, servicio, fecha) {
    const nuevoId = citas.length > 0 ? Math.max(...citas.map(c => c.id)) + 1 : 1;
    const nuevaCita = {
        id: nuevoId,
        nombre: nombre,
        telefono: telefono,
        servicio: servicio,
        fecha: fecha,
        estado: 'pendiente'
    };
    citas.push(nuevaCita);
    console.log('Cita agregada:', nuevaCita);
    actualizarTabla();
}

// MODAL Y FORMULARIO 
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - Iniciando panel de administración');
    
    const modal = document.getElementById('modalCita');
    const btnAbrir = document.getElementById('btnAbrirModal');
    const btnCerrar = document.getElementById('cerrarModal');
    const formNueva = document.getElementById('formNuevaCita');

    // Abrir modal
    if (btnAbrir) {
        btnAbrir.onclick = function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            console.log('Modal abierto');
        };
    } else {
        console.error('No se encontró btnAbrirModal');
    }
    
    // Cerrar modal con X
    if (btnCerrar) {
        btnCerrar.onclick = function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            console.log('Modal cerrado');
        };
    }
    
    // Cerrar modal click fuera
    window.onclick = function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Guardar nueva cita
    if (formNueva) {
        formNueva.onsubmit = function(e) {
            e.preventDefault();
            console.log('Formulario enviado');
            
            const nombre = document.getElementById('nuevoNombre').value.trim();
            const telefono = document.getElementById('nuevoTelefono').value.trim();
            const servicio = document.getElementById('nuevoServicio').value;
            const fecha = document.getElementById('nuevaFecha').value;
            
            console.log('Datos:', { nombre, telefono, servicio, fecha });
            
            if (!nombre || !telefono || !fecha) {
                alert('Completa todos los campos');
                return;
            }
            if (telefono.length < 9) {
                alert('Teléfono inválido (mínimo 9 dígitos)');
                return;
            }
            
            agregarCita(nombre, telefono, servicio, fecha);
            formNueva.reset();
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            alert(' Cita agendada correctamente');
        };
    } else {
        console.error('No se encontró formNuevaCita');
    }

    // Cargar datos iniciales
    actualizarTabla();
});
