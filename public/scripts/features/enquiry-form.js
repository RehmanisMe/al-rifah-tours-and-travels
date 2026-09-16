import { byId } from '../utils/dom.js';

const MESSAGES = {
  success: 'Thank you! Your enquiry has been submitted successfully. We will contact you soon.',
  failure: 'Something went wrong. Please try again or contact us directly.',
};

/**
 * Wires up the "beat my price" enquiry form.
 *
 * The persistence function and the notifier are injected rather than imported,
 * so this module has no knowledge of Firebase and no hard dependency on
 * window.alert. That keeps the form testable and makes replacing either side a
 * one-line change at the call site.
 *
 * @param {object}   deps
 * @param {(data: Record<string, string>) => Promise<{success: boolean}>} deps.submit
 * @param {(message: string) => void} [deps.notify]
 */
export function initEnquiryForm({ submit, notify = (msg) => window.alert(msg) }) {
  const form = byId('leadForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = form.querySelector('.btn-submit-enquiry');
    const originalLabel = button?.textContent;

    if (button) {
      button.textContent = 'Submitting...';
      button.disabled = true;
    }

    try {
      // The form's name attributes already match the stored field names, so the
      // payload comes straight from the form rather than from a list of IDs
      // that has to be kept in sync by hand.
      const payload = Object.fromEntries(new FormData(form).entries());
      const result = await submit(payload);

      notify(result.success ? MESSAGES.success : MESSAGES.failure);
      if (result.success) form.reset();
    } catch (error) {
      console.error('Enquiry submission failed:', error);
      notify(MESSAGES.failure);
    } finally {
      // Always restore the button, so a failure can be retried.
      if (button) {
        button.textContent = originalLabel;
        button.disabled = false;
      }
    }
  });
}
