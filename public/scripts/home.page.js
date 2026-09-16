/**
 * Home page entry point.
 *
 * Composition only: it decides which features the page uses and wires their
 * dependencies together. No feature logic lives here.
 */
import { initPreloader } from './features/preloader.js';
import { initHeaderScroll } from './features/header-scroll.js';
import { initMobileNav } from './features/mobile-nav.js';
import { initCarousels } from './features/carousels.js';
import { initCounters } from './features/counters.js';
import { initRotatingText, initTypingEffect } from './features/text-effects.js';
import { initScrollAnimations, initSmoothScroll } from './features/scroll-animations.js';
import { initEnquiryForm } from './features/enquiry-form.js';
import { saveEnquiry } from './services/enquiry.service.js';

initPreloader();
initHeaderScroll({ threshold: 100 });
initMobileNav();
initCarousels();
initCounters();
initTypingEffect();
initRotatingText();
initScrollAnimations();
initSmoothScroll();

// The form receives its persistence function here; it does not know about Firebase.
initEnquiryForm({ submit: saveEnquiry });
