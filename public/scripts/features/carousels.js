import { qs } from '../utils/dom.js';

/**
 * Swiper carousel configuration, declared as data.
 *
 * Adding or retuning a carousel means editing this list, not writing more
 * initialisation code, and each entry is skipped when its markup is absent.
 */
const CAROUSELS = [
  {
    selector: '.hero-swiper',
    options: {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: { delay: 5000, disableOnInteraction: false },
      loop: true,
      speed: 1500,
    },
  },
  {
    selector: '.packages-swiper',
    options: {
      slidesPerView: 1,
      spaceBetween: 25,
      loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      pagination: { el: '.packages-swiper .swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.packages-swiper .swiper-button-next',
        prevEl: '.packages-swiper .swiper-button-prev',
      },
      breakpoints: {
        576: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
        1200: { slidesPerView: 4 },
      },
    },
  },
  {
    selector: '.partners-swiper',
    options: {
      slidesPerView: 3,
      spaceBetween: 20,
      loop: true,
      autoplay: { delay: 2500, disableOnInteraction: false },
      breakpoints: {
        576: { slidesPerView: 4 },
        768: { slidesPerView: 5 },
        992: { slidesPerView: 6 },
        1200: { slidesPerView: 8 },
      },
    },
  },
  {
    selector: '.testimonials-swiper',
    options: {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.testimonials-swiper .swiper-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    },
  },
];

/**
 * Initialises every carousel present on the page.
 *
 * @returns {Map<string, object>} live Swiper instances, keyed by selector.
 */
export function initCarousels() {
  const instances = new Map();

  // Swiper is loaded from a CDN as a global; without it the page still works.
  if (typeof window.Swiper === 'undefined') {
    console.warn('Swiper failed to load; carousels will render as static lists.');
    return instances;
  }

  for (const { selector, options } of CAROUSELS) {
    if (qs(selector)) instances.set(selector, new window.Swiper(selector, options));
  }
  return instances;
}
