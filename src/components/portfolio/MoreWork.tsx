import { useEffect, useRef } from 'react';
import { ArrowUpRight, ShieldCheck, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/portfolio/motion';
import { useExtraRepos } from '@/lib/github';
import { demos, moreAbout, noRepoDone, profileUrl, projectVideos } from '@/config';
import { ExternalLink } from 'lucide-react';

type P = { id: string; title: string; kicker: string; description: string; tags: string[]; stat: string; statLabel: string; href: string; icon: LucideIcon };

function CardVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const v = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = v.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { e.isIntersecting ? el.play().catch(() => {}) : el.pause(); }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, []);
  const b = import.meta.env.BASE_URL;
  return <video ref={v} src={b + src} poster={b + poster} muted loop playsInline preload="none" aria-label={label}
    className="mb-5 aspect-video w-full rounded-xl border border-[#2a3550] bg-black object-cover" />;
}

function SafeSightSpotlight({ p }: { p: P }) {
  const v = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = v.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { e.isIntersecting ? el.play().catch(() => {}) : el.pause(); }, { threshold: 0.35 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <Reveal className="glass-panel grid items-center gap-8 rounded-[1.75rem] p-5 md:grid-cols-[minmax(0,320px)_1fr] md:gap-12 md:p-8" stagger={false}>
      <div className="mx-auto w-full max-w-[290px] overflow-hidden rounded-[1.6rem] border border-[#33405b] bg-black shadow-[0_30px_80px_-30px_rgba(102,247,223,.35)]">
        <video ref={v} src={`${import.meta.env.BASE_URL}media/safesight.mp4`} poster={`${import.meta.env.BASE_URL}media/safesight-poster.jpg`}
          muted loop playsInline preload="none" className="block aspect-[470/850] w-full object-cover" aria-label="SafeSight live detection demo" />
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#f9b36b]">spotlight / computer vision</p>
        <h3 className="mt-3 flex items-center gap-3 font-display text-4xl font-semibold tracking-[-.05em] text-[#f5f0df] md:text-5xl">
          <ShieldCheck className="h-8 w-8 text-[#66f7df]" aria-hidden /> SafeSight
        </h3>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[#c6cad0]">{p.description}</p>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#8f9ab4]">
          Point it at a live camera, an image or a video: it detects workers, checks for hard hats and safety vests, and raises a violation alert the moment something is missing.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">{p.tags.map((t) => <span key={t} className="rounded-full border border-[#33405b] px-3 py-1 font-mono text-[10px] uppercase tracking-[.1em] text-[#9aa6c4]">{t}</span>)}</div>
        <div className="mt-7 flex flex-wrap items-end gap-8">
          <div><div className="font-display text-5xl text-[#66f7df]">{p.stat}</div><div className="mt-1 font-mono text-[10px] uppercase tracking-[.14em] text-[#68718b]">{p.statLabel}</div></div>
          {demos[p.id] && <a href={demos[p.id]} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#66f7df] px-5 py-3 font-mono text-[11px] uppercase tracking-[.14em] text-[#0a0d18] transition hover:brightness-110">Live demo <ExternalLink className="h-3.5 w-3.5" aria-hidden /></a>}
          <a href={p.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#66f7df]/50 px-5 py-3 font-mono text-[11px] uppercase tracking-[.14em] text-[#66f7df] transition hover:bg-[#66f7df]/10">
            View repository <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

export function MoreWork({ projects }: { projects: P[] }) {
  const safesight = projects.find((p) => p.id === 'safesight');
  const extra = useExtraRepos(projects);
  const others = projects.filter((p) => !(['edusense', 'safesight'] as string[]).includes(p.id));
  return (
    <section id="more-work" className="cv-auto mx-auto max-w-7xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24" aria-labelledby="more-work-title">
      <Reveal stagger={false}>
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#f9b36b]">beyond the flagship</p>
        <h2 id="more-work-title" className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-[-.05em] text-[#f5f0df] md:text-6xl">
          More systems, <span className="text-[#66f7df]">same obsession.</span>
        </h2>
      </Reveal>
      <div className="mt-10">{safesight && <SafeSightSpotlight p={safesight} />}</div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((p, i) => { const Icon = p.icon; return (
          <Reveal key={p.id} delay={i * 0.06} className="glass-panel flex flex-col rounded-2xl border border-[#2a3550] p-6">
            {projectVideos[p.id] && <CardVideo {...projectVideos[p.id]} label={`${p.title} demo`} />}
            <div className="flex items-center justify-between"><Icon className="h-5 w-5 text-[#66f7df]" aria-hidden /><span className="font-mono text-[10px] uppercase tracking-[.14em] text-[#f9b36b]">{p.stat} · {p.statLabel}</span></div>
            <h3 className="mt-5 flex flex-wrap items-center gap-3 font-display text-2xl text-[#f5f0df]">{p.title}{noRepoDone.includes(p.id) ? <span className="rounded-full border border-[#66f7df]/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.14em] text-[#66f7df]">grade 10 capstone</span> : p.href === profileUrl ? <span className="rounded-full border border-[#66f7df]/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.14em] text-[#66f7df]">still coding</span> : !projectVideos[p.id] && <span className="rounded-full border border-[#f9b36b]/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.14em] text-[#f9b36b]">demo coming soon</span>}</h3>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[.14em] text-[#68718b]">{p.kicker}</p>
            <p className="mt-4 text-sm leading-6 text-[#8f9ab4]">{p.description}</p>
            {moreAbout[p.id] && <p className="mt-3 flex-1 text-sm leading-6 text-[#77829b]">{moreAbout[p.id]}</p>}
            {p.href === profileUrl && !noRepoDone.includes(p.id) && <p className="mt-3 flex-1 text-sm italic leading-6 text-[#66f7df]/80">Still coding — building something unusual.</p>}
            {demos[p.id] && <a href={demos[p.id]} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[.14em] text-[#66f7df]">Live demo <ExternalLink className="h-3 w-3" aria-hidden /></a>}
            {p.href !== profileUrl && <a href={p.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-fit items-center gap-1.5 font-mono text-[10px] uppercase tracking-[.14em] text-[#f9b36b] transition hover:text-[#66f7df]">View on GitHub <ArrowUpRight className="h-3 w-3" aria-hidden /></a>}
            <div className="mt-5 flex flex-wrap gap-1.5">{p.tags.slice(0, 4).map((t) => <span key={t} className="rounded-full border border-[#33405b] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.1em] text-[#77829b]">{t}</span>)}</div>
          </Reveal>); })}
      </div>
      {extra.length > 0 && (
        <>
          <Reveal stagger={false}><div className="mb-5 mt-14 flex flex-wrap items-end justify-between gap-3">
            <h3 className="font-display text-2xl text-[#f5f0df] md:text-3xl">Live from GitHub</h3>
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-[#68718b]"><i className="h-1.5 w-1.5 rounded-full bg-[#66f7df] shadow-[0_0_10px_#66f7df]" />updates automatically</span>
          </div></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {extra.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.05} className="rounded-2xl border border-[#2a3550] bg-[#10172b]/80">
                <a href={r.html_url} target="_blank" rel="noreferrer" className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[.14em] text-[#f9b36b]"><span>{r.language ?? 'repo'}</span><span>{new Date(r.pushed_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</span></div>
                  <h4 className="mt-4 flex items-center gap-2 font-display text-xl text-[#f5f0df]">{r.name.replace(/[-_]/g, ' ')}<ArrowUpRight className="h-4 w-4 text-[#66f7df]" aria-hidden /></h4>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[#8f9ab4]">{r.description ?? 'New project — description coming soon.'}</p>
                  {r.topics && r.topics.length > 0 && <div className="mt-4 flex flex-wrap gap-1.5">{r.topics.slice(0, 4).map((t) => <span key={t} className="rounded-full border border-[#33405b] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.1em] text-[#77829b]">{t}</span>)}</div>}
                </a>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
