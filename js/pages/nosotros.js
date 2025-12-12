document.addEventListener("DOMContentLoaded", function () {

    // Ejecutar solo en la página de "nosotros"
    if (window.location.pathname.includes("nosotros")) {

        const modalEl = document.getElementById('modalNosotros');
        const modal = new bootstrap.Modal(modalEl);
        const video = document.getElementById("videoNosotros");

        // ⏳ Abrir el modal automáticamente después de 5 segundos
        setTimeout(() => {
            modal.show();
        }, 3000);

        // ▶️ Reproducir video al abrir el modal
        modalEl.addEventListener('shown.bs.modal', () => {
            video.currentTime = 0;
            video.play();
        });

        // ❌ Cerrar modal automáticamente al terminar el video
        video.addEventListener('ended', () => {
            modal.hide();
        });

        // ⏸️ Pausar si el usuario lo cierra manualmente
        modalEl.addEventListener('hidden.bs.modal', () => {
            video.pause();
        });

    }
});