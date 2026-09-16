import { qs, qsa } from '../utils/dom.js';

const DURATION_MS = 2000;
const FRAME_MS = 16;

/** Counts a single element up to its data-target value. */
function countUp(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  if (Number.isNaN(target)) return;

  const step = target / (DURATION_MS / FRAME_MS);
  let current = 0;

  const tick = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toLocaleString();
    }
  };

  tick();
}

/** Animates the statistics counters once, when the stats section scrolls into view. */
export function initCounters() {
  const section = qs('.stats-section');
  const counters = qsa('.stat-number[data-target]');
  if (!section || counters.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        counters.forEach(countUp);
        observer.disconnect(); // Run once, then stop observing.
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
}
