// Variables globales
let currentVacancies = [...vacanciesData];
let activeFilters = {
    department: 'all',
    location: 'all',
    type: 'all',
    search: ''
};

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar contador de vacantes
    document.getElementById('vacancy-count').textContent = vacanciesData.length;
    
    // Cargar las vacantes
    renderVacancies(currentVacancies);
    
    // Configurar eventos de filtros
    setupFilterEvents();
    
    // Configurar eventos del modal
    setupModalEvents();
});

// Configurar eventos de filtros
function setupFilterEvents() {
    // Eventos para los selectores de filtro
    document.getElementById('department-filter').addEventListener('change', function(e) {
        activeFilters.department = e.target.value;
        applyFilters();
    });
    
    document.getElementById('location-filter').addEventListener('change', function(e) {
        activeFilters.location = e.target.value;
        applyFilters();
    });
    
    document.getElementById('type-filter').addEventListener('change', function(e) {
        activeFilters.type = e.target.value;
        applyFilters();
    });
    
    // Evento para búsqueda por texto
    document.getElementById('search-filter').addEventListener('input', function(e) {
        activeFilters.search = e.target.value.toLowerCase();
        applyFilters();
    });
    
    // Evento para aplicar filtros
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    
    // Evento para resetear filtros
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
}

// Aplicar filtros
function applyFilters() {
    // Obtener valores actuales de los filtros
    const departmentFilter = document.getElementById('department-filter').value;
    const locationFilter = document.getElementById('location-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const searchFilter = document.getElementById('search-filter').value.toLowerCase();
    
    // Filtrar vacantes
    const filteredVacancies = vacanciesData.filter(vacancy => {
        // Filtrar por departamento
        if (departmentFilter !== 'all' && vacancy.department !== departmentFilter) {
            return false;
        }
        
        // Filtrar por ubicación
        if (locationFilter !== 'all' && vacancy.location !== locationFilter) {
            return false;
        }
        
        // Filtrar por tipo de empleo
        if (typeFilter !== 'all' && vacancy.type !== typeFilter) {
            return false;
        }
        
        // Filtrar por texto de búsqueda
        if (searchFilter !== '') {
            const searchText = searchFilter.toLowerCase();
            const titleMatch = vacancy.title.toLowerCase().includes(searchText);
            const descMatch = vacancy.description.toLowerCase().includes(searchText);
            const deptMatch = getDepartmentName(vacancy.department).toLowerCase().includes(searchText);
            
            if (!titleMatch && !descMatch && !deptMatch) {
                return false;
            }
        }
        
        return true;
    });
    
    // Actualizar variable global y renderizar
    currentVacancies = filteredVacancies;
    renderVacancies(currentVacancies);
    
    // Actualizar contador
    document.getElementById('vacancy-count').textContent = filteredVacancies.length;
}

// Resetear filtros
function resetFilters() {
    // Resetear valores de filtros
    document.getElementById('department-filter').value = 'all';
    document.getElementById('location-filter').value = 'all';
    document.getElementById('type-filter').value = 'all';
    document.getElementById('search-filter').value = '';
    
    // Resetear filtros activos
    activeFilters = {
        department: 'all',
        location: 'all',
        type: 'all',
        search: ''
    };
    
    // Aplicar filtros (que mostrará todas las vacantes)
    applyFilters();
}

// Renderizar vacantes en el grid
function renderVacancies(vacancies) {
    const container = document.getElementById('vacancies-container');
    const noResults = document.getElementById('no-results');
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Mostrar mensaje si no hay resultados
    if (vacancies.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    // Ocultar mensaje de no resultados
    noResults.style.display = 'none';
    
    // Crear y añadir tarjetas de vacantes
    vacancies.forEach(vacancy => {
        const vacancyCard = createVacancyCard(vacancy);
        container.appendChild(vacancyCard);
    });
}

// Crear tarjeta de vacante
function createVacancyCard(vacancy) {
    const card = document.createElement('div');
    card.className = 'vacancy-card';
    card.setAttribute('data-id', vacancy.id);
    
    // Determinar etiquetas
    let tags = '';
    if (vacancy.urgent) {
        tags += '<span class="vacancy-tag tag-urgent">Urgente</span> ';
    }
    if (vacancy.new) {
        tags += '<span class="vacancy-tag tag-new">Nuevo</span>';
    }
    
    // Construir HTML de la tarjeta
    card.innerHTML = `
        <div class="vacancy-header">
            <h3 class="vacancy-title">${vacancy.title}</h3>
            <p class="vacancy-department">${getDepartmentName(vacancy.department)}</p>
        </div>
        <div class="vacancy-body">
            <div class="vacancy-info">
                <div class="vacancy-info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${getLocationName(vacancy.location)}</span>
                </div>
                <div class="vacancy-info-item">
                    <i class="fas fa-clock"></i>
                    <span>${getEmploymentType(vacancy.type)}</span>
                </div>
            </div>
            <div class="vacancy-description">
                <p>${vacancy.description.substring(0, 120)}...</p>
            </div>
            <div class="vacancy-footer">
                <div class="vacancy-date">
                    <i class="far fa-calendar-alt"></i> Publicada: ${formatDate(vacancy.date)}
                </div>
                <div class="vacancy-tags">
                    ${tags}
                </div>
            </div>
        </div>
    `;
    
    // Añadir evento de clic para abrir modal
    card.addEventListener('click', function() {
        openVacancyModal(vacancy.id);
    });
    
    return card;
}

// Configurar eventos del modal
function setupModalEvents() {
    const modal = document.getElementById('vacancy-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Cerrar modal al hacer clic en botones de cerrar
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// Abrir modal con detalles de la vacante
function openVacancyModal(vacancyId) {
    const modal = document.getElementById('vacancy-modal');
    const vacancy = vacanciesData.find(v => v.id === vacancyId);
    
    if (!vacancy) return;
    
    // Actualizar contenido del modal
    document.getElementById('modal-title').textContent = vacancy.title;
    document.getElementById('modal-location').textContent = getLocationName(vacancy.location);
    document.getElementById('modal-department').textContent = getDepartmentName(vacancy.department);
    document.getElementById('modal-type').textContent = getEmploymentType(vacancy.type);
    document.getElementById('modal-date').textContent = formatDate(vacancy.date);
    
    // Actualizar descripción
    const descriptionContainer = document.getElementById('modal-description');
    descriptionContainer.innerHTML = `<p>${vacancy.description}</p>`;
    
    // Actualizar requisitos
    const requirementsContainer = document.getElementById('modal-requirements');
    requirementsContainer.innerHTML = '<ul>' + 
        vacancy.requirements.map(req => `<li>${req}</li>`).join('') + 
        '</ul>';
    
    // Actualizar beneficios
    const benefitsContainer = document.getElementById('modal-benefits');
    benefitsContainer.innerHTML = '<ul>' + 
        vacancy.benefits.map(benefit => `<li>${benefit}</li>`).join('') + 
        '</ul>';
    
    // Actualizar enlace de postulación
    const applyButton = document.getElementById('apply-button');
    applyButton.href = `#apply-${vacancy.id}`;
    
    // Mostrar modal
    modal.style.display = 'block';
}