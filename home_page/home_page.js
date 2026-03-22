// Basic navigation functionality only
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
});

// Mobile menu toggle (basic)
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const spans = mobileMenuBtn.querySelectorAll('span');
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('open');
        
        // Simple hamburger to X
        if (this.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Basic smooth scrolling (no fancy effects)
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Close mobile menu when clicking links
document.addEventListener('click', function(e) {
    if (e.target.closest('.nav-link')) {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const spans = mobileMenuBtn.querySelectorAll('span');
        mobileMenuBtn.classList.remove('open');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});
