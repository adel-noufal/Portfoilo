import { useRef } from 'react';
import { Camera, Mic2 } from 'lucide-react';
import { Reveal } from '@/components/portfolio/motion';

const events = [
  {
    id: 'ai-tinkerers',
    date: 'AUG 2026',
    kind: 'speaker',
    title: 'AI Tinkerers',
    description: 'Presenting EduSense 2 — a room full of builders, one very live system.',
    imagePath: 'events/ai-tinkerers.jpg',
    icon: Mic2,
  },
  {
    id: 'tech-skills-forum',
    date: '2–6 JUN 2026',
    kind: 'participant',
    title: 'Tech Skills Forum',
    description: 'Showing up where technical curiosity becomes practical craft.',
    imagePath: 'events/tech-skills-forum.jpg',
    icon: Camera,
  },
];

// Add a relative public/ path for each event after supplying real photos.
const eventPhotos: Record<string, string[]> = {
  'ai-tinkerers': ['events/ai-tinkerers-1.jpg', 'events/ai-tinkerers-2.jpg'],
  'tech-skills-forum': ['events/tech-skills-1.jpg', 'events/tech-skills-2.jpg'],
};

export function EventGallery() {
  return (
    <section id="events" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24" aria-labelledby="events-heading">
      <Reveal stagger={false}>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#f9b36b]">05 / field notes / events</p>
            <h2 id="events-heading" className="mt-3 font-display text-4xl font-semibold tracking-[-.05em] text-[#f5f0df] md:text-5xl">Out in the room.</h2>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[.14em] text-[#68718b]">moments from the field</span>
        </div>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event, index) => {
          const Icon = event.icon;
          const photos = (eventPhotos[event.id] ?? []).map((p) => `${import.meta.env.BASE_URL}${p}`);
          return (
            <Reveal key={event.id} delay={index * 0.07} className="event-card glass-panel overflow-hidden rounded-2xl">
              <div className={`event-card__photo ${photos.length > 1 ? 'multi' : ''} ${event.id === 'digitopia-mcit' ? 'contain' : ''}`} data-testid={`event-photo-slot-${event.id}`}>
                {photos.length ? (
                  photos.map((src, i) => <img key={src} src={src} alt={`${event.title} ${event.id === 'digitopia-mcit' ? 'certificate' : 'photo'} ${i + 1}`} loading="lazy" decoding="async" />)
                ) : (
                  <div className="event-card__placeholder">
                    <Icon className="h-6 w-6 text-[#66f7df]" aria-hidden="true" />
                    <span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#b9c2d6]">photo slot</span>
                    <span className="font-mono text-[8px] text-[#71809d]">Add public/{event.imagePath}</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-[.14em] text-[#f9b36b]">{event.date}</span>
                  <span className="rounded-full border border-[#33405b] px-2 py-1 font-mono text-[8px] uppercase tracking-[.12em] text-[#77829b]">{event.kind}</span>
                </div>
                <h3 className="mt-3 font-display text-xl text-[#f5f0df]">{event.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#8f9ab4]">{event.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}