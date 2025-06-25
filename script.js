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
        { element: 'clients-count', target: 250, suffix: '+', format: 'int' }, // Updated based on index.html
        { element: 'revenue-count', target: 40, suffix: 'M+', prefix: 'R', format: 'currency' }, // Updated based on index.html
        { element: 'growth-count', target: 900, suffix: '%', format: 'int' }, // Updated based on index.html (removed extra '+')
        { element: 'success-count', target: 98, suffix: '%', format: 'int' }
    ];

    let statsAnimated = false; // Flag to ensure animation runs only once

    function animateStats() {
        if (statsAnimated) return; // Prevent re-animation

        stats.forEach(stat => {
            const element = document.getElementById(stat.element);
            const target = stat.target;
            const duration = 2500; // 2.5 seconds for a smoother animation
            const startTime = performance.now();

            function updateCount(timestamp) {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1); // Clamp progress between 0 and 1

                let displayValue;
                if (stat.format === 'currency') {
                    // Specific handling for "R40M+"
                    if (progress < 1) {
                         // Animate up to the numerical part
                         displayValue = (progress * target).toFixed(0);
                    } else {
                         displayValue = target; // Ensure it reaches the exact target value (e.g., 40 for R40M+)
                    }
                    element.textContent = (stat.prefix || '') + displayValue + (stat.suffix || '');
                } else {
                    displayValue = Math.floor(progress * target);
                    element.textContent = (stat.prefix || '') + displayValue + (stat.suffix || '');
                }


                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    // Ensure final value is exactly the target after animation
                    if (stat.format === 'currency') {
                        element.textContent = (stat.prefix || '') + target + (stat.suffix || '');
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

    // Floating effect for Hero Section
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (heroSection && heroContent) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate offset from center of hero section
            // Normalize to a -1 to 1 range
            const offsetX = (e.clientX - centerX) / (rect.width / 2);
            const offsetY = (e.clientY - centerY) / (rect.height / 2);

            // Determine max movement (adjust these values to control intensity)
            const maxMovementX = 20; // Max pixels to move horizontally
            const maxMovementY = 15; // Max pixels to move vertically

            const moveX = offsetX * maxMovementX;
            const moveY = offsetY * maxMovementY;

            // Apply transform to the hero content
            heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        // Reset position when mouse leaves the hero section
        heroSection.addEventListener('mouseleave', () => {
            heroContent.style.transform = `translate(0, 0)`;
        });
    }
});