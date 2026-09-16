/**
 * Thin DOM helpers.
 *
 * Feature modules use these so they can be written as "do nothing if my markup
 * isn't on this page", which is what lets the same module set serve both the
 * home page and the calculator page without per-page guard code.
 */

export const byId = (id) => document.getElementById(id);
export const qs = (selector, root = document) => root.querySelector(selector);
export const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

/** Reads an element's value as an integer, falling back when absent or blank. */
export function intValue(id, fallback = 0) {
  const el = byId(id);
  if (!el) return fallback;
  const parsed = parseInt(el.value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

/** Reads the value of the checked radio in a group. */
export function checkedValue(name, fallback = null) {
  const el = qs(`input[name="${name}"]:checked`);
  return el ? el.value : fallback;
}

/** Sums the integer values of all checked boxes in a group. */
export function checkedSum(name) {
  return qsa(`input[name="${name}"]:checked`).reduce(
    (total, cb) => total + (parseInt(cb.value, 10) || 0),
    0
  );
}

/** Writes text into an element, ignoring the call if the element is missing. */
export function setText(id, text) {
  const el = byId(id);
  if (el) el.textContent = text;
}

/** Toggles an element between a given display mode and hidden. */
export function setVisible(id, visible, display = 'flex') {
  const el = byId(id);
  if (el) el.style.display = visible ? display : 'none';
}
