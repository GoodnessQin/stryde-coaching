// ===================================
// STRYDE COACHING - COMPLETE WORKING JS
// Clean, No Conflicts, All Features
// ===================================

console.log('✅ Stryde JS Loading...');

// ===================================
// 1. MOBILE NAVIGATION - WORKS PERFECTLY
// ===================================
(function() {
    console.log('📱 Mobile Nav: Starting...');
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navRight = document.querySelector('.nav-right');
    const body = document.body;
    
    if (!hamburger || !navMenu || !navRight) {
        console.log('⚠️ Mobile nav elements missing:', {
            hamburger: !!hamburger,
            navMenu: !!navMenu,
            navRight: !!navRight
        });
        return;
    }
    
    console.log('✅ All mobile nav elements found!');
    
    let isMenuOpen = false;
    
    function openMenu() {
        console.log('📱 OPENING menu');
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        navRight.classList.add('active');
        body.style.overflow = 'hidden';
        isMenuOpen = true;
    }
    
    function closeMenu() {
        console.log('📱 CLOSING menu');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navRight.classList.remove('active');
        body.style.overflow = '';
        isMenuOpen = false;
    }
    
    function toggleMenu() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // Click hamburger
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log('📱 Hamburger clicked!');
        toggleMenu();
    });
    
    // Click menu links
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('📱 Menu link clicked');
            closeMenu();
        });
    });
    
    // Click outside
    document.addEventListener('click', function(e) {
        if (!isMenuOpen) return;
        
        const clickedInsideMenu = navMenu.contains(e.target);
        const clickedInsideNavRight = navRight.contains(e.target);
        const clickedHamburger = hamburger.contains(e.target);
        
        if (!clickedInsideMenu && !clickedInsideNavRight && !clickedHamburger) {
            console.log('📱 Clicked outside');
            closeMenu();
        }
    });
    
    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            console.log('📱 Escape pressed');
            closeMenu();
        }
    });
    
    // Resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768 && isMenuOpen) {
                console.log('📱 Resized to desktop');
                closeMenu();
            }
        }, 250);
    });
    
    console.log('✅ Mobile Nav: Ready!');
})();

// ===================================
// 2. SERVICES CAROUSEL
// ===================================
(function() {
    const serviceCards = document.querySelectorAll('.service-card');
    const sliderDots = document.querySelectorAll('.slider-dot');
    const prevArrow = document.querySelector('.slider-arrow-prev');
    const nextArrow = document.querySelector('.slider-arrow-next');
    
    if (serviceCards.length === 0) {
        console.log('ℹ️ No carousel found');
        return;
    }
    
    console.log('🎠 Carousel: Found', serviceCards.length, 'cards');
    
    let currentSlide = 0;
    const totalSlides = serviceCards.length;
    let slideInterval;
    
    function updateSlidePositions() {
        serviceCards.forEach((card, index) => {
            card.classList.remove('slide-left', 'slide-center', 'slide-right', 'active');
            
            if (index === currentSlide) {
                card.classList.add('slide-center', 'active');
            } else if (index < currentSlide) {
                card.classList.add('slide-left');
            } else {
                card.classList.add('slide-right');
            }
        });
        
        sliderDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlidePositions();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlidePositions();
    }
    
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 3000);
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Initialize
    updateSlidePositions();
    startAutoSlide();
    
    // Arrows
    if (prevArrow) {
        prevArrow.addEventListener('click', function() {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }
    
    if (nextArrow) {
        nextArrow.addEventListener('click', function() {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }
    
    // Dots
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopAutoSlide();
            currentSlide = index;
            updateSlidePositions();
            startAutoSlide();
        });
    });
    
    console.log('✅ Carousel: Ready!');
})();

// ===================================
// 3. PAGE LOADER
// ===================================
window.addEventListener('load', function() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(function() {
            loader.classList.add('hidden');
            setTimeout(function() {
                loader.style.display = 'none';
            }, 600);
        }, 1000);
    }
});

// ===================================
// 4. NAVIGATION SCROLL
// ===================================
const navbar = document.getElementById('navbar');

if (navbar) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===================================
// 5. SCROLL ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .section-animate');
animatedElements.forEach(function(el) {
    observer.observe(el);
});

// ===================================
// 6. SMOOTH SCROLL
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// 7. MARQUEE
// ===================================
const marqueeContents = document.querySelectorAll('.marquee-content');
marqueeContents.forEach(function(content) {
    const clone = content.cloneNode(true);
    content.parentElement.appendChild(clone);
});

// ===================================
// 8. HOMEPAGE CAROUSEL
// ===================================
const carouselTrack = document.querySelector('.carousel-track');
const dots = document.querySelectorAll('.dot');
let carouselIndex = 0;

if (dots.length > 0) {
    setInterval(function() {
        carouselIndex = (carouselIndex + 1) % 4;
        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === carouselIndex);
        });
    }, 3000);
    
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            carouselIndex = index;
            dots.forEach(function(d, i) {
                d.classList.toggle('active', i === index);
            });
            if (carouselTrack) {
                carouselTrack.style.animation = 'none';
                carouselTrack.style.transform = 'translateX(-' + (index * 330) + 'px)';
                setTimeout(function() {
                    carouselTrack.style.animation = '';
                }, 3000);
            }
        });
    });
}

// ===================================
// 9. STATS COUNTER
// ===================================
function animateCounter(element, target, suffix) {
    suffix = suffix || '';
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(function() {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 40);
}

const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            const statCards = entry.target.querySelectorAll('.stat-card h3');
            statCards.forEach(function(card) {
                const text = card.textContent.trim();
                if (text.includes('50')) {
                    animateCounter(card, 50, ' +');
                } else if (text.includes('150')) {
                    animateCounter(card, 150, ' +');
                } else if (text.includes('98')) {
                    animateCounter(card, 98, '%');
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===================================
// 10. BACK TO TOP
// ===================================
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '↑';
backToTop.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTop);

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================================
// 11. ACTIVE NAV LINK
// ===================================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(function(link) {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
    }
});

console.log('✅ Stryde JS: All features loaded!');
console.log('%c Stryde Coaching Ready! ', 'background: #CBB484; color: #00180A; font-size: 14px; font-weight: bold; padding: 6px;');
