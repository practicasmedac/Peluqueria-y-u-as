// Inicio
const boton_inicio = document.getElementById('Inicio');
const destino_inicio = document.getElementById('Inicio.html');

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
// Citas
const boton_abrir = document.getElementById('boton_abrir');
const boton_cerrar = document.getElementById('boton_cerrar');
const menu = document.getElementById('menu');

boton_abrir.addEventListener('click', function() {
    menu.style.display = 'block';
}); 

boton_cerrar.addEventListener('click', function() {
    menu.style.display = 'none';
});

