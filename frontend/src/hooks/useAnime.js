import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

/**
 * Plays an anime.js animation on mount.
 * @param {Function} buildAnimation - receives the ref'd element, returns anime params object
 * @param {Array} deps - dependency array
 */
export function useAnimeMount(buildAnimation, deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const params = buildAnimation(ref.current);
    const anim = anime(params);
    return () => anim.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/**
 * Plays a stagger reveal when the element enters the viewport.
 * @param {string} selector - CSS selector for children to stagger
 * @param {Object} extraParams - extra anime params to merge
 */
export function useAnimeReveal(selector, extraParams = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          anime({
            targets: el.querySelectorAll(selector),
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 700,
            easing: 'easeOutCubic',
            delay: anime.stagger(100),
            ...extraParams,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [selector]);
  return ref;
}

/**
 * Animates a number counting up from 0 to its target value.
 * Target comes from the element's data-target attribute.
 * @param {boolean} trigger - set to true to start the animation
 */
export function useCountUp(trigger) {
  const ref = useRef(null);
  useEffect(() => {
    if (!trigger || !ref.current) return;
    const els = ref.current.querySelectorAll('[data-count]');
    els.forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const obj = { val: 0 };
      anime({
        targets: obj,
        val: target,
        duration: 1800,
        easing: 'easeOutExpo',
        round: Number.isInteger(target) ? 1 : 0,
        update() {
          el.textContent = Number.isInteger(target)
            ? Math.floor(obj.val).toLocaleString() + suffix
            : obj.val.toFixed(1) + suffix;
        },
      });
    });
  }, [trigger]);
  return ref;
}

/**
 * Shake animation — useful for form errors.
 */
export function shakeElement(element) {
  anime({
    targets: element,
    translateX: [0, -12, 12, -8, 8, -4, 4, 0],
    duration: 500,
    easing: 'easeInOutSine',
  });
}

/**
 * Pulse glow animation on an element.
 */
export function pulseGlow(element, color = 'rgba(212,175,55,0.4)') {
  anime({
    targets: element,
    boxShadow: [
      `0 0 0px 0px ${color}`,
      `0 0 24px 8px ${color}`,
      `0 0 0px 0px ${color}`,
    ],
    duration: 900,
    easing: 'easeInOutSine',
  });
}

export default anime;
