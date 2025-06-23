document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animate stats on scroll
    const stats = [
        { element: 'clients-count', target: 50, suffix: '+', format: 'int' },
        { element: 'revenue-count', target: 500000, suffix: '+', prefix: '$', format: 'currency' },
        { element: 'growth-count', target: 150, suffix: '%+', format: 'int' },
        { element: 'success-count', target: 98, suffix: '%', format: 'int' }
    ];

    let statsAnimated = false; // Flag to ensure animation runs only once

    function animateStats() {
        if (statsAnimated) return; // Prevent re-animation

        stats.forEach(stat => {
            const element = document.getElementById(stat.element);
            const target = stat.target;
            let current = 0;
            const duration = 2500; // 2.5 seconds for a smoother animation
            const startTime = performance.now();

            function updateCount(timestamp) {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1); // Clamp progress between 0 and 1

                let displayValue;
                if (stat.format === 'currency') {
                    displayValue = (progress * target).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                } else {
                    displayValue = Math.floor(progress * target);
                }

                element.textContent = (stat.prefix || '') + displayValue + (stat.suffix || '');

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    // Ensure final value is exactly the target
                    if (stat.format === 'currency') {
                        element.textContent = (stat.prefix || '') + target.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + (stat.suffix || '');
                    } else {
                        element.textContent = (stat.prefix || '') + target + (stat.suffix || '');
                    }
                }
            }
            requestAnimationFrame(updateCount);
        });
        statsAnimated = true;
    }

    // Trigger stats animation when section is visible using Intersection Observer
    const statsSection = document.querySelector('.stats');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is visible
    observer.observe(statsSection);

    // Formspree handles the submission, so custom JS form handling is removed.
    // document.getElementById('contactForm').addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     const formData = new FormData(this);
    //     const name = formData.get('name');
    //     alert(`Thank you ${name}! Your inquiry has been sent to Apex Creator Studios. We'll be in touch within 24 hours to discuss your potential.`);
    //     this.reset();
    // });

    // Add scroll animation to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply animation only once and with a delay for staggered effect
                entry.target.style.animation = `fadeInUp 1s ease forwards ${entry.target.dataset.delay || 0}s`;
                cardObserver.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, { threshold: 0.2 }); // Trigger when 20% of the card is visible

    serviceCards.forEach((card, index) => {
        card.dataset.delay = index * 0.15; // Set a data-delay attribute for staggered animation
        cardObserver.observe(card);
    });
});