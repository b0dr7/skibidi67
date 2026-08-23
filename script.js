(function() {
    'use strict';

    // Theme management
    const themes = ['dark', 'light', 'high-contrast'];
    const themeIcons = {
        'dark': 'theme-icon-moon',
        'light': 'theme-icon-sun',
        'high-contrast': 'theme-icon-contrast'
    };
    let currentThemeIndex = 0;

    function getStoredTheme() {
        try {
            return localStorage.getItem('killyware-theme') || 'dark';
        } catch (e) {
            return 'dark';
        }
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        currentThemeIndex = themes.indexOf(theme);
        updateThemeIcon();
        try {
            localStorage.setItem('killyware-theme', theme);
        } catch (e) {}
    }

    function updateThemeIcon() {
        document.querySelectorAll('.theme-icon').forEach(icon => {
            icon.classList.remove('active');
        });
        const activeIcon = document.querySelector('.' + themeIcons[themes[currentThemeIndex]]);
        if (activeIcon) activeIcon.classList.add('active');
    }

    function cycleTheme() {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        setTheme(themes[currentThemeIndex]);
    }

    // Initialize theme
    const storedTheme = getStoredTheme();
    setTheme(storedTheme);

    // Theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', cycleTheme);
    }

    // Navigation scroll effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    let ticking = false;

    function updateNav() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    });

    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Scroll reveal with IntersectionObserver
    const revealElements = document.querySelectorAll('.feature-card, .faq-item, .section-header, .cta-card');

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const featuresGrid = document.querySelector('.features-grid');
    if (featuresGrid) featuresGrid.classList.add('stagger-children');

    const faqContainer = document.querySelector('.faq-container');
    if (faqContainer) faqContainer.classList.add('stagger-children');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
        revealObserver.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax effect on hero logo (subtle)
    const heroLogo = document.querySelector('.hero-logo');
    if (heroLogo && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroLogo.style.transform = `translateY(${scrolled * 0.15}px)`;
            }
        }, { passive: true });
    }

    // Keyboard navigation for theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                cycleTheme();
            }
        });
    }
})();
