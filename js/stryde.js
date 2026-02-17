// ===================================
// STRYDE COACHING - FIXED JS
// Fixes: double scrollbar, blocked scroll, animations work on desktop only
// ===================================

console.log('✅ Stryde JS Loading...');

// ===================================
// 1. SCROLL ANIMATIONS - works on ALL screen sizes
// ===================================
(function() {
    var animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .section-animate');
    if (animatedElements.length === 0) return;

    // Mark all elements ready for animation (hide them)
    animatedElements.forEach(function(el) {
        el.classList.add('animate-ready');
    });

    // Reveal elements as they scroll into view - on ALL devices
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.remove('animate-ready');
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    animatedElements.forEach(function(el) { observer.observe(el); });
})();

// ===================================
// 2. PAGE LOADER - shows on all devices
// ===================================
(function() {
    var loader = document.querySelector('.page-loader');
    if (!loader) return;

    function hideLoader() {
        loader.classList.add('hidden');
        setTimeout(function() { loader.style.display = 'none'; }, 700);
    }

    window.addEventListener('load', function() {
        setTimeout(hideLoader, 800);
    });

    // Safety fallback: always hide after 3s
    setTimeout(hideLoader, 3000);
})();

// ===================================
// 3. MOBILE NAVIGATION
// ===================================
(function() {
    var hamburger = document.querySelector('.hamburger');
    var navMenu = document.querySelector('.nav-menu');
    var navRight = document.querySelector('.nav-right');
    var body = document.body;
    var isMenuOpen = false;

    if (!hamburger || !navMenu) return;

    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        if (navRight) navRight.classList.add('active');
        body.style.overflow = 'hidden';
        isMenuOpen = true;
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        if (navRight) navRight.classList.remove('active');
        body.style.overflow = '';
        isMenuOpen = false;
    }

    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        isMenuOpen ? closeMenu() : openMenu();
    });

    navMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function(e) {
        if (!isMenuOpen) return;
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) closeMenu();
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMenuOpen) closeMenu();
    });
})();

// ===================================
// 4. NAVBAR SCROLL
// ===================================
(function() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    var ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                navbar.classList.toggle('scrolled', window.scrollY > 100);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

// ===================================
// 5. MARQUEE
// ===================================
document.querySelectorAll('.marquee-content').forEach(function(content) {
    var clone = content.cloneNode(true);
    content.parentElement.appendChild(clone);
});

// ===================================
// 6. HOME CAROUSEL - with touch pause support
// ===================================
(function() {
    var track = document.querySelector('.carousel-track');
    var dots = document.querySelectorAll('.dot');
    if (!track) return;

    var idx = 0;

    // Pause/resume helpers using CSS class (works on all devices)
    function pause() { track.classList.add('paused'); }
    function resume() { track.classList.remove('paused'); }

    // Auto-advance dots
    setInterval(function() {
        idx = (idx + 1) % 4;
        dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
    }, 3000);

    // Dot clicks
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            idx = index;
            dots.forEach(function(d, i) { d.classList.toggle('active', i === index); });
        });
    });

    // ✅ Desktop hover pause
    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);

    // ✅ Mobile touch pause - pause on touch start, resume on touch end/cancel
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', resume, { passive: true });
    track.addEventListener('touchcancel', resume, { passive: true });
})();

// ===================================
// 7. STATS COUNTER
// ===================================
(function() {
    var statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    function animateCounter(el, target, suffix) {
        var current = 0;
        var inc = target / 50;
        var timer = setInterval(function() {
            current += inc;
            if (current >= target) {
                el.textContent = target + suffix;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current) + suffix;
            }
        }, 40);
    }

    var done = false;
    var obs = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting && !done) {
            done = true;
            statsSection.querySelectorAll('.stat-card h3').forEach(function(card) {
                var t = card.textContent.trim();
                if (t.includes('150')) animateCounter(card, 150, '+');
                else if (t.includes('50')) animateCounter(card, 50, '+');
                else if (t.includes('98')) animateCounter(card, 98, '%');
            });
        }
    }, { threshold: 0.5 });
    obs.observe(statsSection);
})();

// ===================================
// 8. SERVICES SLIDER
// ===================================
(function() {
    var cards = document.querySelectorAll('.service-card');
    if (cards.length === 0) return;

    var dots = document.querySelectorAll('.slider-dot');
    var prev = document.querySelector('.slider-arrow-prev');
    var next = document.querySelector('.slider-arrow-next');
    var container = document.querySelector('.services-slider');
    var current = 0;
    var total = cards.length;
    var interval = null;
    var hovering = false;

    function update() {
        cards.forEach(function(c, i) {
            c.classList.remove('slide-left', 'slide-center', 'slide-right', 'active');
            if (i === current) c.classList.add('slide-center', 'active');
            else if (i < current) c.classList.add('slide-left');
            else c.classList.add('slide-right');
        });
        dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });
    }

    function go(n) { current = ((n % total) + total) % total; update(); }
    function start() { if (!hovering) interval = setInterval(function() { go(current + 1); }, 3000); }
    function stop() { clearInterval(interval); interval = null; }

    update(); start();

    if (container) {
        container.addEventListener('mouseenter', function() { hovering = true; stop(); });
        container.addEventListener('mouseleave', function() { hovering = false; start(); });
    }
    if (prev) prev.addEventListener('click', function() { stop(); go(current - 1); setTimeout(function() { if (!hovering) start(); }, 2000); });
    if (next) next.addEventListener('click', function() { stop(); go(current + 1); setTimeout(function() { if (!hovering) start(); }, 2000); });
    dots.forEach(function(d, i) {
        d.addEventListener('click', function() { stop(); go(i); setTimeout(function() { if (!hovering) start(); }, 2000); });
    });
})();

// ===================================
// 9. BACK TO TOP
// ===================================
(function() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btn);
    window.addEventListener('scroll', function() {
        btn.classList.toggle('visible', window.pageYOffset > 300);
    }, { passive: true });
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ===================================
// 10. ACTIVE NAV LINK
// ===================================
(function() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function(link) {
        if (link.getAttribute('href') === page) link.classList.add('active');
    });
})();

// ===================================
// 11. SMOOTH SCROLL ANCHORS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        var t = document.querySelector(this.getAttribute('href'));
        if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
    });
});

console.log('✅ ALL FEATURES LOADED!');
