/* ========================================
   AL-RIFAH TOURS - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // PRELOADER
    // ========================================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', function () {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide preloader after 3 seconds
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);

    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            backToTop.classList.add('visible');
        } else {
            header.classList.remove('scrolled');
            backToTop.classList.remove('visible');
        }
    });

    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');

    mobileToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ========================================
    // HERO SWIPER
    // ========================================
    const heroSwiper = new Swiper('.hero-swiper', {
        effect: 'fade',
        fadeEffect: { crossFade: true },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        loop: true,
        speed: 1500,
    });

    // ========================================
    // PACKAGES SWIPER
    // ========================================
    const packagesSwiper = new Swiper('.packages-swiper', {
        slidesPerView: 1,
        spaceBetween: 25,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.packages-swiper .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.packages-swiper .swiper-button-next',
            prevEl: '.packages-swiper .swiper-button-prev',
        },
        breakpoints: {
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
        },
    });

    // ========================================
    // PARTNERS SWIPER
    // ========================================
    const partnersSwiper = new Swiper('.partners-swiper', {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        breakpoints: {
            576: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            992: { slidesPerView: 6 },
            1200: { slidesPerView: 8 },
        },
    });

    // ========================================
    // TESTIMONIALS SWIPER
    // ========================================
    const testimonialsSwiper = new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.testimonials-swiper .swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        },
    });

    // ========================================
    // COUNTER ANIMATION
    // ========================================
    const counters = document.querySelectorAll('.stat-number[data-target]');
    let countersAnimated = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        });
    }

    // Intersection Observer for counters
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }

    // ========================================
    // TYPING EFFECT
    // ========================================
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        let index = 0;

        function typeText() {
            if (index < text.length) {
                typingElement.textContent += text.charAt(index);
                index++;
                setTimeout(typeText, 60);
            }
        }

        // Start typing after a short delay
        setTimeout(typeText, 500);
    }

    // ========================================
    // ROTATING TEXT
    // ========================================
    const rotatingElement = document.querySelector('.hero-rotating');
    if (rotatingElement) {
        const phrases = [
            'You Will Find Yourself...',
            'Peace Awaits You...',
            'A Journey of a Lifetime...',
            'Closer to the Divine...',
        ];
        let phraseIndex = 0;

        setInterval(() => {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            rotatingElement.style.opacity = '0';
            setTimeout(() => {
                rotatingElement.textContent = phrases[phraseIndex];
                rotatingElement.style.opacity = '1';
            }, 300);
        }, 3000);
    }

    // ========================================
    // FORM SUBMISSION
    // ========================================
    // Form submission is handled via Firebase module script in index.html

    // ========================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ========================================
    const animateElements = document.querySelectorAll('.stat-item, .package-card, .testimonial-card, .about-content, .about-image');

    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateObserver.observe(el);
    });

    // ========================================
    // SMOOTH SCROLL FOR NAV LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
