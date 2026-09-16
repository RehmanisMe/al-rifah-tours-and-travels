import { byId } from '../utils/dom.js';

/**
 * Adds a "scrolled" state to the header and reveals the back-to-top button.
 *
 * @param {{threshold?: number}} options
 *   The home page and the calculator page used different thresholds (100 and
 *   50), so it is a parameter rather than two near-identical modules.
 */
export function initHeaderScroll({ threshold = 100 } = {}) {
  const header = byId('header');
  const backToTop = byId('backToTop');
  if (!header && !backToTop) return;

  const apply = () => {
    const passed = window.scrollY > threshold;
    header?.classList.toggle('scrolled', passed);
    backToTop?.classList.toggle('visible', passed);
  };

  window.addEventListener('scroll', apply, { passive: true });
  apply(); // Correct on load when the browser restores a scroll position.
}
