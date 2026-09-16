import { qs } from '../utils/dom.js';

const TYPING_SPEED_MS = 60;
const TYPING_START_DELAY_MS = 500;
const ROTATE_INTERVAL_MS = 3000;
const ROTATE_FADE_MS = 300;

const ROTATING_PHRASES = [
  'You Will Find Yourself...',
  'Peace Awaits You...',
  'A Journey of a Lifetime...',
  'Closer to the Divine...',
];

/** Types the hero headline out one character at a time. */
export function initTypingEffect() {
  const el = qs('.typing-text');
  if (!el) return;

  const text = el.textContent;
  el.textContent = '';
  let index = 0;

  const type = () => {
    if (index >= text.length) return;
    el.textContent += text.charAt(index);
    index += 1;
    setTimeout(type, TYPING_SPEED_MS);
  };

  setTimeout(type, TYPING_START_DELAY_MS);
}

/** Cycles the hero subheading through a set of phrases with a fade. */
export function initRotatingText() {
  const el = qs('.hero-rotating');
  if (!el) return;

  let index = 0;
  setInterval(() => {
    index = (index + 1) % ROTATING_PHRASES.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = ROTATING_PHRASES[index];
      el.style.opacity = '1';
    }, ROTATE_FADE_MS);
  }, ROTATE_INTERVAL_MS);
}
