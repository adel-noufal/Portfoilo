type EventProperties = Record<string, string | number | boolean>;

type Umami = {
  track: (name: string, data?: EventProperties) => void;
};

declare global {
  interface Window {
    umami?: Umami;
  }
}

type QueuedEvent = {
  name: string;
  data?: EventProperties;
};

const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID?.trim();
const queuedEvents: QueuedEvent[] = [];

function flushQueuedEvents() {
  const umami = window.umami;
  if (!umami) return;

  for (const event of queuedEvents.splice(0)) {
    try {
      umami.track(event.name, event.data);
    } catch {
      // Analytics must never interrupt the portfolio.
    }
  }
}

if (websiteId && typeof document !== 'undefined') {
  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[data-portfolio-analytics]',
  );

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = 'https://cloud.umami.is/script.js';
    script.defer = true;
    script.dataset.websiteId = websiteId;
    script.dataset.portfolioAnalytics = 'true';
    script.addEventListener('load', flushQueuedEvents, { once: true });
    script.addEventListener(
      'error',
      () => {
        queuedEvents.length = 0;
      },
      { once: true },
    );
    document.head.appendChild(script);
  }
}

export function trackEvent(name: string, data?: EventProperties): void {
  if (!websiteId || typeof window === 'undefined') return;

  try {
    if (window.umami) {
      window.umami.track(name, data);
    } else {
      queuedEvents.push({ name, data });
    }
  } catch {
    // Analytics must never interrupt the portfolio.
  }
}