/**
 * Interactive form controls on the calculator page: stepper buttons, the
 * laundry slider, and the air-ticket reveal. Input widgets only, no pricing.
 */
import { byId, qsa } from '../../utils/dom.js';

/** Wires the +/- stepper buttons, clamped to each input's min and max. */
export function initQuantitySteppers() {
  for (const btn of qsa('.qty-btn')) {
    btn.addEventListener('click', () => {
      const input = byId(btn.getAttribute('data-target'));
      if (!input) return;

      const min = parseInt(input.getAttribute('min'), 10) || 0;
      const max = parseInt(input.getAttribute('max'), 10) || 99;
      const current = parseInt(input.value, 10) || 0;

      const next = btn.classList.contains('plus') ? current + 1 : current - 1;
      input.value = Math.min(max, Math.max(min, next));
    });
  }
}

/** Mirrors the laundry slider value into its label. */
export function initLaundrySlider() {
  const slider = byId('laundry');
  const output = byId('laundryValue');
  if (!slider || !output) return;

  const sync = () => {
    output.textContent = slider.value;
  };
  slider.addEventListener('input', sync);
  sync();
}

/** Shows the airline and airport fields only when air tickets are requested. */
export function initAirTicketToggle() {
  const radios = qsa('input[name="airTickets"]');
  const details = byId('airTicketDetails');
  if (radios.length === 0 || !details) return;

  const sync = () => {
    const selected = radios.find((r) => r.checked);
    details.style.display = selected?.value === 'yes' ? 'block' : 'none';
  };

  radios.forEach((radio) => radio.addEventListener('change', sync));
  sync();
}
