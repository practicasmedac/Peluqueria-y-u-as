(function() {
    "use strict";

    // CREAR MODAL AUTOMÁTICAMENTE 
    function crearModalSiNoExiste() {
        if (document.getElementById('modalCita')) return;

        const modalHTML = `
            <div id="modalCita" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; align-items: center; justify-content: center;">
                <div class="modal-content" style="background: white; padding: 2rem; border-radius: 20px; max-width: 450px; width: 90%; position: relative;">
                    <span id="cerrarModal" style="position: absolute; top: 15px; right: 20px; font-size: 28px; cursor: pointer;">&times;</span>
                    <h2 style="margin-top: 0;">Agendar Cita</h2>
                    <form id="formCita">
                        <div style="margin-bottom: 1rem;">
                            <label for="nombre">Nombre *</label>
                            <input type="text" id="nombre" required style="width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #ccc; border-radius: 6px;">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label for="apellido">Apellido *</label>
                            <input type="text" id="apellido" required style="width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #ccc; border-radius: 6px;">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label for="fecha">Fecha deseada *</label>
                            <input type="date" id="fecha" required style="width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #ccc; border-radius: 6px;">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label for="telefono">Teléfono *</label>
                            <input type="tel" id="telefono" required style="width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #ccc; border-radius: 6px;">
                        </div>
                        <button type="submit" style="background: #b28b5e; color: white; border: none; padding: 12px 24px; border-radius: 30px; cursor: pointer; width: 100%; font-weight: bold;">Confirmar cita</button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // INICIALIZAR TODO AL CARGAR 
    document.addEventListener('DOMContentLoaded', function() {
        
        crearModalSiNoExiste();

        // MODAL 
        const modal = document.getElementById('modalCita');
        const btnAgendar = document.getElementById('btnAgendarCita');
        const cerrarBtn = document.getElementById('cerrarModal');
        const formCita = document.getElementById('formCita');

        function abrirModal() {
            if (modal) modal.style.display = 'flex';
        }

        function cerrarModal() {
            if (modal) modal.style.display = 'none';
        }

        if (btnAgendar) {
            btnAgendar.addEventListener('click', function(e) {
                e.preventDefault();
                abrirModal();
            });
        }

        if (cerrarBtn) {
            cerrarBtn.addEventListener('click', cerrarModal);
        }

        window.addEventListener('click', function(event) {
            if (event.target === modal) cerrarModal();
        });

        if (formCita) {
            formCita.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const nombre = document.getElementById('nombre').value.trim();
                const apellido = document.getElementById('apellido').value.trim();
                const fecha = document.getElementById('fecha').value;
                const telefono = document.getElementById('telefono').value.trim();
                
                if (!nombre || !apellido || !fecha || !telefono) {
                    alert('Por favor, completa todos los campos.');
                    return;
                }
                
                if (telefono.length < 9) {
                    alert('Ingresa un número de teléfono válido (mínimo 9 dígitos).');
                    return;
                }
                
                const fechaObj = new Date(fecha);
                const fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                });
                
                alert(` Cita agendada con éxito en StudioLux\n\n` +
                      `Datos de la reserva:\n` +
                      `• Nombre: ${nombre} ${apellido}\n` +
                      `• Día: ${fechaFormateada}\n` +
                      `• Teléfono: ${telefono}\n\n` +
                      `Nos pondremos en contacto para confirmar el horario.\n` +
                      `¡Te esperamos!`);
                
                formCita.reset();
                cerrarModal();
            });
        }

        // ACORDEONES 
        const accordionItems = document.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            if (!header || !content) return;
            
            content.style.display = 'none';
            
            let indicator = header.querySelector('.accordion-indicator');
            if (!indicator) {
                indicator = document.createElement('span');
                indicator.className = 'accordion-indicator';
                indicator.textContent = '[+]';
                header.appendChild(indicator);
            }
            header.style.cursor = 'pointer';
            
            header.addEventListener('click', function(e) {
                e.stopPropagation();
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    indicator.textContent = '[-]';
                } else {
                    content.style.display = 'none';
                    indicator.textContent = '[+]';
                }
            });
        });

        // DROPDOWN HEADER 
        const dropdown = document.querySelector('.dropdown');
        if (dropdown) {
            const dropbtn = dropdown.querySelector('.dropbtn');
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            if (dropbtn && dropdownContent) {
                dropdownContent.style.display = 'none';
                
                dropbtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdownContent.style.display = 
                        (dropdownContent.style.display === 'none') ? 'block' : 'none';
                });
                
                document.addEventListener('click', function(e) {
                    if (!dropdown.contains(e.target)) {
                        dropdownContent.style.display = 'none';
                    }
                });
            }
        }

    });
})();
