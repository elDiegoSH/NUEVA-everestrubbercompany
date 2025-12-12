// JavaScript Document
/**
 * CAROUSEL DE TESTIMONIOS
 * Componente específico para el carousel de testimonios
 */

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.testimonio-slide');
    const dotsContainer = document.querySelector('.testimonios-dots');
    const prevBtn = document.querySelector('.testimonio-prev');
    const nextBtn = document.querySelector('.testimonio-next');
    
    if (slides.length === 0) return;
    
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
    
    console.log('✅ Carousel de testimonios inicializado');
});