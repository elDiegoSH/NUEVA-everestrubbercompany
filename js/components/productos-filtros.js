/**
 * SISTEMA DE FILTROS CON EFECTO HOVERDIR DIRECCIONAL - CON RESET MEJORADO
 */

document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-nav');
    const productCards = document.querySelectorAll('.product-card');
    const productsGrid = document.getElementById('productsGrid');

    if (filterBtns.length === 0 || productCards.length === 0) return;

    const cardData = Array.from(productCards).map(card => ({
        element: card,
        category: card.getAttribute('data-category'),
        isVisible: true
    }));

    productCards.forEach(card => {
        card.classList.add('visible');
        addHoverdirOverlay(card);
        initHoverdirEffect(card);
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const filter = this.getAttribute('data-filter');
            const cardsToShow = [];
            const cardsToHide = [];
            let visibleCount = 0;

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

            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            requestAnimationFrame(() => {
                cardsToHide.forEach(card => {
                    card.classList.remove('visible');
                    card.classList.add('hidden');
                });

                cardsToShow.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.remove('hidden');
                        card.classList.add('visible');
                    }, index * 80);
                });

                showNoProductsMessage(visibleCount);
            });
        });
    });

    function addHoverdirOverlay(card) {
        const imageContainer = card.querySelector('.product-image');
        const category = card.querySelector('.product-category').textContent;
        const title = card.querySelector('.product-title a').textContent;
        const info = card.querySelector('.product-info').textContent;
        const link = card.querySelector('.product-btn').getAttribute('href');
        
        if (imageContainer.querySelector('.product-overlay')) {
            return;
        }
        
        const overlay = document.createElement('div');
        overlay.className = 'product-overlay';
        overlay.innerHTML = `
            <span class="overlay-category">${category}</span>
            <h3 class="overlay-title">${title}</h3>
            <p class="overlay-info">${info}</p>
            <a href="${link}" class="overlay-btn">Explorar Hule →</a>
        `;
        
        imageContainer.appendChild(overlay);
    }

    function initHoverdirEffect(card) {
        const overlay = card.querySelector('.product-overlay');
        if (!overlay) return;

        let enterDirection = 'bottom';
        let isHovering = false;

        card.addEventListener('mouseenter', function(e) {
            isHovering = true;
            
            // RESET: Remover cualquier dirección anterior
            overlay.removeAttribute('data-direction');
            
            // Pequeño delay para permitir que el reset se procese
            setTimeout(() => {
                if (isHovering) {
                    enterDirection = getEnhancedDirection(e, this);
                    overlay.setAttribute('data-direction', enterDirection);
                    overlay.classList.add('active');
                }
            }, 10);
        });

        card.addEventListener('mouseleave', function(e) {
            isHovering = false;
            
            const exitDirection = getEnhancedExitDirection(e, this, enterDirection);
            overlay.setAttribute('data-direction', exitDirection);
            overlay.classList.remove('active');
            
            // RESET: Después de que termine la animación de salida, resetear
            setTimeout(() => {
                if (!isHovering) {
                    overlay.removeAttribute('data-direction');
                }
            }, 500); // Mismo tiempo que la duración de la transición CSS
        });

        // RESET adicional: Si el cursor se mueve muy rápido, forzar reset
        card.addEventListener('mousemove', function(e) {
            if (!isHovering) {
                isHovering = true;
                overlay.removeAttribute('data-direction');
                
                setTimeout(() => {
                    if (isHovering) {
                        enterDirection = getEnhancedDirection(e, this);
                        overlay.setAttribute('data-direction', enterDirection);
                        overlay.classList.add('active');
                    }
                }, 10);
            }
        });
    }

    function getEnhancedDirection(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const w = rect.width;
        const h = rect.height;
        
        // Método 1: Zonas de sensibilidad (prioritario para bordes)
        const edgeThreshold = Math.min(w, h) * 0.2; // 20% del lado más corto
        
        // Verificar si está cerca de los bordes
        if (x <= edgeThreshold) return 'left';
        if (x >= w - edgeThreshold) return 'right';
        if (y <= edgeThreshold) return 'top';
        if (y >= h - edgeThreshold) return 'bottom';
        
        // Método 2: Ángulos para zonas centrales
        return getDirectionFromAngle(e, element);
    }

    function getDirectionFromAngle(e, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const cursorX = e.clientX;
        const cursorY = e.clientY;
        
        const deltaX = cursorX - centerX;
        const deltaY = cursorY - centerY;
        const angle = Math.atan2(deltaY, deltaX);
        
        let degrees = angle * (180 / Math.PI);
        if (degrees < 0) degrees += 360;
        
        // Ajustamos los ángulos para mejor detección en rectángulos
        if (degrees >= 30 && degrees < 150) return 'bottom';
        if (degrees >= 150 && degrees < 210) return 'left';
        if (degrees >= 210 && degrees < 330) return 'top';
        return 'right';
    }

    function getEnhancedExitDirection(e, element, enterDirection) {
        const rect = element.getBoundingClientRect();
        const cursorX = e.clientX;
        const cursorY = e.clientY;
        
        // Detección precisa de borde de salida
        const exitThreshold = 10; // Píxeles de tolerancia
        
        const exitedLeft = cursorX <= rect.left + exitThreshold;
        const exitedRight = cursorX >= rect.right - exitThreshold;
        const exitedTop = cursorY <= rect.top + exitThreshold;
        const exitedBottom = cursorY >= rect.bottom - exitThreshold;
        
        // Priorizar detección exacta de bordes
        if (exitedLeft) return 'left';
        if (exitedRight) return 'right';
        if (exitedTop) return 'top';
        if (exitedBottom) return 'bottom';
        
        // Fallback: dirección opuesta a la entrada
        const oppositeDirections = {
            'top': 'bottom', 'bottom': 'top',
            'left': 'right', 'right': 'left'
        };
        
        return oppositeDirections[enterDirection] || 'bottom';
    }

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
    
    console.log('✅ Sistema de filtros Hoverdir con RESET MEJORADO inicializado');
});









