/**
 * Umrah cost calculator page entry point.
 *
 * Composition only. Reading the form, calculating, and rendering are three
 * separate modules; this file connects them to the buttons.
 */
import { byId } from './utils/dom.js';
import { initHeaderScroll } from './features/header-scroll.js';
import { initMobileNav } from './features/mobile-nav.js';
import { initAirTicketToggle, initLaundrySlider, initQuantitySteppers } from './features/calculator/controls.js';
import { readQuoteInput, validateQuoteForm } from './features/calculator/quote-form.js';
import { calculateQuote } from './features/calculator/pricing.js';
import { renderQuote, resetQuoteView } from './features/calculator/quote-view.js';

initHeaderScroll({ threshold: 50 });
initMobileNav();
initQuantitySteppers();
initLaundrySlider();
initAirTicketToggle();

byId('calculateBtn')?.addEventListener('click', () => {
  const validation = validateQuoteForm();
  if (!validation.valid) {
    window.alert(validation.message);
    validation.focus?.focus();
    return;
  }

  // read -> calculate -> render, with no step reaching into another's concern.
  renderQuote(calculateQuote(readQuoteInput()));
});

byId('recalculateBtn')?.addEventListener('click', resetQuoteView);
