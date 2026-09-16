/**
 * Renders a calculated quote into the results panel.
 *
 * Presentation only: it receives a finished breakdown and writes it to the DOM.
 * It performs no arithmetic, so pricing changes never require touching display
 * code and vice versa.
 */
import { byId, setText, setVisible } from '../../utils/dom.js';
import { formatCurrency } from '../../utils/currency.js';

/** Maps result element IDs to the breakdown fields they display. */
const LINE_ITEMS = {
  resultVisa: (q) => q.visa,
  resultTransport: (q) => q.transportPerPerson,
  resultMakkah: (q) => q.makkahPerPerson,
  resultMadinah: (q) => q.madinahPerPerson,
  resultMeals: (q) => q.meals,
  resultLaundry: (q) => q.laundry,
  resultSpiritual: (q) => q.spiritual,
  resultComfort: (q) => q.comfort,
  resultPremium: (q) => q.premium,
  resultAirfare: (q) => q.airfare,
  resultPerAdult: (q) => q.perAdult,
  resultTotal: (q) => q.total,
};

/**
 * Writes a quote breakdown into the results panel and reveals it.
 *
 * @param {ReturnType<import('./pricing.js').calculateQuote>} quote
 */
export function renderQuote(quote) {
  for (const [id, read] of Object.entries(LINE_ITEMS)) {
    setText(id, formatCurrency(read(quote)));
  }

  renderGroupRow('childRow', 'resultChildren', quote.children);
  renderGroupRow('infantRow', 'resultInfants', quote.infants);

  const panel = byId('calcResults');
  if (!panel) return;

  panel.style.display = 'block';
  // Let the browser paint the panel before scrolling to it.
  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

/** Shows a child/infant row only when that group has travellers. */
function renderGroupRow(rowId, valueId, group) {
  const present = group.count > 0;
  setVisible(rowId, present);
  if (present) {
    setText(valueId, `${formatCurrency(group.total)} (${group.count} \u00D7 ${formatCurrency(group.rate)})`);
  }
}

/** Hides the results panel and returns the visitor to the form. */
export function resetQuoteView() {
  const panel = byId('calcResults');
  if (panel) panel.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
