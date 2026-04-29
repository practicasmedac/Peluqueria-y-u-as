<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents('php://input'), true);
$accion = $data['accion'] ?? '';

$archivo = 'citas.json';

// Leer citas existentes
function leerCitas() {
    global $archivo;
    if (!file_exists($archivo)) return [];
    $contenido = file_get_contents($archivo);
    return json_decode($contenido, true) ?? [];
}

// Guardar citas
function guardarCitas($citas) {
    global $archivo;
    file_put_contents($archivo, json_encode($citas, JSON_PRETTY_PRINT));
}

// Respuesta estándar
function responder($exito, $mensaje = '', $data = []) {
    echo json_encode(array_merge(['exito' => $exito, 'mensaje' => $mensaje], $data));
    exit;
}

switch ($accion) {
    case 'listar':
        $citas = leerCitas();
        responder(true, '', ['citas' => $citas]);
        break;
        
    case 'obtener':
        $id = $data['id'] ?? 0;
        $citas = leerCitas();
        foreach ($citas as $c) {
            if ($c['id'] == $id) {
                responder(true, '', ['cita' => $c]);
            }
        }
        responder(false, 'Cita no encontrada');
        break;
        
    case 'agregar':
        $nombre = trim($data['nombre'] ?? '');
        $telefono = trim($data['telefono'] ?? '');
        $servicio = $data['servicio'] ?? '';
        $fecha = $data['fecha'] ?? '';
        if (!$nombre || !$telefono || !$servicio || !$fecha) responder(false, 'Faltan datos');
        if (strlen($telefono) < 9) responder(false, 'Teléfono inválido');
        
        $citas = leerCitas();
        $nuevoId = empty($citas) ? 1 : max(array_column($citas, 'id')) + 1;
        $nuevaCita = [
            'id' => $nuevoId,
            'nombre' => $nombre,
            'telefono' => $telefono,
            'servicio' => $servicio,
            'fecha' => $fecha,
            'estado' => 'pendiente'
        ];
        $citas[] = $nuevaCita;
        guardarCitas($citas);
        responder(true, 'Cita agregada');
        break;
        
    case 'editar':
        $id = $data['id'] ?? 0;
        $nombre = trim($data['nombre'] ?? '');
        $telefono = trim($data['telefono'] ?? '');
        $servicio = $data['servicio'] ?? '';
        $fecha = $data['fecha'] ?? '';
        if (!$id || !$nombre || !$telefono || !$servicio || !$fecha) responder(false, 'Faltan datos');
        if (strlen($telefono) < 9) responder(false, 'Teléfono inválido');
        
        $citas = leerCitas();
        $actualizado = false;
        foreach ($citas as &$c) {
            if ($c['id'] == $id) {
                $c['nombre'] = $nombre;
                $c['telefono'] = $telefono;
                $c['servicio'] = $servicio;
                $c['fecha'] = $fecha;
                $actualizado = true;
                break;
            }
        }
        if (!$actualizado) responder(false, 'Cita no encontrada');
        guardarCitas($citas);
        responder(true, 'Cita actualizada');
        break;
        
    case 'cambiarEstado':
        $id = $data['id'] ?? 0;
        $citas = leerCitas();
        $actualizado = false;
        foreach ($citas as &$c) {
            if ($c['id'] == $id) {
                $c['estado'] = ($c['estado'] === 'confirmada') ? 'pendiente' : 'confirmada';
                $actualizado = true;
                break;
            }
        }
        if (!$actualizado) responder(false, 'Cita no encontrada');
        guardarCitas($citas);
        responder(true, 'Estado cambiado');
        break;
        
    case 'eliminar':
        $id = $data['id'] ?? 0;
        $citas = leerCitas();
        $nuevasCitas = array_filter($citas, fn($c) => $c['id'] != $id);
        if (count($nuevasCitas) === count($citas)) responder(false, 'Cita no encontrada');
        guardarCitas(array_values($nuevasCitas));
        responder(true, 'Cita eliminada');
        break;
        
    default:
        responder(false, 'Acción no válida');
}
?>
