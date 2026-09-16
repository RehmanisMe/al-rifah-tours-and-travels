import { byId, qsa } from '../utils/dom.js';

/** Opens and closes the mobile navigation drawer, locking page scroll while open. */
export function initMobileNav() {
  const toggle = byId('mobileToggle');
  const nav = byId('mainNav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.classList.toggle('active', open);
    nav.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('active')));

  // Any nav link closes the drawer, otherwise it stays over the target section.
  qsa('.nav-menu a').forEach((link) => link.addEventListener('click', () => setOpen(false)));

  // Escape is expected to dismiss an overlay.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) setOpen(false);
  });
}
