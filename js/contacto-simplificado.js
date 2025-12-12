// js/pages/contacto-simplificado.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-contacto-simplificado');
    const btnEnviar = document.getElementById('btn-enviar-simplificado');
    const mensajeExito = document.getElementById('mensaje-exito');
    const mensajeError = document.getElementById('mensaje-error');
    
    // Inicializar seguridad y pregunta matemática
    inicializarFormulario();
    
    // Validación en tiempo real
    form.addEventListener('input', function(e) {
        validarCampo(e.target);
    });
    
    // Envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormularioCompleto()) {
            enviarFormulario();
        }
    });
    
    function inicializarFormulario() {
        generarTokenSeguridad();
        generarPreguntaMatematica();
    }
    
    function generarTokenSeguridad() {
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        document.getElementById('token').value = token;
        document.getElementById('timestamp').value = Date.now();
    }
    
    function generarPreguntaMatematica() {
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
                // Asegurar que el resultado sea positivo
                const mayor = Math.max(num1, num2);
                const menor = Math.min(num1, num2);
                pregunta = `${mayor} - ${menor}`;
                respuesta = mayor - menor;
                break;
            case '*':
                pregunta = `${num1} × ${num2}`;
                respuesta = num1 * num2;
                break;
        }
        
        document.getElementById('math_question').textContent = pregunta;
        document.getElementById('math_question').dataset.respuesta = respuesta;
    }
    
    function validarCampo(campo) {
        const valor = campo.value.trim();
        const esRequerido = campo.hasAttribute('required');
        
        // Remover estados previos
        campo.classList.remove('is-valid', 'is-invalid');
        
        // Si el campo está vacío y es requerido
        if (esRequerido && valor === '') {
            campo.classList.add('is-invalid');
            return false;
        }
        
        // Validaciones específicas por tipo de campo
        let esValido = true;
        
        switch(campo.type) {
            case 'email':
                if (!validarEmail(valor)) {
                    campo.classList.add('is-invalid');
                    esValido = false;
                }
                break;
                
            case 'tel':
                if (!validarTelefono(valor)) {
                    campo.classList.add('is-invalid');
                    esValido = false;
                }
                break;
                
            case 'number':
                if (campo.id === 'math_answer') {
                    const respuestaCorrecta = parseInt(document.getElementById('math_question').dataset.respuesta);
                    const respuestaUsuario = parseInt(valor);
                    
                    if (isNaN(respuestaUsuario) || respuestaUsuario !== respuestaCorrecta) {
                        campo.classList.add('is-invalid');
                        esValido = false;
                    }
                }
                break;
        }
        
        // Validación de textarea
        if (campo.id === 'mensaje' && valor.length < 20) {
            campo.classList.add('is-invalid');
            esValido = false;
        }
        
        // Validación de checkbox
        if (campo.type === 'checkbox' && !campo.checked) {
            campo.classList.add('is-invalid');
            esValido = false;
        }
        
        // Si el campo es válido y tiene contenido
        if (esValido && (valor !== '' || (campo.type === 'checkbox' && campo.checked))) {
            campo.classList.add('is-valid');
        }
        
        return esValido;
    }
    
    function validarFormularioCompleto() {
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
        
        // Verificar honeypot (anti-spam)
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
        // Permitir números con espacios, guiones, paréntesis y signo +
        const regex = /^[\d\s\-\+\(\)]{10,}$/;
        return regex.test(telefono.replace(/\s/g, ''));
    }
    
    function enviarFormulario() {
        // Mostrar estado de carga
        mostrarEstadoCarga(true);
        
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
                inicializarFormulario();
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
            mostrarEstadoCarga(false);
        });
    }
    
    function mostrarEstadoCarga(mostrar) {
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
        
        // Scroll al mensaje de éxito
        mensajeExito.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function mostrarError(mensaje) {
        const textoError = document.getElementById('texto-error');
        textoError.textContent = mensaje;
        mensajeError.classList.remove('d-none');
        mensajeExito.classList.add('d-none');
        
        // Scroll al mensaje de error
        mensajeError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function ocultarMensajes() {
        mensajeExito.classList.add('d-none');
        mensajeError.classList.add('d-none');
    }
});