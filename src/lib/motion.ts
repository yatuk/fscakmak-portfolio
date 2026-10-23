/**
 * Animation helpers. countUp and scrambleReveal drive the terminal;
 * drawStrokes draws the notebook pages' hand-drawn pen marks in.
 */
import { animate } from 'motion';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Draw each `.nb-draw` SVG path in, one after another. The paths are
 * pre-hidden by a stylesheet rule (stroke-dashoffset: 1 against
 * pathLength="1"). This uses WAAPI directly rather than motion's animate():
 * motion writes SVG presentation attributes, and that stylesheet rule
 * outranks attributes, so the stroke would never appear.
 */
export function drawStrokes(root: ParentNode = document): void {
  if (prefersReducedMotion()) return;
  root.querySelectorAll<SVGPathElement>('.nb-draw').forEach((path, i) => {
    const anim = path.animate(
      [{ strokeDashoffset: '1' }, { strokeDashoffset: '0' }],
      { duration: 650, delay: 250 + i * 160, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'both' }
    );
    anim.finished
      .then(() => {
        path.style.strokeDashoffset = '0';
        anim.cancel();
      })
      .catch(() => {});
  });
}

/**
 * Count up every `[data-count]` element inside `root` from 0 to its target
 * integer (the element's own text at call time). Used for stats that land
 * in the DOM already-final (e.g. an API response) rather than server-
 * rendered, so the target number is always the immediate, correct text under
 * reduced motion or a stalled animation.
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
