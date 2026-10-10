import { useEffect, useRef, useState } from 'react';
import { Award } from 'lucide-react';
import { Reveal } from '@/components/portfolio/motion';
import { certificates, results } from '@/config';

function Bar({ value, unit }: { value: number; unit: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="mt-3 flex items-center gap-4">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#1b2438]">
        <div className="h-full rounded-full bg-gradient-to-r from-[#66f7df] to-[#f9b36b] transition-[width] duration-[1400ms] ease-out" style={{ width: on ? `${value}%` : '0%' }} />
      </div>
      <span className="w-16 text-right font-display text-xl text-[#66f7df]">{value}{unit}</span>
    </div>
  );
}

export function Results() {
  return (
    <section id="results" className="cv-auto mx-auto max-w-7xl px-5 py-16 md:px-8">
      <Reveal stagger={false}>
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#f9b36b]">results / measured</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-.05em] text-[#f5f0df] md:text-5xl">Numbers from <span className="text-[#66f7df]">real training runs.</span></h2>
      </Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {results.map((r) => (
          <Reveal key={r.project + r.metric} className="rounded-2xl border border-[#2a3550] bg-[#10172b]/80 p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-lg text-[#f5f0df]">{r.metric}</h3>
              <span className="font-mono text-[10px] uppercase tracking-[.14em] text-[#f9b36b]">{r.project}</span>
            </div>
            <Bar value={r.value} unit={r.unit} />
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[.12em] text-[#68718b]">{r.note}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Certificates() {
  if (!certificates.length) return null;
  const b = import.meta.env.BASE_URL;
  return (
    <section id="certificates" className="cv-auto mx-auto max-w-7xl px-5 py-16 md:px-8">
      <Reveal stagger={false}>
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#f9b36b]">credentials</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-.05em] text-[#f5f0df] md:text-5xl">Certificates <span className="text-[#66f7df]">& recognition.</span></h2>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((c) => (
          <Reveal key={c.title} className="overflow-hidden rounded-2xl border border-[#2a3550] bg-[#10172b]/80">
            <a href={b + c.image} target="_blank" rel="noreferrer" className="block">
              <img src={b + c.image} alt={c.title} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
              <div className="p-5">
                <Award className="h-5 w-5 text-[#f9b36b]" aria-hidden />
                <h3 className="mt-3 font-display text-lg text-[#f5f0df]">{c.title}</h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-[#68718b]">{c.issuer} · {c.year}</p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
