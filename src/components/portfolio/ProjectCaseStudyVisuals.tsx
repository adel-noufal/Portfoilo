import { projectVideos } from '@/config';
import { Fragment } from 'react';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

// Add a path relative to public/ when a project screenshot is supplied.
const screenshotSources: Record<string, string> = {};

export function ProjectArchitectureDiagram({ steps }: { steps: string[] }) {
  return (
    <div
      className="architecture-flow"
      role="img"
      aria-label={`Project architecture: ${steps.join(' to ')}`}
      data-testid="project-architecture-diagram"
    >
      {steps.map((step, index) => (
        <Fragment key={`${step}-${index}`}>
          <div className="architecture-flow__step">
            <span className="architecture-flow__index">0{index + 1}</span>
            <span className="architecture-flow__label">{step}</span>
          </div>
          {index < steps.length - 1 && <ArrowRight className="architecture-flow__arrow" aria-hidden="true" />}
        </Fragment>
      ))}
    </div>
  );
}

export function ProjectScreenshotSlot({ projectId, title }: { projectId: string; title: string }) {
  const relativeSource = screenshotSources[projectId];
  const source = relativeSource ? `${import.meta.env.BASE_URL}${relativeSource}` : undefined;

  if (source) {
    return (
      <figure className="project-screenshot-slot">
      <img src={source} alt={`${title} project screenshot`} loading="lazy" decoding="async" />
        <figcaption>{title} / interface preview</figcaption>
      </figure>
    );
  }

  const video = projectVideos[projectId];
  if (!video) return null;
  const b = import.meta.env.BASE_URL;
  return (
    <figure className="project-screenshot-slot">
      <video src={b + video.src} poster={b + video.poster} controls muted loop playsInline preload="none" className="w-full rounded-xl" aria-label={`${title} demo`} />
      <figcaption>{title} / demo</figcaption>
    </figure>
  );
}
