// Datos de las vacantes disponibles
const vacanciesData = [
    /*
    {
        id: 1,
        title: "Operador de Máquinas CNC",
        department: "manufactura",
        location: "toluca",
        type: "tiempo-completo",
        description: "Buscamos operador de máquinas CNC con experiencia en el manejo de equipos de corte y fabricación de piezas de hule y materiales industriales.",
        requirements: [
            "Experiencia mínima de 2 años en operación de máquinas CNC",
            "Conocimiento en lectura de planos",
            "Disponibilidad para turnos rotativos"
        ],
        benefits: [
            "Salario competitivo",
            "Prestaciones de ley superiores",
            "Capacitación constante",
            "Oportunidades de crecimiento"
        ],
        date: "2023-10-15",
        urgent: true,
        new: true
    },*/
    
];

// Función para formatear fecha
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Función para traducir departamento
function getDepartmentName(department) {
    const departments = {
        'manufactura': 'Manufactura',
        'ventas': 'Ventas',
        'administracion': 'Administración',
        'logistica': 'Logística',
        'calidad': 'Control de Calidad'
    };
    return departments[department] || department;
}

// Función para traducir tipo de empleo
function getEmploymentType(type) {
    const types = {
        'tiempo-completo': 'Tiempo Completo',
        'medio-tiempo': 'Medio Tiempo',
        'temporal': 'Temporal'
    };
    return types[type] || type;
}

// Función para traducir ubicación
function getLocationName(location) {
    const locations = {
        //'toluca': 'Toluca, Estado de México',
        'mexico': 'Ciudad de México',
        //'guadalajara': 'Guadalajara, Jalisco',
        //'monterrey': 'Monterrey, Nuevo León'
    };
    return locations[location] || location;
}