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

    function getInitialTheme() {
        const stored = localStorage.getItem('killyware-theme');
        if (stored && themes.includes(stored)) {
            return stored;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
    setTheme(getInitialTheme());

    // Theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', cycleTheme);
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                faqItem.classList.remove('active');
                faqItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                faqItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // Scroll reveal
    const revealElements = document.querySelectorAll('.feature-card, .faq-item, .section-header, .cta-card');

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
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
                const offset = 70;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

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
