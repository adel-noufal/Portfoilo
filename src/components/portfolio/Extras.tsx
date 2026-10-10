import { useState } from 'react';
import { Send, Quote } from 'lucide-react';
import { Reveal } from '@/components/portfolio/motion';
import { contactEmail, formspreeId, testimonials } from '@/config';

export function Testimonials() {
  if (!testimonials.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <Reveal stagger={false}><h2 className="font-display text-3xl text-[#f5f0df] md:text-5xl">What people <span className="text-[#66f7df]">say.</span></h2></Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {testimonials.map((t) => (
          <Reveal key={t.name} className="rounded-2xl border border-[#2a3550] bg-[#10172b]/80 p-7">
            <Quote className="h-6 w-6 text-[#f9b36b]" aria-hidden />
            <p className="mt-4 text-lg leading-8 text-[#c6cad0]">{t.quote}</p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[.14em] text-[#66f7df]">{t.name} <span className="text-[#68718b]">· {t.role}</span></p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const field = 'w-full rounded-xl border border-[#2a3550] bg-[#0c1120] px-4 py-3 text-[#f5f0df] outline-none transition focus:border-[#66f7df]';
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget, data = new FormData(f);
    if (!formspreeId) {
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent('Portfolio message from ' + data.get('name'))}&body=${encodeURIComponent(String(data.get('message')) + '\n\n' + data.get('email'))}`;
      return;
    }
    setState('sending');
    try {
      const r = await fetch(`https://formspree.io/f/${formspreeId}`, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (r.ok) { setState('done'); f.reset(); } else setState('error');
    } catch { setState('error'); }
  }
  return (
    <section id="message" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-16 md:px-8">
      <Reveal stagger={false}>
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#f9b36b]">drop a message</p>
        <h2 className="mt-3 font-display text-3xl text-[#f5f0df] md:text-5xl">Prefer a quick note?</h2>
        <form onSubmit={submit} className="mt-8 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="name" required placeholder="Your name" className={field} aria-label="Your name" />
            <input name="email" type="email" required placeholder="Your email" className={field} aria-label="Your email" />
          </div>
          <textarea name="message" required rows={5} placeholder="What are you building?" className={field} aria-label="Message" />
          <button disabled={state === 'sending'} className="inline-flex w-fit items-center gap-2 rounded-full bg-[#66f7df] px-6 py-3 font-mono text-[11px] uppercase tracking-[.14em] text-[#0a0d18] transition hover:brightness-110 disabled:opacity-60">
            <Send className="h-4 w-4" aria-hidden />{state === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {state === 'done' && <p className="text-[#66f7df]" role="status">Sent — thank you, I'll reply soon.</p>}
          {state === 'error' && <p className="text-[#f9b36b]" role="alert">Couldn't send. Please email {contactEmail} directly.</p>}
        </form>
      </Reveal>
    </section>
  );
}
