/**
 * Thin wrapper around the `motion` package for the site's two reveal
 * patterns: a staggered hero entrance on load, and a fade-in-on-scroll
 * for content rows further down the page. Both are no-ops under
 * prefers-reduced-motion — [data-reveal]/[data-reveal-hero] fall back
 * to fully visible via CSS (see globals.css), this just skips the
 * redundant animation work.
 */
import { animate, inView } from 'motion';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Stagger-reveal every `[data-reveal-hero]` element inside `root`, once, on
 * call. Animates each element individually with an increasing numeric delay
 * rather than using motion's `stagger()` helper — a numeric delay keeps this
 * on native WAAPI (compositor-driven, keeps running if the tab is
 * backgrounded mid-animation); `stagger()` forces a JS-timed group instead.
 */
export function heroReveal(root: ParentNode = document): void {
  if (prefersReducedMotion()) return;
  const els = root.querySelectorAll<HTMLElement>('[data-reveal-hero]');
  if (!els.length) return;
  els.forEach((el, i) => {
    animate(
      el,
      { opacity: [0, 1], transform: ['translateY(18px)', 'translateY(0)'] },
      { duration: 0.6, delay: 0.05 + i * 0.08, ease: 'easeOut' }
    );
  });
}

const reveal = (el: HTMLElement, animated: boolean) => {
  if (animated) {
    animate(
      el,
      { opacity: [0, 1], transform: ['translateY(18px)', 'translateY(0)'] },
      { duration: 0.5, ease: 'easeOut' }
    );
  } else {
    el.style.opacity = '1';
    el.style.transform = 'none';
  }
};

/**
 * Fade in each `[data-reveal]` element inside `root` the first time it
 * enters the viewport. `amount: 0` (fire on the first pixel of overlap)
 * plus the scroll-driven safety net below means a fast flick-scroll can't
 * skip an element past the observer and leave it stuck invisible.
 */
export function scrollReveal(root: ParentNode = document): void {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!els.length) return;
  if (prefersReducedMotion()) {
    els.forEach((el) => reveal(el, false));
    return;
  }

  const pending = new Set(els);
  const catchUp = () => {
    pending.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        reveal(el, false);
        pending.delete(el);
      }
    });
  };

  els.forEach((el) => {
    const stop = inView(
      el,
      () => {
        pending.delete(el);
        reveal(el, true);
        stop();
      },
      { margin: '0px 0px -2% 0px', amount: 0 }
    );
  });

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking || !pending.size) return;
      ticking = true;
      requestAnimationFrame(() => {
        catchUp();
        ticking = false;
      });
    },
    { passive: true }
  );
}

/**
 * Count up every `[data-count]` element inside `root` from 0 to its target
 * integer (the element's own text at call time). Used for stats that land
 * in the DOM already-final (e.g. an API response) rather than server-
 * rendered, so there's no [data-reveal]-style no-JS fallback to wire up —
 * the target number is always the immediate, correct text under reduced
 * motion or a stalled animation.
 */
export function countUp(root: ParentNode = document): void {
  const els = root.querySelectorAll<HTMLElement>('[data-count]');
  els.forEach((el) => {
    const target = Number(el.textContent);
    if (!Number.isFinite(target)) return;
    if (prefersReducedMotion()) {
      el.textContent = String(target);
      return;
    }
    animate(0, target, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
  });
}

const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#01';

/**
 * Decode-in `el`'s current text: cycles trailing characters through random
 * symbols before each settles in reading order, terminal/hacker style. Runs
 * once on call; a no-op (final text shown immediately) under reduced motion.
 */
export function scrambleReveal(el: HTMLElement | null, duration = 0.6): void {
  if (!el) return;
  const final = el.textContent ?? '';
  if (prefersReducedMotion() || !final) return;
  animate(0, final.length, {
    duration,
    ease: 'easeOut',
    onUpdate: (revealed) => {
      const n = Math.floor(revealed);
      let out = final.slice(0, n);
      for (let i = n; i < final.length; i++) {
        out += final[i] === ' ' ? ' ' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      el.textContent = out;
    },
  });
}
