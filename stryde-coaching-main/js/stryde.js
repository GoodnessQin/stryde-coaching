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

    animatedElements.forEach(function(el) {
        el.classList.add('animate-ready');
    });

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
// 2. PAGE LOADER
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
// 6. HOME CAROUSEL - fully JS-driven
//    Supports: auto-scroll, hover pause, touch pause, arrow nav
// ===================================
(function() {
    var track = document.querySelector('.carousel-track');
    var dots = document.querySelectorAll('.dot');
    var prevBtn = document.querySelector('.carousel-arrow-prev');
    var nextBtn = document.querySelector('.carousel-arrow-next');
    if (!track) return;

    // Remove CSS animation — JS drives all movement now
    track.style.animation = 'none';
    track.style.willChange = 'transform';

    var CARD_COUNT = 4;     // number of original (non-duplicate) cards
    var GAP = 30;           // must match the CSS gap on .carousel-track
    var SPEED = 0.5;        // px per frame for auto-scroll
    var SNAP_EASE = 0.15;   // easing factor for arrow snapping (0–1, lower = smoother)

    var offset = 0;         // current rendered position in px
    var targetOffset = 0;   // destination for arrow snapping
    var isPaused = false;
    var isSnapping = false;
    var dotIdx = 0;

    function getCardStep() {
        var card = track.querySelector('.carousel-card');
        if (!card) return 330;
        return card.getBoundingClientRect().width + GAP;
    }

    function getLoopWidth() {
        return getCardStep() * CARD_COUNT;
    }

    function applyOffset(val) {
        track.style.transform = 'translateX(' + (-val) + 'px)';
    }

    function tick() {
        var loopWidth = getLoopWidth();

        if (isSnapping) {
            var diff = targetOffset - offset;
            if (Math.abs(diff) < 0.5) {
                offset = targetOffset;
                isSnapping = false;
                // Resume auto-scroll unless hovered
                if (!track.matches(':hover')) {
                    isPaused = false;
                }
            } else {
                offset += diff * SNAP_EASE;
            }
        } else if (!isPaused) {
            offset += SPEED;
            targetOffset = offset;
        }

        // Seamless loop
        if (offset >= loopWidth) {
            offset -= loopWidth;
            targetOffset -= loopWidth;
        }
        if (offset < 0) {
            offset += loopWidth;
            targetOffset += loopWidth;
        }

        applyOffset(offset);
        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

    // ── Pause / Resume ──────────────────────────────
    function pause() { isPaused = true; }
    function resume() {
        if (!isSnapping) isPaused = false;
    }

    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);

    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', function() {
        setTimeout(resume, 800);
    }, { passive: true });
    track.addEventListener('touchcancel', resume, { passive: true });

    // ── Arrow navigation ─────────────────────────────
    function nudge(direction) {
        var step = getCardStep();
        // Snap to nearest card boundary, then move one step in the given direction
        var snappedBase = Math.round(offset / step) * step;
        targetOffset = snappedBase + direction * step;
        isSnapping = true;
        isPaused = true;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            nudge(-1);
            dotIdx = (dotIdx - 1 + CARD_COUNT) % CARD_COUNT;
            dots.forEach(function(d, i) { d.classList.toggle('active', i === dotIdx); });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nudge(1);
            dotIdx = (dotIdx + 1) % CARD_COUNT;
            dots.forEach(function(d, i) { d.classList.toggle('active', i === dotIdx); });
        });
    }

    // ── Dot auto-advance ─────────────────────────────
    setInterval(function() {
        dotIdx = (dotIdx + 1) % CARD_COUNT;
        dots.forEach(function(d, i) { d.classList.toggle('active', i === dotIdx); });
    }, 3000);

    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            dotIdx = index;
            dots.forEach(function(d, i) { d.classList.toggle('active', i === index); });
        });
    });

})();

// ===================================
// 7. STATS COUNTER
// ===================================
(function() {
    var statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    var cards = statsSection.querySelectorAll('.stat-card h3');

    var targets = [];
    cards.forEach(function(card) {
        var t = card.textContent.trim();
        if (t.includes('150'))      targets.push({ el: card, target: 150, suffix: '+' });
        else if (t.includes('50'))  targets.push({ el: card, target: 50,  suffix: '+' });
        else if (t.includes('98'))  targets.push({ el: card, target: 98,  suffix: '%' });
        else                        targets.push({ el: card, target: 0,   suffix: ''  });

        card.textContent = '0';
    });

    function animateCounter(el, target, suffix) {
        var current = 0;
        var inc = target / 60;
        var timer = setInterval(function() {
            current += inc;
            if (current >= target) {
                el.textContent = target + suffix;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current) + suffix;
            }
        }, 30);
    }

    var done = false;
    var obs = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting && !done) {
            done = true;
            targets.forEach(function(item) {
                animateCounter(item.el, item.target, item.suffix);
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