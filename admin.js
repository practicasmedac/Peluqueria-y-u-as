
// --- 1. IMPORTACIONES ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// --- 2. CONFIGURACIÓN FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyALTEWvrAe0wZ2uw3n35jKKdPrQ0M3jxXc",
    authDomain: "peluqueria-y-manicura.firebaseapp.com",
    projectId: "peluqueria-y-manicura",
    storageBucket: "peluqueria-y-manicura.firebasestorage.app",
    messagingSenderId: "967796738416",
    appId: "1:967796738416:web:6b42c6b02139b686ad27b5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- 3. VARIABLES GLOBALES ---
let citas = [];

const precios = {
    "Corte y Peinado": 10,
    "Coloración": 30,
    "Manicura y Pedicura": 20,
    "Tratamiento Capilar": 45,
    "Maquillaje": 25,
    "Depilación y Facial": 35
};

// --- 4. LECTURA DE DATOS ---
async function cargarCitas() {
    try {
        const querySnapshot = await getDocs(collection(db, "citas"));
        citas = []; 
        
        querySnapshot.forEach((documento) => {
            const datos = documento.data();
            citas.push({
                id: documento.id,
                nombre: datos.nombre || '',
                telefono: datos.telefono || '',
                servicio: datos.servicio || '',
                fecha: datos.fecha || '',
                estado: datos.estado || 'pendiente'
            });
        });
        
        actualizarTabla(); 
    } catch (error) {
        console.error("Error al cargar citas de Firebase:", error);
    }
}

// --- 5. INTERFAZ Y ESTADÍSTICAS ---
function formatoFecha(fecha) {
    if (!fecha) return '-';
    let f = new Date(fecha);
    return f.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function actualizarTabla() {
    const tbody = document.getElementById('tbodyCitas');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    citas.forEach(cita => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = String(cita.id).substring(0, 5) + '...';
        row.insertCell(1).textContent = cita.nombre;
        row.insertCell(2).textContent = cita.telefono;
        row.insertCell(3).textContent = cita.servicio;
        row.insertCell(4).textContent = formatoFecha(cita.fecha);
        row.insertCell(5).innerHTML = `<span class="estado ${cita.estado}">${cita.estado === 'confirmada' ? 'Confirmada' : 'Pendiente'}</span>`;
        
        row.insertCell(6).innerHTML = `
            <button class="btn-accion" onclick="cambiarEstado('${cita.id}', '${cita.estado}')">Estado</button>
            <button class="btn-accion" onclick="abrirEditar('${cita.id}')">Editar</button>
            <button class="btn-accion" onclick="eliminarCita('${cita.id}')">Borrar</button>
        `;
    });
    
    actualizarEstadisticas();
}

