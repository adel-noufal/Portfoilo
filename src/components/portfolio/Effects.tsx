import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = () => window.matchMedia('(pointer: fine)').matches;

/** Terminal-style boot screen, shown once per session. */
function Preloader() {
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem('booted') && !reduced(); } catch { return false; }
  });
  const [out, setOut] = useState(false);
  const lines = ['> booting signal field…', '> loading 7 agents…', '> calibrating perception model…', '> ready.'];
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!show) return;
    const t = lines.map((_, i) => setTimeout(() => setN(i + 1), 280 * (i + 1)));
    const a = setTimeout(() => setOut(true), 1550);
    const b = setTimeout(() => { setShow(false); try { sessionStorage.setItem('booted', '1'); } catch {} }, 2150);
    return () => [...t, a, b].forEach(clearTimeout);
  }, [show]);
  if (!show) return null;
  return (
    <div className={`boot ${out ? 'boot-out' : ''}`} aria-hidden>
      <div className="boot-inner">
        <div className="boot-logo">A</div>
        {lines.slice(0, n).map((l) => <p key={l}>{l}</p>)}
        <div className="boot-bar"><span /></div>
      </div>
    </div>
  );
}

/** Inertia scroll (Lenis), rAF-throttled card tilt + spotlight, magnetic buttons. */
function Interactions() {
  useEffect(() => {
    if (reduced()) return;
    let raf = 0;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3.2), smoothWheel: true, prevent: (n: Element) => !!n.closest('[role="dialog"],[data-lenis-prevent]') });
    const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const id = a?.getAttribute('href');
      if (!a || !id || id.length < 2) return;
      const el = document.querySelector(id);
      if (el) { e.preventDefault(); lenis.scrollTo(el as HTMLElement, { offset: -72 }); }
    };
    document.addEventListener('click', onAnchor);

    let stop = () => {};
    if (fine()) {
      const sel = '[class*="rounded-2xl"][class*="border"],[class*="rounded-3xl"][class*="border"]';
      let card: HTMLElement | null = null, btn: HTMLElement | null = null, ev: PointerEvent | null = null, pend = false;
      const clear = (el: HTMLElement | null) => { if (el) { el.style.transform = ''; el.classList.remove('tilting'); } };
      const apply = () => {
        pend = false; if (!ev) return;
        const t = ev.target as HTMLElement;
        const c = t.closest<HTMLElement>(sel);
        const ok = c && c.offsetWidth < 700 && c.offsetHeight < 600 ? c : null;
        if (ok !== card) { clear(card); card = ok; }
        if (card) {
          const r = card.getBoundingClientRect();
          const px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
          card.classList.add('tilting', 'spot');
          card.style.setProperty('--mx', `${px * 100}%`); card.style.setProperty('--my', `${py * 100}%`);
          card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 8}deg) translateY(-3px)`;
        }
        const m = t.closest<HTMLElement>('a[class*="rounded-full"],button[class*="rounded-full"]');
        const okb = m && m.offsetWidth < 360 ? m : null;
        if (okb !== btn) { clear(btn); if (btn) btn.style.transform = ''; btn = okb; }
        if (btn) { const r = btn.getBoundingClientRect(); btn.style.transform = `translate(${(ev.clientX - r.left - r.width / 2) * 0.16}px,${(ev.clientY - r.top - r.height / 2) * 0.24}px)`; }
      };
      const move = (e: PointerEvent) => { ev = e; if (!pend) { pend = true; requestAnimationFrame(apply); } };
      window.addEventListener('pointermove', move, { passive: true });
      stop = () => window.removeEventListener('pointermove', move);
    }
    return () => { stop(); cancelAnimationFrame(raf); lenis.destroy(); document.removeEventListener('click', onAnchor); };
  }, []);
  return null;
}

/** Light drifting constellation canvas, paused when the tab is hidden. */
function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv || reduced()) return;
    const ctx = cv.getContext('2d')!;
    const small = window.innerWidth < 768;
    const N = small ? 26 : 56, L = small ? 110 : 150;
    let w = 0, h = 0, raf = 0;
    const size = () => { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight; };
    size(); window.addEventListener('resize', size);
    const P = Array.from({ length: N }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28 }));
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of P) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1; }
      for (let i = 0; i < N; i++) {
        const a = P[i];
        ctx.fillStyle = 'rgba(102,247,223,.55)'; ctx.fillRect(a.x, a.y, 1.8, 1.8);
        for (let j = i + 1; j < N; j++) {
          const b = P[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < L) { ctx.strokeStyle = `rgba(102,247,223,${(1 - d / L) * .16})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    const vis = () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(draw); };
    document.addEventListener('visibilitychange', vis); raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size); document.removeEventListener('visibilitychange', vis); };
  }, []);
  return <canvas ref={ref} className="constellation" aria-hidden />;
}

const TECH = ['PyTorch', 'Multi-Agent Systems', 'RAG', 'Computer Vision', 'FastAPI', 'Django', 'React', 'Three.js', 'ChromaDB', 'Ollama', 'Gemini', 'PostgreSQL', 'Power BI', 'MCP'];

/** Infinite tech ticker. */
export function TechMarquee() {
  const row = [...TECH, ...TECH];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {row.map((t, i) => <span key={i}><i />{t}</span>)}
      </div>
    </div>
  );
}

export default function Effects() {
  return (
    <>
      <div className="aurora" aria-hidden><b /><b /><b /></div>
      <Constellation />
      <Preloader />
      <Interactions />
    </>
  );
}
