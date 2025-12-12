// parallax.js - SOLO CONTADORES (el parallax es solo CSS)
document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ Script parallax cargado - Solo contadores");
  
  // CONTADORES ANIMADOS
  const counters = document.querySelectorAll('.counter-value');
  console.log("Contadores encontrados:", counters.length);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const target = parseInt(element.getAttribute('data-to'));
        let current = 0;
        
        console.log("🎯 Contador activado:", target);
        
        const timer = setInterval(() => {
          current += Math.ceil(target / 50);
          if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
            console.log("✅ Contador completado:", target);
          } else {
            element.textContent = current.toLocaleString();
          }
        }, 40);
        
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.3 });
  
  counters.forEach(counter => observer.observe(counter));
});




// certifications-scroll.js - Versión mejorada
document.addEventListener('DOMContentLoaded', function() {
  const track = document.getElementById('certificationsTrack');
  const container = document.querySelector('.certifications-scroll-container');
  
  if (!track) return;
  
  // Reset de animación para evitar cortes
  function resetAnimation() {
    track.style.animation = 'none';
    void track.offsetWidth; // Trigger reflow
    track.style.animation = null;
  }
  
  // Reset cada cierto tiempo para evitar acumulación de errores
  setInterval(resetAnimation, 60000); // Reset cada minuto
  
  console.log('✅ Carrusel infinito mejorado activado');
});