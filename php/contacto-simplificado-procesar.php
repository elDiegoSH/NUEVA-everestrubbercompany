<?php
// php/contacto-simplificado-procesar.php

// Configuración
$destinatario = "ventas@grupoeverest.com.mx";
$asunto_base = "Contact from EVEREST® Group Website";

// Headers para el email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: no-reply@grupoeverest.com.mx" . "\r\n";
$headers .= "Reply-To: " . ($_POST['email'] ?? 'no-reply@grupoeverest.com.mx') . "\r\n";

// Función para sanitizar datos
function sanitizar($data) {
    if (is_array($data)) {
        return array_map('sanitizar', $data);
    }
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Función para validar email
function validarEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
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
        throw new Exception('Request detected as spam');
    }
    
    // Obtener y validar datos del formulario
    $nombre = sanitizar($_POST['nombre'] ?? '');
    $email = sanitizar($_POST['email'] ?? '');
    $telefono = sanitizar($_POST['telefono'] ?? '');
    $mensaje = sanitizar($_POST['mensaje'] ?? '');
    $math_answer = $_POST['math_answer'] ?? '';
    
    // Validar campos requeridos
    if (empty($nombre) || empty($email) || empty($telefono) || empty($mensaje) || empty($math_answer)) {
        throw new Exception('All fields marked with * are required');
    }
    
    // Validar email
    if (!validarEmail($email)) {
        throw new Exception('The email address is not valid');
    }
    
    // Validar longitud del mensaje
    if (strlen($mensaje) < 20) {
        throw new Exception('The message must be at least 20 characters long');
    }
    
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
        <div class='container'>
            <div class='header'>
                <h2>New Contact Message</h2>
                <p>Everest Group</p>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>Nombre:</span> {$nombre}
                </div>
                <div class='field'>
                    <span class='label'>Email:</span> {$email}
                </div>
                <div class='field'>
                    <span class='label'>Teléfono:</span> {$telefono}
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
                This message was sent from the contact form on the EVEREST® Group website.
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Asunto del email
    $asunto_email = "{$asunto_base}";
    
    // Enviar email
    if (mail($destinatario, $asunto_email, $cuerpo_email, $headers)) {
        $respuesta['success'] = true;
        $respuesta['message'] = 'Message sent successfully. We will contact you soon.';
        
        // Log del mensaje (opcional)
        $log_message = date('Y-m-d H:i:s') . " - Contacto Simplificado de {$nombre} ({$email})\n";
        file_put_contents('../logs/contactos-simplificados.log', $log_message, FILE_APPEND | LOCK_EX);
        
    } else {
        throw new Exception('Error sending message. Please try again.');
    }
    
} catch (Exception $e) {
    $respuesta['success'] = false;
    $respuesta['message'] = $e->getMessage();
}

// Devolver respuesta JSON
header('Content-Type: application/json');
echo json_encode($respuesta);
?>