// ========================================
// A&H WEALTH GROUP - INTERACTIVE FEATURES
// ========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');
            navbarToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navbarLinks = document.querySelectorAll('.navbar-link');
        navbarLinks.forEach(link => {
            link.addEventListener('click', function () {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            const isClickInsideNav = navbarMenu.contains(event.target) || navbarToggle.contains(event.target);
            if (!isClickInsideNav && navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            }
        });
    }

    // ========================================
    // SMOOTH SCROLL FOR NAVIGATION
    // ========================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
        }

        lastScroll = currentScroll;
    });

    // ========================================
    // FAQ ACCORDION
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');

        // Set initial state
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';
        answer.style.padding = '0 1.5rem';

        question.style.display = 'flex';
        question.style.justifyContent = 'space-between';
        question.style.alignItems = 'center';
        question.style.width = '100%';
        question.style.padding = '1.5rem';
        question.style.background = 'var(--color-white)';
        question.style.border = '2px solid var(--color-gray-light)';
        question.style.borderRadius = 'var(--radius-md)';
        question.style.cursor = 'pointer';
        question.style.fontSize = '1.125rem';
        question.style.fontWeight = '600';
        question.style.color = 'var(--color-primary-dark)';
        question.style.textAlign = 'left';
        question.style.transition = 'all 0.3s ease';
        question.style.marginBottom = '0';

        item.style.marginBottom = '1rem';

        icon.style.transition = 'transform 0.3s ease';
        icon.style.flexShrink = '0';
        icon.style.stroke = 'var(--color-accent-gold)';

        question.addEventListener('click', function () {
            const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    const otherQuestion = otherItem.querySelector('.faq-question');

                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.paddingTop = '0';
                    otherAnswer.style.paddingBottom = '0';
                    otherIcon.style.transform = 'rotate(0deg)';
                    otherQuestion.style.borderColor = 'var(--color-gray-light)';
                }
            });

            // Toggle current item
            if (isOpen) {
                answer.style.maxHeight = '0';
                answer.style.paddingTop = '0';
                answer.style.paddingBottom = '0';
                icon.style.transform = 'rotate(0deg)';
                question.style.borderColor = 'var(--color-gray-light)';
            } else {
                answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
                answer.style.paddingTop = '1rem';
                answer.style.paddingBottom = '1rem';
                icon.style.transform = 'rotate(180deg)';
                question.style.borderColor = 'var(--color-accent-gold)';
            }
        });
    });

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    animateOnScrollElements.forEach(element => {
        observer.observe(element);
    });

    // ========================================
    // CONTACT FORM HANDLING
    // ========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;

            // Create WhatsApp message
            const serviceNames = {
                'financial': 'Consultoría Financiera',
                'tax': 'Preparación de Impuestos',
                'insurance': 'Seguros de Vida',
                'credit': 'Reparación de Crédito',
                'planning': 'Planificación Financiera'
            };

            const whatsappMessage = `Hola, mi nombre es ${name}.%0A%0A` +
                `Servicio de interés: ${serviceNames[service]}%0A%0A` +
                `Email: ${email}%0A` +
                `Teléfono: ${phone}%0A%0A` +
                `Mensaje: ${message}`;

            // Redirect to WhatsApp
            const whatsappNumber = '17867941152'; // A&H Wealth Group Business Number
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

            window.open(whatsappURL, '_blank');

            // Reset form
            contactForm.reset();

            // Show success message
            showNotification('¡Mensaje enviado! Serás redirigido a WhatsApp.', 'success');
        });
    }

    // ========================================
    // NOTIFICATION SYSTEM
    // ========================================
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '100px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = 'var(--radius-md)';
        notification.style.boxShadow = 'var(--shadow-lg)';
        notification.style.zIndex = '9999';
        notification.style.fontWeight = '600';
        notification.style.animation = 'slideInRight 0.5s ease';
        notification.style.maxWidth = '300px';

        if (type === 'success') {
            notification.style.background = 'var(--color-success)';
            notification.style.color = 'white';
        } else {
            notification.style.background = 'var(--color-accent-gold)';
            notification.style.color = 'var(--color-primary-dark)';
        }

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // ========================================
    // WHATSAPP FLOAT BUTTON ANIMATION
    // ========================================
    const whatsappFloat = document.querySelector('.whatsapp-float');

    if (whatsappFloat) {
        // Add hover tooltip
        const tooltip = document.createElement('div');
        tooltip.textContent = '¿Necesitas ayuda?';
        tooltip.style.position = 'absolute';
        tooltip.style.right = '70px';
        tooltip.style.top = '50%';
        tooltip.style.transform = 'translateY(-50%)';
        tooltip.style.background = 'var(--color-primary-dark)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '0.5rem 1rem';
        tooltip.style.borderRadius = 'var(--radius-sm)';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s ease';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.fontSize = '0.875rem';
        tooltip.style.fontWeight = '600';

        whatsappFloat.style.position = 'relative';
        whatsappFloat.appendChild(tooltip);

        whatsappFloat.addEventListener('mouseenter', function () {
            tooltip.style.opacity = '1';
        });

        whatsappFloat.addEventListener('mouseleave', function () {
            tooltip.style.opacity = '0';
        });
    }

    // ========================================
    // FORM INPUT ANIMATIONS
    // ========================================
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');

    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.style.transform = 'translateY(-2px)';
        });

        input.addEventListener('blur', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // ========================================
    // LAZY LOADING FOR IMAGES
    // ========================================
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // ========================================
    // PERFORMANCE: Reduce animations on low-end devices
    // ========================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-base', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
    }

    // ========================================
    // CONSOLE MESSAGE
    // ========================================
    console.log('%c🏦 A&H Wealth Group LLC', 'font-size: 20px; font-weight: bold; color: #D4AF37;');
    console.log('%cProtegiendo su futuro financiero', 'font-size: 14px; color: #1a2942;');

});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Update WhatsApp number globally
function updateWhatsAppNumber(newNumber) {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        const currentHref = link.getAttribute('href');
        const newHref = currentHref.replace(/wa\.me\/\d+/, `wa.me/${newNumber}`);
        link.setAttribute('href', newHref);
    });
    console.log(`WhatsApp number updated to: ${newNumber}`);
}

// Example usage (call this function with your actual WhatsApp number):
// updateWhatsAppNumber('15551234567');
