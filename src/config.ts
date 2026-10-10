/** Edit here. */
export const githubUser = 'adel-noufal';
/** Repo names (any case) that should never appear in the auto-updating list. */
export const hiddenRepos = ['fahmak', 'portfoilo', 'portfolio', 'adel-noufal', 'adel-noufal-portfolio'];

/** Live demo links by project id (leave out any you don't have yet). */
export const demos: Record<string, string> = {
  // safesight: 'https://your-safesight-demo.com',
};
/** Get a free form ID at formspree.io and paste it here (e.g. 'xyzabcde'). Empty = opens the visitor's email app instead. */
export const formspreeId = 'xrpeqgba';
export const contactEmail = 'Adel.moh129649@gmail.com';
/** Add real recommendations; the section only shows when this has entries. */
export const testimonials: { quote: string; name: string; role: string }[] = [
  // { quote: 'Short, real quote.', name: 'Full Name', role: 'Title, Organization' },
];

/** Card videos by project id (files live in public/media). */
export const projectVideos: Record<string, { src: string; poster: string }> = {
  'progress-counter': { src: 'media/progress-counter.mp4', poster: 'media/progress-counter.jpg' },
  'asb-finstat': { src: 'media/asb-finstat.mp4', poster: 'media/asb-finstat.jpg' },
  'gmail-mcp': { src: 'media/gmail-mcp.mp4', poster: 'media/gmail-mcp.jpg' },
};


/** Profile link: a project whose href equals this has no repo yet. */
export const profileUrl = 'https://github.com/adel-noufal';

/** Longer write-ups shown on the cards (from each repo's README). */
export const moreAbout: Record<string, string> = {
  stockpad: 'A Django REST Framework backend with a vanilla-JS front end for an internal material-request workflow. Engineers submit requests here; approvals happen in a separate system and return through signed HMAC-SHA256 webhooks, so a request status is never changed locally.',
  'gmail-mcp': 'A local Model Context Protocol server that lets an AI assistant read your inbox, save drafts and send email, but only with your approval. Drafting cannot send by design, and sending needs a secret token that only you know.',
  'asb-finstat': 'Built with Team Friendly Strangers for a hackathon. Choose a country and a company, and an AI agent pipeline identifies the legal entity across global registries, finds the latest financial statement PDFs, translates them and extracts the key figures. React and TypeScript on the front, FastAPI behind.',
  'progress-counter': 'An animated 10-day AI-model-training tracker built with pure HTML, CSS and JavaScript for the iSchool web development challenge. Day and night sky transitions and a progress bar tell the story of each training day.',
  'edusense-v1': 'My Grade 10 capstone project, and the first version of EduSense: a camera-based classroom tool built around computer vision for live sessions.',
};

/** Finished projects that intentionally have no public repo. */
export const noRepoDone = ['edusense-v1'];

/** Shown in the nav and footer. */
export const availability = { short: 'open to internships', long: 'open to internships & collaboration' };

/** Add certificates here: image files go in public/ (e.g. public/certs/name.jpg). */
export const certificates: { title: string; issuer: string; year: string; image: string }[] = [
  { title: 'Digitopia — Software & AI track, phase two', issuer: 'Ministry of Communications and IT, Egypt', year: '2025', image: 'certs/digitopia.jpg' },
  { title: 'Advanced Web Development — Module 1: Level 1', issuer: 'iSchool × Mobica', year: 'August 2025', image: 'certs/ischool-web-development.jpg' },
];

/** Verified numbers from the project repos. */
export const results: { project: string; metric: string; value: number; unit: string; note: string }[] = [
  { project: 'SafeSight · Model 2', metric: 'Helmet precision', value: 96.9, unit: '%', note: '3 classes · 7,041 images' },
  { project: 'SafeSight · Model 2', metric: 'Head precision', value: 95.0, unit: '%', note: '3 classes · 7,041 images' },
  { project: 'EduSense 2', metric: 'Emotion accuracy', value: 90.9, unit: '%', note: '7 emotion classes · custom EfficientNet-B0' },
  { project: 'SafeSight · Model 3', metric: 'mAP@0.5', value: 80.8, unit: '%', note: '10 classes · 2,801 images' },
];