function actualizarEstadisticas() {
    const hoy = new Date().toISOString().slice(0, 10);
    const citasHoy = citas.filter(c => c.fecha === hoy).length;
    if (document.getElementById('citasHoy')) document.getElementById('citasHoy').textContent = citasHoy;
    
    const clientesUnicos = new Set(citas.map(c => c.telefono)).size;
    if (document.getElementById('totalClientes')) document.getElementById('totalClientes').textContent = clientesUnicos;
    
    const mesActual = new Date().getMonth();
    const anioActual = new Date().getFullYear();
    let ingresos = 0;
    citas.forEach(cita => {
        if(cita.fecha) {
            let fechaCita = new Date(cita.fecha);
            if (fechaCita.getMonth() === mesActual && fechaCita.getFullYear() === anioActual && cita.estado === 'confirmada') {
                ingresos += precios[cita.servicio] || 0;
            }
        }
    });
    if (document.getElementById('ingresosMes')) document.getElementById('ingresosMes').textContent = ingresos + '€';
    
    const conteoServicios = {};
    citas.forEach(cita => {
        if(cita.servicio) {
            conteoServicios[cita.servicio] = (conteoServicios[cita.servicio] || 0) + 1;
        }
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

// --- 6. ACCIONES DE BOTONES (PÚBLICAS) ---
window.cambiarEstado = async function(id, estadoActual) {
    try {
        const nuevoEstado = estadoActual === 'confirmada' ? 'pendiente' : 'confirmada';
        await updateDoc(doc(db, "citas", id), { estado: nuevoEstado });
        await cargarCitas();
    } catch (error) {
        console.error("Error al cambiar estado:", error);
    }
}

window.eliminarCita = async function(id) {
    if (confirm('¿Estás seguro de eliminar esta cita?')) {
        try {
            await deleteDoc(doc(db, "citas", id));
            await cargarCitas(); 
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
}

window.abrirEditar = function(id) {
    const cita = citas.find(c => c.id === id);
    if (cita) {
        document.getElementById('editarId').value = cita.id;
        document.getElementById('editarNombre').value = cita.nombre;
        document.getElementById('editarTelefono').value = cita.telefono;
        document.getElementById('editarServicio').value = cita.servicio;
        document.getElementById('editarFecha').value = cita.fecha;
        
        document.getElementById('modalEditarCita').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// --- 7. EVENTOS Y FORMULARIOS ---
document.addEventListener('DOMContentLoaded', () => {
    const modalNueva = document.getElementById('modalCita');
    const modalEditar = document.getElementById('modalEditarCita');
    
    document.getElementById('btnAbrirModal').onclick = (e) => {
        e.preventDefault();
        modalNueva.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };
    
    document.getElementById('cerrarModal').onclick = () => {
        modalNueva.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    if(document.getElementById('cerrarModalEditar')) {
        document.getElementById('cerrarModalEditar').onclick = () => {
            modalEditar.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }
    
    window.onclick = (e) => {
        if (e.target === modalNueva) {
            modalNueva.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === modalEditar) {
            modalEditar.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
    
    const formNueva = document.getElementById('formNuevaCita');
    if (formNueva) {
        formNueva.onsubmit = async (e) => {
            e.preventDefault();
            const nuevaCita = {
                nombre: document.getElementById('nuevoNombre').value.trim(),
                telefono: document.getElementById('nuevoTelefono').value.trim(),
                servicio: document.getElementById('nuevoServicio').value,
                fecha: document.getElementById('nuevaFecha').value,
                estado: 'pendiente'
            };
            
            if (nuevaCita.telefono.length < 9) {
                alert('Teléfono inválido (mínimo 9 dígitos)');
                return;
            }
            try {
                await addDoc(collection(db, "citas"), nuevaCita);
                formNueva.reset();
                modalNueva.style.display = 'none';
                document.body.style.overflow = 'auto';
                
                await cargarCitas();
                alert('Cita agendada correctamente');
            } catch (error) {
                console.error("Error al agendar:", error);
                alert("Hubo un error al guardar la cita.");
            }
        };
    }
    
    const formEditar = document.getElementById('formEditarCita');
    if (formEditar) {
        formEditar.onsubmit = async (e) => {
            e.preventDefault();
            
            const id = document.getElementById('editarId').value;
            const datosActualizados = {
                nombre: document.getElementById('editarNombre').value.trim(),
                telefono: document.getElementById('editarTelefono').value.trim(),
                servicio: document.getElementById('editarServicio').value,
                fecha: document.getElementById('editarFecha').value
            };
            
            if (datosActualizados.telefono.length < 9) {
                alert('Teléfono inválido (mínimo 9 dígitos)');
                return;
            }
            try {
                await updateDoc(doc(db, "citas", id), datosActualizados);
                modalEditar.style.display = 'none';
                document.body.style.overflow = 'auto';
                
                await cargarCitas();
                alert('Cita actualizada correctamente');
            } catch (error) {
                console.error("Error al actualizar:", error);
                alert("Hubo un error al actualizar la cita.");
            }
        };
    }
    
    // Carga inicial
    cargarCitas();
});

