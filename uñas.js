// Inicio
const boton_inicio = document.getElementById('Inicio');
const destino_inicio = document.getElementById('index.html');

boton_inicio.addEventListener('click', function() {
    destino_inicio.scrollIntoView({ 
        behavior: 'smooth'
    });
    
});
// Servicios
const boton_servicios = document.getElementById('Servicios');
const destino_servicios = document.getElementById('servicios.html');

boton_servicios.addEventListener('click', function() {
    destino_servicios.scrollIntoView({ 
        behavior: 'smooth'
    });
    
});
//Contacto
const boton_contacto = document.getElementById('Contacto');
const destino_contacto = document.getElementById('contacto.html');

boton_contacto.addEventListener('click', function() {
    destino_contacto.scrollIntoView({ 
        behavior: 'smooth' 
    });
    
});