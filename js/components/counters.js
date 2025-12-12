// JavaScript Document
/**
 * CONTADORES ANIMADOS
 * Componente específico para los contadores numéricos
 */

document.addEventListener('DOMContentLoaded', function() {
    function initCounters() {
        const counters = document.querySelectorAll('.counter-value');
        
        // Preparar datos SIN interactuar con el DOM
        const counterData = Array.from(counters).map(counter => ({
            element: counter,
            target: parseInt(counter.getAttribute('data-to') || '0'),
            current: 0,
            increment: 0
        })).filter(data => data.target > 0);
        
        // Calcular increments una sola vez
        counterData.forEach(data => {
            data.increment = data.target / 200; // speed
        });
        
        // Función de animación optimizada
        function animateCounters() {
            let allComplete = true;
            
            counterData.forEach(data => {
                if (data.current < data.target) {
                    data.current += data.increment;
                    data.element.textContent = Math.ceil(data.current);
                    allComplete = false;
                } else {
                    data.element.textContent = data.target;
                }
            });
            
            if (!allComplete) {
                requestAnimationFrame(animateCounters);
            }
        }
        
        // Iniciar animación
        requestAnimationFrame(animateCounters);
    }
    
    // Inicializar contadores cuando sean visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    const counterSection = document.querySelector('.parallax-section, .airboss-stats-section');
    if (counterSection) {
        observer.observe(counterSection);
    }
    
    console.log('✅ Contadores animados inicializados');
});