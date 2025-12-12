<?php
// php/contacto-procesar.php

// Configuración
$destinatario = "ventas@grupoeverest.com.mx";
$asunto_base = "Contacto desde Web Grupo Everest";

// Headers para el email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: no-reply@grupoeverest.com.mx" . "\r\n";
$headers .= "Reply-To: " . ($_POST['email'] ?? 'no-reply@grupoeverest.com.mx') . "\r\n";

// Función para sanitizar datos
function sanitizar($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Función para validar email
function validarEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Función para verificar token y timestamp
function verificarSeguridad($token, $timestamp) {
    // Verificar que el token tenga formato válido
    if (empty($token) || strlen($token) < 10) {
        return false;
    }
    
    // Verificar que el timestamp sea reciente (menos de 1 hora)
    $tiempo_actual = time();
    $tiempo_envio = intval($timestamp) / 1000; // Convertir de milisegundos a segundos
    
    if (($tiempo_actual - $tiempo_envio) > 3600) { // 1 hora en segundos
        return false;
    }
    
    return true;
}

// Array de respuesta
$respuesta = array(
    'success' => false,
    'message' => ''
);

try {
    // Verificar método POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
    // Verificar honeypot (campo anti-spam)
    if (!empty($_POST['website'])) {
        throw new Exception('Solicitud detectada como spam');
    }
    
    // Verificar seguridad
    $token = $_POST['token'] ?? '';
    $timestamp = $_POST['timestamp'] ?? '';
    
    if (!verificarSeguridad($token, $timestamp)) {
        throw new Exception('Error de seguridad en el formulario');
    }
    
    // Obtener y validar datos del formulario
    $nombre = sanitizar($_POST['nombre'] ?? '');
    $empresa = sanitizar($_POST['empresa'] ?? '');
    $email = sanitizar($_POST['email'] ?? '');
    $telefono = sanitizar($_POST['telefono'] ?? '');
    $asunto_tipo = sanitizar($_POST['asunto'] ?? '');
    $industria = sanitizar($_POST['industria'] ?? '');
    $mensaje = sanitizar($_POST['mensaje'] ?? '');
    $spam_check = $_POST['spam_check'] ?? '';
    
    // Validar campos requeridos
    if (empty($nombre) || empty($email) || empty($telefono) || empty($asunto_tipo) || empty($mensaje)) {
        throw new Exception('Todos los campos marcados con * son obligatorios');
    }
    
    // Validar email
    if (!validarEmail($email)) {
        throw new Exception('El correo electrónico no es válido');
    }
    
    // Validar longitud del mensaje
    if (strlen($mensaje) < 20) {
        throw new Exception('El mensaje debe tener al menos 20 caracteres');
    }
    
    // Mapear asuntos
    $asuntos = array(
        'cotizacion' => 'Solicitud de Cotización',
        'asesoria' => 'Asesoría Técnica',
        'soporte' => 'Soporte Técnico',
        'ventas' => 'Información de Productos',
        'quejas' => 'Quejas y Sugerencias',
        'otro' => 'Otro'
    );
    
    $asunto_texto = $asuntos[$asunto_tipo] ?? 'Consulta General';
    
    // Mapear industrias
    $industrias = array(
        'construccion' => 'Construcción',
        'minero' => 'Minero',
        'quimico' => 'Químico y Petroquímico',
        'naviero' => 'Naviero',
        'metalmecanico' => 'Metalmecánico',
        'electrico' => 'Eléctrico',
        'azucarero' => 'Azucarero',
        'ferroviario' => 'Ferroviario',
        'automotriz' => 'Automotriz',
        'otro' => 'Otro'
    );
    
    $industria_texto = $industrias[$industria] ?? 'No especificada';
    
    // Construir el cuerpo del email
    $cuerpo_email = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #002c5b; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #002c5b; }
            .footer { background: #e9ecef; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
<!-- Start of LiveChat (www.livechatinc.com) code -->
<script type="text/javascript">
var __lc = {};
__lc.license = 6683241;
(function() {
  var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
  lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
})();
</script>
<!-- End of LiveChat code -->
        <div class='container'>
            <div class='header'>
                <h2>Nuevo Mensaje de Contacto</h2>
                <p>Grupo Everest - Website</p>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>Nombre:</span> {$nombre}
                </div>
                <div class='field'>
                    <span class='label'>Empresa:</span> " . ($empresa ?: 'No especificada') . "
                </div>
                <div class='field'>
                    <span class='label'>Email:</span> {$email}
                </div>
                <div class='field'>
                    <span class='label'>Teléfono:</span> {$telefono}
                </div>
                <div class='field'>
                    <span class='label'>Asunto:</span> {$asunto_texto}
                </div>
                <div class='field'>
                    <span class='label'>Industria:</span> {$industria_texto}
                </div>
                <div class='field'>
                    <span class='label'>Mensaje:</span><br>
                    " . nl2br($mensaje) . "
                </div>
                <div class='field'>
                    <span class='label'>IP del remitente:</span> {$_SERVER['REMOTE_ADDR']}
                </div>
                <div class='field'>
                    <span class='label'>Fecha y hora:</span> " . date('d/m/Y H:i:s') . "
                </div>
            </div>
            <div class='footer'>
                Este mensaje fue enviado desde el formulario de contacto del website de Grupo Everest.
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Asunto del email
    $asunto_email = "{$asunto_base} - {$asunto_texto}";
    
    // Enviar email
    if (mail($destinatario, $asunto_email, $cuerpo_email, $headers)) {
        $respuesta['success'] = true;
        $respuesta['message'] = 'Mensaje enviado correctamente. Te contactaremos pronto.';
        
        // Log del mensaje (opcional)
        $log_message = date('Y-m-d H:i:s') . " - Mensaje de {$nombre} ({$email}) - Asunto: {$asunto_texto}\n";
        file_put_contents('../logs/contactos.log', $log_message, FILE_APPEND | LOCK_EX);
        
    } else {
        throw new Exception('Error al enviar el mensaje. Por favor intenta nuevamente.');
    }
    
} catch (Exception $e) {
    $respuesta['success'] = false;
    $respuesta['message'] = $e->getMessage();
}

// Devolver respuesta JSON
header('Content-Type: application/json');
echo json_encode($respuesta);
?>