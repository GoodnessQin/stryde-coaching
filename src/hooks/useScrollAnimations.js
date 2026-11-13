import { useEffect } from 'react';

const SELECTOR = '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .section-animate';

/**
 * Port of "1. SCROLL ANIMATIONS" from js/stryde.js.
 * Pass deps that change when new animated elements are rendered (e.g. data loaded).
 */
export default function useScrollAnimations(deps = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(SELECTOR)).filter(
      (el) => !el.dataset.animInit
    );
    if (els.length === 0) return undefined;

    els.forEach((el) => {
      el.dataset.animInit = '1';
      el.classList.add('animate-ready');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('animate-ready');
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    els.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      // Anything not yet revealed gets picked up again on the next run
      els.forEach((el) => {
        if (!el.classList.contains('visible')) {
          el.classList.remove('animate-ready');
          delete el.dataset.animInit;
        }
      });
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
