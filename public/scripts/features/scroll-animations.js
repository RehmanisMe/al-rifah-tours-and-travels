import { qsa } from '../utils/dom.js';

const ANIMATED_SELECTOR = [
  '.stat-item',
  '.package-card',
  '.testimonial-card',
  '.about-content',
  '.about-image',
].join(', ');

/**
 * Fades and lifts elements into view as they are scrolled to.
 *
 * Respects prefers-reduced-motion: those visitors get the content immediately
 * with no transform, rather than content that starts invisible.
 */
export function initScrollAnimations() {
  const elements = qsa(ANIMATED_SELECTOR);
  if (elements.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  for (const el of elements) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  }
}

/** Smooth-scrolls in-page anchor links to their target. */
export function initSmoothScroll() {
  for (const anchor of qsa('a[href^="#"]')) {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}
