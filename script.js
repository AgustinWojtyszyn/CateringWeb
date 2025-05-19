document.addEventListener('DOMContentLoaded', function() {
    // Efecto hover mejorado para las tarjetas de servicios
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Añadir transición suave
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });
    
    // Navegación activa mejorada
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Manejar página de inicio y otras páginas
        if ((currentPage === '' || currentPage === 'index.html') && linkPath === 'index.html') {
            link.classList.add('active');
        } else if (linkPath === currentPage && currentPage !== 'index.html') {
            link.classList.add('active');
        }
        
        // Mejor manejo del clic para SPA (Single Page Application)
        link.addEventListener('click', function(e) {
            // Solo actualizar la clase si no es un enlace externo
            if (!this.href.includes('http') || this.href.includes(window.location.host)) {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Simular cambio de página (para SPA)
                setTimeout(() => {
                    window.location.href = this.href;
                }, 300);
            }
        });
    });
    
    // Animación de carga mejorada
    const body = document.body;
    body.style.opacity = '0';
    body.style.transition = 'opacity 0.5s ease';
    
    // Usar requestAnimationFrame para mejor rendimiento
    requestAnimationFrame(() => {
        body.style.opacity = '1';
    });
    
    // --------------------------
    // Funcionalidades adicionales recomendadas para catering:
    // --------------------------
    
    // 1. Botón de reserva flotante
    const reserveBtn = document.createElement('button');
    reserveBtn.className = 'floating-reserve-btn';
    reserveBtn.textContent = 'Reservar Ahora';
    reserveBtn.addEventListener('click', () => {
        // Lógica para abrir formulario de reserva
        document.querySelector('.reservation-form')?.scrollIntoView({ behavior: 'smooth' });
    });
    document.body.appendChild(reserveBtn);
    
    // 2. Galería de imágenes interactiva
    const galleryImages = document.querySelectorAll('.gallery-img');
    if (galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                // Crear modal para ver imagen ampliada
                const modal = document.createElement('div');
                modal.className = 'image-modal';
                modal.innerHTML = `
                    <span class="close-modal">&times;</span>
                    <img src="${img.src}" alt="${img.alt}">
                    <p>${img.dataset.description || ''}</p>
                `;
                
                modal.querySelector('.close-modal').addEventListener('click', () => {
                    document.body.removeChild(modal);
                });
                
                document.body.appendChild(modal);
            });
        });
    }
    
    // 3. Contador para eventos próximos
    const eventCounters = document.querySelectorAll('.event-counter');
    if (eventCounters.length > 0) {
        eventCounters.forEach(counter => {
            const eventDate = new Date(counter.dataset.eventDate);
            updateCounter(counter, eventDate);
            
            // Actualizar cada segundo
            setInterval(() => updateCounter(counter, eventDate), 1000);
        });
    }
    
    function updateCounter(element, targetDate) {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            element.innerHTML = '¡El evento está en curso!';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        element.innerHTML = `
            <div class="counter-item">
                <span class="counter-value">${days}</span>
                <span class="counter-label">días</span>
            </div>
            <div class="counter-item">
                <span class="counter-value">${hours}</span>
                <span class="counter-label">horas</span>
            </div>
            <div class="counter-item">
                <span class="counter-value">${minutes}</span>
                <span class="counter-label">min</span>
            </div>
            <div class="counter-item">
                <span class="counter-value">${seconds}</span>
                <span class="counter-label">seg</span>
            </div>
        `;
    }
});
