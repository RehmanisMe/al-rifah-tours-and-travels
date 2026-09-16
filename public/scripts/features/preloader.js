import { byId } from '../utils/dom.js';

const REVEAL_DELAY_MS = 800;
const FAILSAFE_MS = 3000;

/**
 * Hides the preloader once the page has loaded, with a failsafe timer so a slow
 * or failed asset can never leave visitors staring at the splash screen.
 */
export function initPreloader() {
  const preloader = byId('preloader');
  if (!preloader) return;

  const hide = () => preloader.classList.add('hidden');

  window.addEventListener('load', () => setTimeout(hide, REVEAL_DELAY_MS));
  setTimeout(hide, FAILSAFE_MS);
}
