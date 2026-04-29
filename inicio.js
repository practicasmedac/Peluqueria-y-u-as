//  VARIABLE GLOBAL 
let citas = [];

// Precios de referencia
const precios = {
    "Corte y Peinado": 10,
    "Coloración": 30,
    "Manicura y Pedicura": 20,
    "Tratamiento Capilar": 45,
    "Maquillaje": 25,
    "Depilación y Facial": 35
};

// PERSISTENCIA LOCALSTORAGE 
function guardarEnLocalStorage() {
    localStorage.setItem('citasStudioLux', JSON.stringify(citas));
}

function cargarDeLocalStorage() {
    const data = localStorage.getItem('citasStudioLux');
    if (data) {
        citas = JSON.parse(data);
    } else {
        citas = [
            { id: 1, nombre: "Ana García", telefono: "611223344", servicio: "Corte y Peinado", fecha: "2025-04-16", estado: "confirmada" },
            { id: 2, nombre: "María López", telefono: "622334455", servicio: "Coloración", fecha: "2025-04-16", estado: "pendiente" },
            { id: 3, nombre: "Laura Martínez", telefono: "633445566", servicio: "Manicura y Pedicura", fecha: "2025-04-17", estado: "confirmada" },
            { id: 4, nombre: "Carmen Ruiz", telefono: "644556677", servicio: "Tratamiento Capilar", fecha: "2025-04-18", estado: "pendiente" },
            { id: 5, nombre: "Sofia Jiménez", telefono: "655667788", servicio: "Maquillaje", fecha: "2025-04-15", estado: "confirmada" }
        ];
        guardarEnLocalStorage();
    }
}

function formatoFecha(fecha) {
    let f = new Date(fecha);
    return f.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function actualizarTabla() {
    const tbody = document.getElementById('tbodyCitas');
    if (!tbody) return;
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
            <button class="btn-accion" onclick="abrirEditar(${cita.id})">Editar</button>
            <button class="btn-accion" onclick="cambiarEstado(${cita.id})">Cambiar estado</button>
            <button class="btn-accion" onclick="eliminarCita(${cita.id})">Eliminar</button>
        `;
    });
    actualizarEstadisticas();
    guardarEnLocalStorage();
}

function actualizarEstadisticas() {
    const hoy = new Date().toISOString().slice(0,10);
    document.getElementById('citasHoy').textContent = citas.filter(c => c.fecha === hoy).length;
    document.getElementById('totalClientes').textContent = new Set(citas.map(c => c.telefono)).size;
    const mesActual = new Date().getMonth(), anioActual = new Date().getFullYear();
    let ingresos = 0;
    citas.forEach(cita => {
        let fechaCita = new Date(cita.fecha);
        if (fechaCita.getMonth() === mesActual && fechaCita.getFullYear() === anioActual && cita.estado === 'confirmada') {
            ingresos += precios[cita.servicio] || 0;
        }
    });
    document.getElementById('ingresosMes').textContent = ingresos + '€';
    const conteoServicios = {};
    citas.forEach(c => conteoServicios[c.servicio] = (conteoServicios[c.servicio] || 0) + 1);
    const serviciosOrdenados = Object.entries(conteoServicios).sort((a,b) => b[1] - a[1]);
    const listaDiv = document.getElementById('listaServicios');
    if (listaDiv) {
        listaDiv.innerHTML = '';
        serviciosOrdenados.forEach(([servicio, cantidad]) => {
            listaDiv.innerHTML += `<div class="servicio-item"><span class="servicio-nombre">${servicio}</span><span class="servicio-count">${cantidad} citas</span></div>`;
        });
        if (serviciosOrdenados.length === 0) listaDiv.innerHTML = '<p>No hay servicios registrados aún.</p>';
    }
}

function cambiarEstado(id) {
    const cita = citas.find(c => c.id === id);
    if (cita) {
        cita.estado = cita.estado === 'confirmada' ? 'pendiente' : 'confirmada';
        actualizarTabla();
        alert(`Estado actualizado a ${cita.estado === 'confirmada' ? 'Confirmada' : 'Pendiente'}`);
    }
}

function eliminarCita(id) {
    if (confirm('¿Eliminar esta cita permanentemente?')) {
        citas = citas.filter(c => c.id !== id);
        actualizarTabla();
        alert('Cita eliminada');
    }
}

function agregarCita(nombre, telefono, servicio, fecha) {
    const nuevoId = citas.length > 0 ? Math.max(...citas.map(c => c.id)) + 1 : 1;
    citas.push({ id: nuevoId, nombre, telefono, servicio, fecha, estado: 'pendiente' });
    actualizarTabla();
}

function abrirEditar(id) {
    const cita = citas.find(c => c.id === id);
    if (!cita) return;
    document.getElementById('editarId').value = cita.id;
    document.getElementById('editarNombre').value = cita.nombre;
    document.getElementById('editarTelefono').value = cita.telefono;
    document.getElementById('editarServicio').value = cita.servicio;
    document.getElementById('editarFecha').value = cita.fecha;
    document.getElementById('modalEditarCita').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function guardarEdicion(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editarId').value);
    const nombre = document.getElementById('editarNombre').value.trim();
    const telefono = document.getElementById('editarTelefono').value.trim();
    const servicio = document.getElementById('editarServicio').value;
    const fecha = document.getElementById('editarFecha').value;
    if (!nombre || !telefono || !fecha) return alert('Completa todos los campos');
    if (telefono.length < 9) return alert('Teléfono inválido');
    const index = citas.findIndex(c => c.id === id);
    if (index !== -1) {
        citas[index] = { ...citas[index], nombre, telefono, servicio, fecha };
        actualizarTabla();
        cerrarModalEditar();
        alert('Cita actualizada');
    }
}

function cerrarModalEditar() {
    document.getElementById('modalEditarCita').style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDeLocalStorage();
    actualizarTabla();
    const modalAgregar = document.getElementById('modalCita');
    document.getElementById('btnAbrirModal').onclick = () => { modalAgregar.style.display = 'block'; document.body.style.overflow = 'hidden'; };
    document.getElementById('cerrarModal').onclick = () => { modalAgregar.style.display = 'none'; document.body.style.overflow = 'auto'; };
    window.onclick = (e) => {
        if (e.target === modalAgregar) { modalAgregar.style.display = 'none'; document.body.style.overflow = 'auto'; }
        if (e.target === document.getElementById('modalEditarCita')) cerrarModalEditar();
    };
    document.getElementById('formNuevaCita').onsubmit = (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nuevoNombre').value.trim();
        const telefono = document.getElementById('nuevoTelefono').value.trim();
        const servicio = document.getElementById('nuevoServicio').value;
        const fecha = document.getElementById('nuevaFecha').value;
        if (!nombre || !telefono || !fecha) return alert('Completa todos los campos');
        if (telefono.length < 9) return alert('Teléfono inválido (mínimo 9 dígitos)');
        agregarCita(nombre, telefono, servicio, fecha);
        document.getElementById('formNuevaCita').reset();
        modalAgregar.style.display = 'none';
        document.body.style.overflow = 'auto';
        alert(' Cita agendada');
    };
    document.getElementById('formEditarCita').onsubmit = guardarEdicion;
    document.getElementById('cerrarModalEditar').onclick = cerrarModalEditar;
});
