// JavaScript Document
// TIMELINE INTERACTIVA
document.addEventListener('DOMContentLoaded', function() {
    const timelineYears = document.querySelectorAll('.timeline-year');
    const timelineContents = document.querySelectorAll('.timeline-content');
    
    if (timelineYears.length > 0) {
        // Función para cambiar año activo
        function setActiveYear(year) {
            // Remover activo de todos los años
            timelineYears.forEach(y => y.classList.remove('active'));
            // Ocultar todos los contenidos
            timelineContents.forEach(c => c.classList.remove('active'));
            
            // Activar año seleccionado
            const selectedYear = document.querySelector(`.timeline-year[data-year="${year}"]`);
            const selectedContent = document.querySelector(`.timeline-content[data-year="${year}"]`);
            
            if (selectedYear && selectedContent) {
                selectedYear.classList.add('active');
                selectedContent.classList.add('active');
            }
        }
        
        // Event listeners para los años
        timelineYears.forEach(year => {
            year.addEventListener('click', function() {
                const yearValue = this.getAttribute('data-year');
                setActiveYear(yearValue);
            });
        });
        
        // Inicializar con el primer año activo
        const firstYear = timelineYears[0].getAttribute('data-year');
        setActiveYear(firstYear);
    }
});