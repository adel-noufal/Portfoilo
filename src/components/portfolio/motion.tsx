import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  className = '',
  delay = 0,
  stagger = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const reduceMotion = useReducedMotion();
  const visible = inView || reduceMotion;

  return (
    <motion.div
      ref={ref}
      className={`${stagger ? 'reveal-stagger' : ''} ${className}`}
      variants={revealVariants}
      initial={reduceMotion ? false : 'hidden'}
      animate={visible ? 'visible' : 'hidden'}
      transition={{
        duration: reduceMotion ? 0 : 0.68,
        delay: reduceMotion ? 0 : delay,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      data-in-view={visible}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({
  value,
  decimals = 0,
  suffix = '',
  padTo = 0,
  className = '',
  testId,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  padTo?: number;
  className?: string;
  testId?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.65 });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setCount(value);
      return;
    }

    let frame = 0;
    let startTime = 0;
    const duration = 1200;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(value * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, value]);

  const formatted = decimals > 0
    ? count.toFixed(decimals)
    : String(Math.round(count)).padStart(padTo, '0');

  return <span ref={ref} className={className} data-testid={testId}>{formatted}{suffix}</span>;
}