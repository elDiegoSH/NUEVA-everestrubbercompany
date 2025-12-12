/**
 * GRUPO EVEREST - MAIN.JS
 * Funcionalidades principales del sitio
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Grupo Everest - Inicializando funcionalidades...');
    
    // =========================
    // NAVBAR SCROLL EFFECT
    // =========================
    const navbar = document.querySelector('.navbar');
    
    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // =========================
    // BACK TO TOP BUTTON
    // =========================
    const backToTop = document.getElementById('backToTop');
    
    function handleBackToTop() {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
    
    function scrollToTop(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
// =========================
// CONTADORES ANIMADOS (MÁS OPTIMIZADO)
// =========================
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
    
    // =========================
    // INICIALIZAR TODO
    // =========================
    function init() {
        // Event listeners
        window.addEventListener('scroll', function() {
            handleNavbarScroll();
            handleBackToTop();
        });
        
        // Back to top
        if (backToTop) {
            backToTop.addEventListener('click', scrollToTop);
        }
        
        // Inicializar contadores cuando sean visibles
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        const counterSection = document.querySelector('.parallax-section');
        if (counterSection) {
            observer.observe(counterSection);
        }
        
        console.log('✅ Todas las funcionalidades inicializadas correctamente');
    }
    
    // Ejecutar inicialización
    init();
});

// =========================
// FUNCIONES GLOBALES
// =========================

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Preloader (opcional)
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
});









// SOLUCIÓN MÁS SIMPLE - Navbar fixed cuando topbar ya no es visible
document.addEventListener('DOMContentLoaded', function() {
  const topbar = document.querySelector('.topbar');
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) { // Cuando hayas hecho un poco de scroll
      navbar.style.position = 'fixed';
      navbar.style.top = '0';
      navbar.style.width = '100%';
      navbar.style.background = '#fff';
      navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
      navbar.style.position = 'relative';
      navbar.style.background = '';
      navbar.style.boxShadow = '';
    }
  });
});










// Hover optimizado para dropdowns (CERO REFLOW)
document.addEventListener('DOMContentLoaded', function() {
    // Leer innerWidth UNA sola vez al inicio
    const isDesktop = window.innerWidth >= 992;
    
    if (!isDesktop) return; // Salir inmediatamente si no es desktop
    
    const dropdowns = document.querySelectorAll('.navbar-nav .dropdown, .dropdown-submenu');
    
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (menu) {
            let hideTimer;
            
            // Pre-configurar estilos (una sola vez)
            Object.assign(menu.style, {
                transition: 'opacity 0.3s ease, visibility 0.3s ease',
                willChange: 'opacity, visibility'
            });
            
            // Mostrar
            dropdown.addEventListener('mouseenter', function() {
                clearTimeout(hideTimer);
                Object.assign(menu.style, {
                    opacity: '1',
                    visibility: 'visible',
                    display: 'block'
                });
            });
            
            // Ocultar
            dropdown.addEventListener('mouseleave', function() {
                hideTimer = setTimeout(() => {
                    Object.assign(menu.style, {
                        opacity: '0',
                        visibility: 'hidden'
                    });
                    setTimeout(() => {
                        menu.style.display = 'none';
                    }, 300);
                }, 500);
            });
            
            // Cancelar ocultar
            menu.addEventListener('mouseenter', function() {
                clearTimeout(hideTimer);
                Object.assign(menu.style, {
                    opacity: '1',
                    visibility: 'visible'
                });
            });
        }
    });
});




// Sistema de Filtros para Rollos y Placas OPTIMIZADO (sin reflow)
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const productsGrid = document.getElementById('productsGrid');

    // Pre-cache de categorías para evitar reflows
    const cardData = Array.from(productCards).map(card => ({
        element: card,
        category: card.getAttribute('data-category'),
        isVisible: true
    }));

    // Inicializar todas las cards como visibles (una sola operación)
    productCards.forEach(card => {
        card.classList.add('visible');
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // FASE 1: Solo lecturas (sin cambios al DOM)
            const filter = this.getAttribute('data-filter');
            const cardsToShow = [];
            const cardsToHide = [];
            let visibleCount = 0;

            // Pre-calcular qué elementos mostrar/ocultar
            cardData.forEach(data => {
                const shouldShow = filter === 'all' || data.category === filter;
                
                if (shouldShow) {
                    visibleCount++;
                    if (!data.isVisible) {
                        cardsToShow.push(data.element);
                    }
                } else {
                    if (data.isVisible) {
                        cardsToHide.push(data.element);
                    }
                }
                
                data.isVisible = shouldShow;
            });

            // FASE 2: Actualizar botones activos (operación única)
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // FASE 3: Aplicar cambios al DOM en batch
            requestAnimationFrame(() => {
                // Ocultar elementos
                cardsToHide.forEach(card => {
                    card.classList.remove('visible');
                    card.classList.add('hidden');
                });

                // Mostrar elementos con delay escalonado
                cardsToShow.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.remove('hidden');
                        card.classList.add('visible');
                    }, index * 80);
                });

                // Mostrar mensaje si no hay productos
                showNoProductsMessage(visibleCount);
            });
        });
    });

    function showNoProductsMessage(visibleCount) {
        let existingMessage = document.getElementById('no-products-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        if (visibleCount === 0) {
            const message = document.createElement('div');
            message.id = 'no-products-message';
            message.className = 'no-products-message';
            message.innerHTML = `
                <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No hay productos en esta categoría</h4>
                <p class="text-muted">Prueba con otra categoría o consulta nuestro catálogo completo</p>
                <a href="rollos-y-placas-de-hule/" class="product-btn mt-3">Ver todos los productos</a>
            `;
            productsGrid.appendChild(message);
        }
    }
});





// Carousel de Testimonios con animación de desplazamiento
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.testimonio-slide');
    const dotsContainer = document.querySelector('.testimonios-dots');
    const prevBtn = document.querySelector('.testimonio-prev');
    const nextBtn = document.querySelector('.testimonio-next');
    let currentSlide = 0;
    let autoPlayInterval;
    let isAnimating = false;

    // Configuración
    const config = {
        autoPlayDelay: 10000, // 10 segundos
        transitionDuration: 600 // 0.6 segundos para animación
    };

    // Crear dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('testimonio-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => !isAnimating && goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.testimonio-dot');

    function goToSlide(n) {
        if (isAnimating) return;
        isAnimating = true;

        const nextSlideIndex = (n + slides.length) % slides.length;
        
        // Quitar clases activas
        slides[currentSlide].classList.remove('active', 'prev');
        dots[currentSlide].classList.remove('active');
        
        // Determinar dirección de la animación
        const direction = nextSlideIndex > currentSlide ? 'next' : 'prev';
        
        // Aplicar clases para animación
        slides[nextSlideIndex].classList.add(direction);
        
        setTimeout(() => {
            slides[nextSlideIndex].classList.add('active');
            slides[nextSlideIndex].classList.remove('prev', 'next');
            
            dots[nextSlideIndex].classList.add('active');
            
            currentSlide = nextSlideIndex;
            isAnimating = false;
        }, config.transitionDuration);
        
        resetAutoPlay();
    }

    function nextSlide() {
        if (!isAnimating) goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        if (!isAnimating) goToSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, config.autoPlayDelay);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Pausar autoplay al interactuar
    const carousel = document.querySelector('.testimonios-carousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        startAutoPlay();
    });

    // Iniciar
    slides[0].classList.add('active');
    setTimeout(startAutoPlay, 2000);
});







