/* ==========================================
   TalentSearch Clone - Interactions & Animations
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ===== HEADER SCROLL EFFECT =====
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        lastScroll = currentScroll;
    });

    // ===== MOBILE MENU =====
    const burgerBtn = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('mobile-menu--open');
            burgerBtn.classList.toggle('active');
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('mobile-menu--open');
                burgerBtn.classList.remove('active');
            });
        });
    }

    // ===== SCROLL ANIMATIONS =====
    const animateElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));

    // ===== CLIENTS CAROUSEL =====
    const clientsTrack = document.getElementById('clients-track');
    const clientsPrev = document.getElementById('clients-prev');
    const clientsNext = document.getElementById('clients-next');
    let clientsPosition = 0;

    if (clientsTrack && clientsPrev && clientsNext) {
        const logos = clientsTrack.querySelectorAll('.clients__logo');
        const logoWidth = logos[0]?.offsetWidth + 40 || 300; // width + gap

        clientsNext.addEventListener('click', () => {
            const maxScroll = clientsTrack.scrollWidth - clientsTrack.parentElement.offsetWidth;
            clientsPosition = Math.min(clientsPosition + logoWidth, maxScroll);
            clientsTrack.style.transform = `translateX(-${clientsPosition}px)`;
        });

        clientsPrev.addEventListener('click', () => {
            clientsPosition = Math.max(clientsPosition - logoWidth, 0);
            clientsTrack.style.transform = `translateX(-${clientsPosition}px)`;
        });
    }

    // ===== TESTIMONIALS CAROUSEL =====
    const testTrack = document.getElementById('testimonials-track');
    const testPrev = document.getElementById('test-prev');
    const testNext = document.getElementById('test-next');
    let testIndex = 0;

    if (testTrack && testPrev && testNext) {
        const cards = testTrack.querySelectorAll('.testimonial-card');
        const totalCards = cards.length;
        let cardsPerView = window.innerWidth > 768 ? 2 : 1;
        const maxIndex = totalCards - cardsPerView;

        const updateTestimonials = () => {
            cardsPerView = window.innerWidth > 768 ? 2 : 1;
            const cardElement = cards[0];
            if (!cardElement) return;

            const cardWidth = cardElement.offsetWidth + 24; // width + gap
            testTrack.style.transform = `translateX(-${testIndex * cardWidth}px)`;
        };

        testNext.addEventListener('click', () => {
            cardsPerView = window.innerWidth > 768 ? 2 : 1;
            const currentMax = totalCards - cardsPerView;
            if (testIndex < currentMax) {
                testIndex++;
                updateTestimonials();
            } else {
                testIndex = 0;
                updateTestimonials();
            }
        });

        testPrev.addEventListener('click', () => {
            cardsPerView = window.innerWidth > 768 ? 2 : 1;
            const currentMax = totalCards - cardsPerView;
            if (testIndex > 0) {
                testIndex--;
                updateTestimonials();
            } else {
                testIndex = currentMax;
                updateTestimonials();
            }
        });

        window.addEventListener('resize', () => {
            updateTestimonials();
        });
    }

    // ===== ANIMATED COUNTER =====
    const statsSection = document.getElementById('stats');
    let counterAnimated = false;

    const animateCounter = (el, target) => {
        const duration = 2000;
        const startTime = performance.now();

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    if (statsSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counterAnimated) {
                    counterAnimated = true;
                    const counters = statsSection.querySelectorAll('[data-count]');
                    counters.forEach(counter => {
                        const target = parseInt(counter.dataset.count);
                        animateCounter(counter, target);
                    });
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(statsSection);
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = 80; // account for fixed header
                const top = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== PARALLAX EFFECT ON HERO =====
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const bgLeft = heroSection.querySelector('.hero__bg-left');
        const bgRight = heroSection.querySelector('.hero__bg-right');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                const rate = scrolled * 0.3;
                if (bgLeft) bgLeft.style.transform = `translateY(${rate}px)`;
                if (bgRight) bgRight.style.transform = `translateY(${rate * 0.8}px)`;
            }
        });
    }

    // ===== HEADER DROPDOWN CLOSE ON OUTSIDE CLICK =====
    document.addEventListener('click', (e) => {
        const dropdown = document.querySelector('.header__dropdown');
        if (dropdown && !dropdown.contains(e.target)) {
            const menu = dropdown.querySelector('.header__dropdown-menu');
            if (menu) {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
            }
        }
    });
});
