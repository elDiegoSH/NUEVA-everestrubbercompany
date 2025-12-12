// js/contacto.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-contacto');
    const btnEnviar = document.getElementById('btn-enviar');
    const mensajeExito = document.getElementById('mensaje-exito');
    const mensajeError = document.getElementById('mensaje-error');
    
    // Generar token de seguridad y timestamp
    generarSeguridad();
    
    // Generar pregunta antispam
    generarPreguntaAntispam();
    
    // Validación en tiempo real
    form.addEventListener('input', function(e) {
        validarCampo(e.target);
    });
    
    // Envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormulario()) {
            enviarFormulario();
        }
    });
    
    function generarSeguridad() {
        // Token único por sesión
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        document.getElementById('token').value = token;
        document.getElementById('timestamp').value = Date.now();
    }
    
    function generarPreguntaAntispam() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operadores = ['+', '-', '*'];
        const operador = operadores[Math.floor(Math.random() * operadores.length)];
        
        let pregunta = '';
        let respuesta = 0;
        
        switch(operador) {
            case '+':
                pregunta = `${num1} + ${num2}`;
                respuesta = num1 + num2;
                break;
            case '-':
                pregunta = `${num1} - ${num2}`;
                respuesta = num1 - num2;
                break;
            case '*':
                pregunta = `${num1} × ${num2}`;
                respuesta = num1 * num2;
                break;
        }
        
        document.getElementById('spam_question').textContent = pregunta;
        document.getElementById('spam_question').dataset.respuesta = respuesta;
    }
    
    function validarCampo(campo) {
        const valor = campo.value.trim();
        const esRequerido = campo.hasAttribute('required');
        
        // Remover estados previos
        campo.classList.remove('is-valid', 'is-invalid');
        
        // Validar campo vacío para requeridos
        if (esRequerido && valor === '') {
            campo.classList.add('is-invalid');
            return false;
        }
        
        // Validaciones específicas por tipo de campo
        switch(campo.type) {
            case 'email':
                if (!validarEmail(valor)) {
                    campo.classList.add('is-invalid');
                    return false;
                }
                break;
                
            case 'tel':
                if (!validarTelefono(valor)) {
                    campo.classList.add('is-invalid');
                    return false;
                }
                break;
        }
        
        // Validación de textarea
        if (campo.id === 'mensaje' && valor.length < 20) {
            campo.classList.add('is-invalid');
            return false;
        }
        
        // Validación de spam check
        if (campo.id === 'spam_check') {
            const respuestaCorrecta = document.getElementById('spam_question').dataset.respuesta;
            if (parseInt(valor) !== parseInt(respuestaCorrecta)) {
                campo.classList.add('is-invalid');
                return false;
            }
        }
        
        // Si pasa todas las validaciones
        if (esRequerido || valor !== '') {
            campo.classList.add('is-valid');
        }
        
        return true;
    }
    
    function validarFormulario() {
        let esValido = true;
        const camposRequeridos = form.querySelectorAll('[required]');
        
        // Ocultar mensajes previos
        ocultarMensajes();
        
        // Validar cada campo requerido
        camposRequeridos.forEach(campo => {
            if (!validarCampo(campo)) {
                esValido = false;
                // Efecto visual para campo inválido
                campo.classList.add('shake');
                setTimeout(() => campo.classList.remove('shake'), 500);
            }
        });
        
        // Verificar honeypot
        const honeypot = document.getElementById('website');
        if (honeypot.value !== '') {
            console.log('Spam detectado');
            return false;
        }
        
        return esValido;
    }
    
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    function validarTelefono(telefono) {
        const regex = /^[\d\s\-\+\(\)]{10,}$/;
        return regex.test(telefono.replace(/\s/g, ''));
    }
    
    function enviarFormulario() {
        // Mostrar estado de carga
        mostrarCarga(true);
        
        // Preparar datos del formulario
        const formData = new FormData(form);
        
        // Enviar via Fetch API
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                mostrarExito(data.message || 'Mensaje enviado correctamente');
                form.reset();
                generarSeguridad();
                generarPreguntaAntispam();
                // Remover clases de validación
                form.querySelectorAll('.is-valid').forEach(el => {
                    el.classList.remove('is-valid');
                });
            } else {
                throw new Error(data.message || 'Error al enviar el mensaje');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarError(error.message || 'Error al enviar el mensaje. Por favor intenta nuevamente.');
        })
        .finally(() => {
            mostrarCarga(false);
        });
    }
    
    function mostrarCarga(mostrar) {
        const btnText = btnEnviar.querySelector('.btn-text');
        const btnLoading = btnEnviar.querySelector('.btn-loading');
        
        if (mostrar) {
            btnText.classList.add('d-none');
            btnLoading.classList.remove('d-none');
            btnEnviar.disabled = true;
        } else {
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
            btnEnviar.disabled = false;
        }
    }
    
    function mostrarExito(mensaje) {
        const textoExito = document.getElementById('texto-exito');
        textoExito.textContent = mensaje;
        mensajeExito.classList.remove('d-none');
        mensajeError.classList.add('d-none');
        
        // Scroll to top del formulario
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    function mostrarError(mensaje) {
        const textoError = document.getElementById('texto-error');
        textoError.textContent = mensaje;
        mensajeError.classList.remove('d-none');
        mensajeExito.classList.add('d-none');
        
        // Scroll to top del formulario
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    function ocultarMensajes() {
        mensajeExito.classList.add('d-none');
        mensajeError.classList.add('d-none');
    }
});