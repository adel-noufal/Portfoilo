import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled || reduceMotion) return;
    document.body.classList.add('has-custom-cursor');
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = transform;
      if (dotRef.current) dotRef.current.style.transform = transform;
    };
    const over = (event: PointerEvent) => {
      const target = event.target;
      const interactive = target instanceof Element && Boolean(target.closest('a, button, [role="button"]'));
      ringRef.current?.classList.toggle('custom-cursor--active', interactive);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [enabled, reduceMotion]);

  if (!enabled || reduceMotion) return null;
  return (
    <>
      <div ref={ringRef} className="custom-cursor custom-cursor--ring" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor custom-cursor--dot" aria-hidden="true" />
    </>
  );
}

export function ContactShortcut() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const hero = document.getElementById('top');
    const target = document.getElementById('contact');
    if (!('IntersectionObserver' in window)) {
      setHidden(false);
      return;
    }
    let heroVisible = Boolean(hero);
    let contactVisible = false;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === target) contactVisible = entry.isIntersecting;
      }
      setHidden(heroVisible || contactVisible);
    });
    if (hero) observer.observe(hero);
    if (target) observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (hidden) return null;
  return (
    <a href="#contact" className="contact-shortcut" data-testid="link-sticky-contact">
      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
      <span>contact</span>
      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
    </a>
  );
}