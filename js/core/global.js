/**
 * GRUPO EVEREST - GLOBAL JS ULTRA OPTIMIZADO
 * Cero reflows forzados - Navbar fixed EN TODOS los dispositivos
 */
(function() {
    'use strict';
    
    // =========================
    // CONFIGURACIÓN
    // =========================
    const CONFIG = {
        SCROLL_THROTTLE: 16, // 60fps
        NAVBAR_SCROLL_THRESHOLD: 100,
        BACKTOTOP_THRESHOLD: 300
    };
    
    // =========================
    // CACHE DE ELEMENTOS (UNA sola vez)
    // =========================
    let navbar = null;
    let backToTop = null;
    let isInitialized = false;
    
    // =========================
    // STATE MANAGEMENT (evita DOM queries)
    // =========================
    const state = {
        isScrolling: false,
        navbarScrolled: false,
        backToTopVisible: false,
        navbarFixed: false,
        lastScrollY: 0
    };
    
    // =========================
    // UTILITIES
    // =========================
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // =========================
    // NAVBAR SCROLL (SIN REFLOWS)
    // =========================
    function handleNavbarScroll() {
        if (!navbar || state.isScrolling) return;
        
        state.isScrolling = true;
        
        requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const shouldBeScrolled = currentScrollY > CONFIG.NAVBAR_SCROLL_THRESHOLD;
            
            // Solo actualizar si cambió el estado
            if (shouldBeScrolled !== state.navbarScrolled) {
                if (shouldBeScrolled) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                state.navbarScrolled = shouldBeScrolled;
            }
            
            state.lastScrollY = currentScrollY;
            state.isScrolling = false;
        });
    }
    
    // =========================
    // BACK TO TOP (SIN REFLOWS)
    // =========================
    function handleBackToTop() {
        if (!backToTop) return;
        
        requestAnimationFrame(() => {
            const shouldShow = state.lastScrollY > CONFIG.BACKTOTOP_THRESHOLD;
            
            if (shouldShow !== state.backToTopVisible) {
                if (shouldShow) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
                state.backToTopVisible = shouldShow;
            }
        });
    }
    
    function scrollToTop(e) {
        if (e) e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // =========================
    // SMOOTH SCROLL (OPTIMIZADO)
    // =========================
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                // Usar requestAnimationFrame para evitar reflow
                requestAnimationFrame(() => {
                    const target = document.querySelector(targetId);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        });
    }
    
    // =========================
    // DROPDOWNS (OPTIMIZADO - solo desktop)
    // =========================
    function initDropdowns() {
        if (window.innerWidth < 992) return;
        
        const dropdowns = document.querySelectorAll('.navbar-nav .dropdown, .dropdown-submenu');
        
        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (!menu) return;
            
            let hideTimer;
            let isVisible = false;
            
            // Configurar una sola vez
            if (!menu.style.transition) {
                Object.assign(menu.style, {
                    transition: 'opacity 0.3s ease, visibility 0.3s ease',
                    willChange: 'opacity, visibility'
                });
            }
            
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hideTimer);
                if (!isVisible) {
                    Object.assign(menu.style, {
                        opacity: '1',
                        visibility: 'visible',
                        display: 'block'
                    });
                    isVisible = true;
                }
            });
            
            dropdown.addEventListener('mouseleave', () => {
                hideTimer = setTimeout(() => {
                    if (isVisible) {
                        Object.assign(menu.style, {
                            opacity: '0',
                            visibility: 'hidden'
                        });
                        setTimeout(() => {
                            if (menu.style.opacity === '0') {
                                menu.style.display = 'none';
                                isVisible = false;
                            }
                        }, 300);
                    }
                }, 500);
            });
        });
    }
    
    // =========================
    // NAVBAR FIXED (EN TODOS LOS DISPOSITIVOS)
    // =========================
    function initNavbarFixed() {
        if (!navbar) return;
        
        let navbarFixed = false;
        
        window.addEventListener('scroll', function() {
            requestAnimationFrame(() => {
                const shouldFix = window.scrollY > 50;
                
                if (shouldFix && !navbarFixed) {
                    Object.assign(navbar.style, {
                        position: 'fixed',
                        top: '0',
                        width: '100%',
                        background: '#fff',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        zIndex: '1020'
                    });
                    navbarFixed = true;
                    
                } else if (!shouldFix && navbarFixed) {
                    Object.assign(navbar.style, {
                        position: 'relative',
                        background: '',
                        boxShadow: '',
                        zIndex: ''
                    });
                    navbarFixed = false;
                }
            });
        });
    }
    
    // =========================
    // SCROLL HANDLER UNIFICADO
    // =========================
    function handleScroll() {
        state.lastScrollY = window.scrollY;
        handleNavbarScroll();
        handleBackToTop();
    }
    
    // =========================
    // INICIALIZACIÓN
    // =========================
    function init() {
        if (isInitialized) return;
        
        // Cache de elementos (UNA sola vez)
        navbar = document.querySelector('.navbar');
        backToTop = document.getElementById('backToTop');
        
        // Inicializar componentes
        initSmoothScroll();
        initDropdowns();
        initNavbarFixed(); // Navbar fixed en todos los dispositivos
        
        // Event listeners optimizados
        const throttledScroll = throttle(handleScroll, CONFIG.SCROLL_THRESHOLD);
        window.addEventListener('scroll', throttledScroll, { passive: true });
        
        if (backToTop) {
            backToTop.addEventListener('click', scrollToTop);
        }
        
        // Initial state
        handleScroll();
        
        isInitialized = true;
        console.log('✅ Grupo Everest - JS optimizado inicializado');
    }
    
    // =========================
    // EXPORTAR PARA USO GLOBAL
    // =========================
    window.GrupoEverest = {
        init: init,
        scrollToTop: scrollToTop
    };
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

// Preloader sin reflows
window.addEventListener('load', function() {
    requestAnimationFrame(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
        }
    });
});







// ESTE SCRIPT PARA HABILITAR LOS LINKS 
document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggles = document.querySelectorAll('.nav-item.dropdown > .nav-link.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const isMobile = window.innerWidth < 992; // Bootstrap lg breakpoint
            
            // Si es móvil o el dropdown NO está abierto, permitir navegación
            if (href && href !== '#' && (isMobile || !this.parentElement.classList.contains('show'))) {
                e.preventDefault();
                window.location.href = href;
            }
            // Si es desktop y el dropdown está abierto, Bootstrap maneja el toggle
        });
    });
});