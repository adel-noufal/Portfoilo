import { type MouseEvent as ReactMouseEvent, type ReactNode, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleDot,
  Code2,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileText,
  Github,
  Layers3,
  Linkedin,
  Mail,
  MessageCircle,
  MousePointer2,
  Menu,
  Network,
  ScanFace,
  Send,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { CountUp, Reveal } from '@/components/portfolio/motion';
import { ScrollProgress } from '@/components/portfolio/ScrollProgress';
import { caseStudyContent, liveDemoUrls } from '@/components/portfolio/case-study-content';
import { ProjectArchitectureDiagram, ProjectScreenshotSlot } from '@/components/portfolio/ProjectCaseStudyVisuals';
import { Results, Certificates } from '@/components/portfolio/Proof';
import { availability } from '@/config';
import { Testimonials, ContactForm } from '@/components/portfolio/Extras';
import { useExtraRepos } from '@/lib/github';
import { EventGallery } from '@/components/portfolio/EventGallery';
import { ContactShortcut, CustomCursor } from '@/components/portfolio/PortfolioInteractions';
import { trackEvent } from '@/analytics';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import profilePhoto from '@/assets/profile.jpg';
import { MoreWork } from '@/components/portfolio/MoreWork';
import Effects, { TechMarquee } from '@/components/portfolio/Effects';

const queryClient = new QueryClient();
const cvHref = `${import.meta.env.BASE_URL}Adel_Mohamed_Noufal_CV.pdf`;
const NeuralGraph3D = lazy(() => import('@/components/portfolio/NeuralGraph3D'));

const projects = [
  {
    id: 'edusense',
    index: '01',
    title: 'EduSense 2',
    kicker: 'Flagship system / multi-agent education',
    description: 'An AI education platform that reads the room, retrieves the right context, and turns it into a lesson that can keep moving offline.',
    detail: 'Seven specialized agents coordinate emotion analysis, engagement scoring, pedagogical recommendations, content generation, and PDF reporting. The system routes Gemini 2.0 Flash to four local Ollama models, with deterministic templates as its offline floor.',
    tags: ['PyTorch', 'Multi-agent', 'RAG', 'ChromaDB'],
    stat: '90.9%',
    statLabel: 'emotion accuracy',
    accent: 'teal',
    href: 'https://github.com/adel-noufal/Edusense',
    repoLabel: 'github.com/adel-noufal/Edusense',
    repoType: 'repository',
    icon: BrainCircuit,
  },
  {
    id: 'stockpad',
    index: '02',
    title: 'StockPad',
    kicker: 'Operations / full-stack platform',
    description: 'A two-service material-request platform built to keep stockrooms and people in sync without the spreadsheet handoff.',
    detail: 'Django REST services, PostgreSQL, HMAC-SHA256 webhook sync, JWT and Google OAuth, plus a Gemini chatbot. Seven integration tests protect the connective tissue.',
    tags: ['Django REST', 'PostgreSQL', 'OAuth', 'Webhooks'],
    stat: '07',
    statLabel: 'integration tests',
    accent: 'amber',
    href: 'https://github.com/adel-noufal/Stockpad-Web-2',
    repoLabel: 'github.com/adel-noufal/Stockpad-Web-2',
    repoType: 'repository',
    icon: Database,
  },
  {
    id: 'gmail-mcp',
    index: '03',
    title: 'Gmail MCP Server',
    kicker: 'MCP / human-approved email automation',
    description: 'A local MCP server that gives AI assistants carefully scoped Gmail tools for reading recent messages, drafting replies, and handling outgoing mail.',
    detail: 'The repository separates read-only inbox access and draft creation from an explicitly approved send action, keeping the user in control of email automation.',
    tags: ['Python', 'MCP', 'Gmail API', 'Approval-gated actions'],
    stat: 'MCP',
    statLabel: 'local tool server',
    accent: 'violet',
    href: 'https://github.com/adel-noufal/Gmail-Mcp-Server-Automation',
    repoLabel: 'github.com/adel-noufal/Gmail-Mcp-Server-Automation',
    repoType: 'repository',
    icon: Mail,
  },
  {
    id: 'asb-finstat',
    index: '04',
    title: 'ASB Finstat',
    kicker: 'Hackathon / financial document intelligence',
    description: 'A team-built application for finding company filings and extracting structured information from financial statements.',
    detail: 'The README describes a five-step pipeline for entity lookup, statement retrieval, language detection, translation, and table extraction, with progress streamed over WebSockets. Built by Team Friendly Strangers for a hackathon.',
    tags: ['FastAPI', 'React', 'TypeScript', 'WebSockets'],
    stat: '5-step',
    statLabel: 'financial statement pipeline',
    accent: 'teal',
    href: 'https://github.com/adel-noufal/Asb-Finstat',
    repoLabel: 'github.com/adel-noufal/Asb-Finstat',
    repoType: 'team repository',
    icon: FileText,
  },
  {
    id: 'progress-counter',
    index: '06',
    title: 'Progress Counter',
    kicker: 'iSchool challenge / interactive web animation',
    description: 'An animated ten-day interface that makes an AI model-training progression feel like an interactive story.',
    detail: 'Built for an iSchool web-development challenge with vanilla HTML, CSS, and JavaScript. The experience combines a shifting day/night cycle, timeline transitions, and ten custom animated SVG characters.',
    tags: ['HTML', 'CSS animation', 'JavaScript', 'SVG'],
    stat: '10 days',
    statLabel: 'interactive training timeline',
    accent: 'amber',
    href: 'https://github.com/adel-noufal/Progress-Counter',
    repoLabel: 'github.com/adel-noufal/Progress-Counter',
    repoType: 'repository',
    icon: Activity,
  },
  {
    id: 'edusense-v1',
    index: '07',
    title: 'EduSense v1',
    kicker: 'Grade 10 capstone / computer vision',
    description: 'My Grade 10 capstone project: a camera-based classroom tool that reads student facial expressions in real time, logs emotion signals, and gives instructors a live dashboard.',
    detail: 'FastAPI, DeepFace, MySQL, and Node work together to manage live sessions, countdowns, emotion logging, drop alerts, and automated reports.',
    tags: ['FastAPI', 'DeepFace', 'MySQL', 'Node'],
    stat: 'LIVE',
    statLabel: 'facial analysis',
    accent: 'coral',
    href: 'https://github.com/adel-noufal',
    repoLabel: 'github.com/adel-noufal',
    repoType: 'profile',
    icon: ScanFace,
  },
  {
    id: 'safesight',
    index: '08',
    title: 'SafeSight',
    kicker: 'Vision / safety intelligence',
    description: 'A real-time computer vision system that checks hard hats and safety vests on construction sites and flags violations instantly.',
    detail: 'The public repository documents YOLO-based live/image/video detection and violation alerts. It reports 80.8% mAP@0.5 across ten classes for its comprehensive model.',
    tags: ['YOLOv8', 'OpenCV', 'Object detection', 'Safety alerts'],
    stat: '80.8%',
    statLabel: 'mAP@0.5 / 10 classes',
    accent: 'violet',
    href: 'https://github.com/adel-noufal/Worker-Safety-PPE',
    repoLabel: 'github.com/adel-noufal/Worker-Safety-PPE',
    repoType: 'repository',
    icon: ShieldCheck,
  },
  {
    id: 'young-creatives',
    index: '09',
    title: 'The Young Creatives',
    kicker: 'In progress',
    description: 'Still coding — building something unusual. Details coming soon.',
    detail: 'Nothing to show yet. This one is still being built.',
    tags: ['In progress'],
    stat: 'WIP',
    statLabel: 'in progress',
    accent: 'lime',
    href: 'https://github.com/adel-noufal',
    repoLabel: 'github.com/adel-noufal',
    repoType: 'profile',
    icon: Sparkles,
  },
];

const skills = [
  { label: 'Python', group: 'build', level: 92, project: 'Gmail MCP Server', href: 'https://github.com/adel-noufal/Gmail-Mcp-Server-Automation' },
  { label: 'AI agents', group: 'reason', level: 91, project: 'EduSense 2', href: 'https://github.com/adel-noufal/Edusense' },
  { label: 'Computer vision', group: 'perceive', level: 88, project: 'SafeSight', href: 'https://github.com/adel-noufal/Worker-Safety-PPE' },
  { label: 'RAG systems', group: 'ground', level: 86, project: 'EduSense 2', href: 'https://github.com/adel-noufal/Edusense' },
  { label: 'Django / FastAPI', group: 'ship', level: 87, project: 'StockPad', href: 'https://github.com/adel-noufal/Stockpad-Web-2' },
  { label: 'React.js / Node', group: 'ship', level: 78, project: 'ASB Finstat', href: 'https://github.com/adel-noufal/Asb-Finstat' },
  { label: 'PyTorch', group: 'learn', level: 84, project: 'EduSense 2', href: 'https://github.com/adel-noufal/Edusense' },
  { label: 'SQL / databases', group: 'store', level: 82, project: 'StockPad', href: 'https://github.com/adel-noufal/Stockpad-Web-2' },
  { label: 'REST APIs', group: 'connect', level: 90, project: 'StockPad', href: 'https://github.com/adel-noufal/Stockpad-Web-2' },
  { label: 'Power BI', group: 'explain', level: 70, project: 'ASB Finstat', href: 'https://github.com/adel-noufal/Asb-Finstat' },
];

function SectionMarker({ number, label, children }: { number: string; label: string; children: ReactNode }) {
  return (
    <Reveal className="mb-12 grid gap-5 md:grid-cols-[110px_1fr] md:items-start">
      <div className="font-mono text-xs text-[#66f7df]" data-testid={`text-section-number-${number}`}>
        <span className="mr-2 text-[#68718b]">/</span>{number}
      </div>
      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[#f9b36b]" data-testid={`text-section-label-${number}`}>{label}</p>
        <h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#f5f0df] md:text-6xl">{children}</h2>
      </div>
    </Reveal>
  );
}

function NeuralFieldFallback() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(3);
  const nodes = [
    [60, 102], [165, 62], [205, 180], [304, 112], [354, 242], [460, 82], [502, 196], [584, 132], [660, 266],
  ];
  const links = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [3, 6], [4, 6], [5, 7], [6, 7], [6, 8], [7, 8]];
  const nodeDetails = [
    ['perception', 'emotion analysis'],
    ['measurement', 'engagement scoring'],
    ['pedagogy', 'recommendations'],
    ['core', 'orchestration layer'],
    ['generation', 'lesson / quiz / cards'],
    ['retrieval', 'cited curriculum context'],
    ['reporting', 'PDF intelligence'],
    ['routing', 'local model handoff'],
    ['offline floor', 'deterministic templates'],
  ];
  return (
    <div
      className="glass-panel relative h-[330px] w-full max-w-[700px] overflow-hidden rounded-[2rem] md:h-[420px]"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({ x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.height - 0.5 });
      }}
      onMouseLeave={() => setPointer({ x: 0, y: 0 })}
      data-testid="interactive-neural-field"
      aria-label="Interactive neural network visualization"
    >
      <div className="lab-grid absolute inset-0 opacity-60" />
      <div className="absolute left-5 top-5 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8090af]">
         <span className="h-2 w-2 rounded-full bg-[#66f7df] shadow-[0_0_16px_#66f7df]" /> pointer-responsive topology
      </div>
      <motion.div animate={{ rotateX: pointer.y * -8, rotateY: pointer.x * 10, x: pointer.x * 12, y: pointer.y * 8 }} transition={{ type: 'spring', stiffness: 80, damping: 18 }} className="absolute inset-0 [transform-style:preserve-3d]">
        <svg viewBox="0 0 720 330" className="h-full w-full p-5 md:p-8" role="img" aria-label="Abstract network of connected AI agents">
          <defs>
            <filter id="node-glow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <g opacity=".35">
            <ellipse cx="360" cy="165" rx="305" ry="132" fill="none" stroke="#607299" strokeDasharray="2 12" />
            <ellipse cx="360" cy="165" rx="220" ry="91" fill="none" stroke="#607299" strokeDasharray="2 10" className="orbit" />
          </g>
          <g fill="none" stroke="#5f759d" strokeWidth="1.2">
            {links.map(([from, to], index) => <line key={`${from}-${to}`} x1={nodes[from][0]} y1={nodes[from][1]} x2={nodes[to][0]} y2={nodes[to][1]} className={`topo-line ${index % 2 ? 'slow' : ''}`} />)}
          </g>
          <g fill="none" stroke="#66f7df" strokeWidth="1" opacity=".4">
            <path d="M60 102 C180 280, 420 5, 660 266" className="topo-line" />
            <path d="M165 62 C330 315, 470 12, 584 132" className="topo-line slow" />
          </g>
          {nodes.map(([x, y], index) => (
            <g
              key={`${x}-${y}`}
              filter={index === 3 ? 'url(#node-glow)' : undefined}
              role="button"
              tabIndex={0}
              aria-label={`Select ${nodeDetails[index][0]} node`}
              data-testid={`button-neural-node-${index}`}
              onClick={() => setSelectedNode(index)}
              onPointerEnter={() => setSelectedNode(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedNode(index);
                }
              }}
              className={`${index === 3 ? 'pulse-dot' : ''} cursor-pointer outline-none`}
            >
              <circle cx={x} cy={y} r={index === 3 ? 14 : 6} fill={index === 3 ? '#f9b36b' : '#66f7df'} opacity={selectedNode === index ? 1 : index === 3 ? .95 : .7} />
              <circle cx={x} cy={y} r={selectedNode === index ? 19 : index === 3 ? 23 : 13} fill="none" stroke={index === 3 ? '#f9b36b' : '#66f7df'} opacity={selectedNode === index ? .78 : .3} strokeWidth={selectedNode === index ? 1.5 : 1} />
            </g>
          ))}
          <text x="329" y="161" fill="#151b31" fontSize="10" fontFamily="DM Mono" fontWeight="bold">CORE</text>
        </svg>
      </motion.div>
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#68718b]">
        <span className="flex items-center gap-2"><MousePointer2 className="h-3 w-3 text-[#66f7df]" /> hover / select nodes</span>
        <span className="text-right"><span className="mr-2 text-[#66f7df]">{nodeDetails[selectedNode][0]}</span><span className="hidden text-[#f9b36b] sm:inline">{nodeDetails[selectedNode][1]}</span></span>
      </div>
    </div>
  );
}

function NeuralField() {
  return (
    <Suspense fallback={<NeuralFieldFallback />}>
      <NeuralGraph3D />
    </Suspense>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const nav = [
    ['01', 'about'], ['02', 'work'], ['03', 'stack'], ['04', 'events'], ['05', 'contact'],
  ];
  return (
    <header className="glass-nav fixed left-0 right-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="flex items-center gap-3" data-testid="link-logo">
          <span className="glass-mark grid h-8 w-8 place-items-center rounded-lg border border-[#66f7df]/60 font-display text-sm font-bold text-[#66f7df]">A</span>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-[#b9c2d6] sm:block">adel / noufal</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {nav.map(([number, label]) => (
            <a key={label} href={`#${label}`} className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8993ad] transition-colors hover:text-[#66f7df]" data-testid={`link-nav-${label}`}>
              <span className="mr-2 text-[#f9b36b]">{number}</span>{label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#8b95ad]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#66f7df]" /> {availability.short}</span>
           <a href={cvHref} download className="glass-link flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b9c2d6]" data-testid="link-header-cv"><Download className="h-3 w-3 text-[#f9b36b]" /> CV</a>
           <a href="#message" className="glass-button rounded-full border border-[#66f7df]/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#66f7df]" data-testid="link-header-contact">connect <ArrowUpRight className="ml-1 inline-block h-3 w-3" /></a>
        </div>
          <button onClick={() => setOpen(!open)} className="glass-button grid h-10 w-10 place-items-center rounded-full border border-[#33405b] text-[#66f7df] md:hidden" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} data-testid="button-mobile-menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="glass-mobile-menu overflow-hidden border-t border-[#29334b] px-5 pb-5 md:hidden" aria-label="Mobile navigation">
            {nav.map(([number, label]) => <a key={label} href={`#${label}`} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-[#29334b] py-4 font-mono text-xs uppercase tracking-[0.18em] text-[#b9c2d6]" data-testid={`link-mobile-nav-${label}`}><span><span className="mr-3 text-[#f9b36b]">{number}</span>{label}</span><ChevronRight className="h-4 w-4 text-[#66f7df]" /></a>)}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const artY = useTransform(scrollYProgress, [0, 1], [0, -56]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -22]);
  return (
    <section ref={heroRef} id="top" className="hero-section relative min-h-[760px] overflow-hidden pt-28 md:min-h-[860px] md:pt-36">
      <div className="lab-grid pointer-events-none absolute inset-x-0 top-0 h-[670px] opacity-60" />
      <div className="pointer-events-none absolute -right-40 top-28 h-[520px] w-[520px] rounded-full bg-[#66f7df]/[.055] blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-[480px] h-[420px] w-[420px] rounded-full bg-[#f9b36b]/[.045] blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-[.92fr_1.08fr] md:px-8">
        <motion.div style={{ y: reduceMotion ? 0 : copyY }} className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.2em] text-[#66f7df]" data-testid="status-hero">
            <span className="h-px w-10 bg-[#66f7df]" /> signal field / 2026
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, delay: .08 }} className="max-w-3xl font-display text-[clamp(3.8rem,10vw,8.5rem)] font-semibold leading-[.87] tracking-[-.075em] text-[#f5f0df]">
            Building<br /><span className="text-[#66f7df] text-glow">agents,</span><br /><em className="font-normal text-[#f9b36b]">not just apps.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7, delay: .35 }} className="mt-9 max-w-md text-[15px] leading-7 text-[#aab3c8]" data-testid="text-hero-intro">
            I’m <strong className="font-semibold text-[#f5f0df]">Adel Mohamed Noufal</strong>, an AI &amp; Data Science student building systems that perceive, reason, retrieve, and ship.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7, delay: .5 }} className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#work" className="glass-button glass-button--primary group flex items-center gap-3 rounded-full px-5 py-3 font-mono text-[11px] uppercase tracking-[.14em]" data-testid="link-hero-work">enter the lab <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" /></a>
             <a href="#about" className="glass-link font-mono text-[11px] uppercase tracking-[.14em] text-[#9aa5bc]" data-testid="link-hero-about">read the signal <ArrowUpRight className="ml-1 inline-block h-3 w-3" /></a>
             <a href={cvHref} download className="glass-link flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.14em] text-[#9aa5bc]" data-testid="link-hero-cv"><Download className="h-3.5 w-3.5 text-[#f9b36b]" /> download CV</a>
          </motion.div>
        </motion.div>
        <motion.div style={{ y: reduceMotion ? 0 : artY }} initial={{ opacity: 0, scale: .95, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : .2 }} className="relative w-full max-w-[700px] md:justify-self-end">
          <NeuralField />
          <div className="glass-panel absolute right-3 top-14 z-20 hidden w-36 rounded-xl p-4 md:block">
            <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[.14em] text-[#77829b]"><span>active core</span><Activity className="h-3 w-3 text-[#f9b36b]" /></div>
            <div className="font-display text-2xl text-[#f5f0df]">7 agents</div>
            <div className="mt-1 font-mono text-[9px] text-[#66f7df]">coordinating now</div>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-8 left-5 right-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[.17em] text-[#626d87] md:left-8 md:right-8">
        <span>scroll to inspect</span><span className="hidden sm:block">AI / CV / RAG / FULL-STACK</span><span>↓</span>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-36">
      <SectionMarker number="01" label="orientation">A student on a<br /><span className="text-[#66f7df]">serious trajectory.</span></SectionMarker>
      <div className="grid gap-12 md:grid-cols-[1.15fr_.85fr] md:gap-24">
        <Reveal>
          <p className="max-w-2xl text-2xl leading-[1.35] tracking-[-.025em] text-[#d7d6ca] md:text-4xl" data-testid="text-profile">
            Grade 12, Artificial Intelligence Track at Mobica International Applied Technology School. I learn by making the entire loop real — from a model’s first prediction to the API, interface, and person waiting on the other side.
          </p>
          <p className="mt-7 max-w-xl text-[15px] leading-7 text-[#8f9ab4]">My working languages are Arabic, English, and German. The things I keep returning to are machine learning, agents, retrieval, and the small details that make a tool feel alive.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            {['machine learning', 'AI agents', 'computer vision', 'RAG systems', 'REST design'].map((item) => <span key={item} className="rounded-full border border-[#33405b] px-3 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-[#a6b0c4]" data-testid={`tag-about-${item.replaceAll(' ', '-')}`}>{item}</span>)}
          </div>
        </Reveal>
        <Reveal delay={.15} className="md:pt-2">
          <figure className="glass-panel portrait-frame group relative mb-10 overflow-hidden rounded-[1.5rem]">
            <img src={profilePhoto} alt="Adel Mohamed Noufal standing indoors" width="1000" height="1002" loading="lazy" className="h-[360px] w-full object-cover object-[center_28%] grayscale-[.18] transition duration-700 group-hover:scale-[1.035] group-hover:grayscale-0 md:h-[420px]" data-testid="image-profile-photo" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101321]/90 via-transparent to-[#66f7df]/[.08]" />
            <figcaption className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#66f7df]">field operator</p>
                <p className="mt-1 font-display text-xl text-[#f5f0df]">Adel Noufal</p>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[.14em] text-[#b9c2d6]">AI / DATA</span>
            </figcaption>
          </figure>
          <div className="border-l border-[#f9b36b] pl-6">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#f9b36b]">field notes</p>
            <div className="mt-7 space-y-7">
              <div><div className="font-display text-4xl text-[#f5f0df]"><CountUp value={500} suffix="+" /></div><p className="mt-1 text-sm text-[#8f9ab4]">LinkedIn connections</p></div>
              <div><div className="font-display text-4xl text-[#f5f0df]">03</div><p className="mt-1 text-sm text-[#8f9ab4]">languages in the stack</p></div>
              <div><div className="font-display text-4xl text-[#f5f0df]">∞</div><p className="mt-1 text-sm text-[#8f9ab4]">questions still open</p></div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProofSignals() {
  const extraCount = useExtraRepos(projects).length;
  const signals = [
    ['90.9%', 'EduSense 2 emotion accuracy', 'teal'],
    ['07', 'StockPad integration tests', 'amber'],
    ['80.8%', 'SafeSight mAP@0.5 · 10 classes', 'teal'],
    [String(projects.length + extraCount).padStart(2, '0'), 'projects built across vision, NLP & ops', 'amber'],
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32" aria-labelledby="proof-signals-title">
      <Reveal className="proof-rail glass-panel rounded-[1.5rem] p-5 md:p-7" stagger={false}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="glass-icon grid h-9 w-9 place-items-center rounded-lg text-[#66f7df]"><ShieldCheck className="h-4 w-4" /></span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#f9b36b]" id="proof-signals-title">proof / signal</p>
              <p className="mt-1 text-sm text-[#8994ad]">A compact readout from the work already in the room.</p>
            </div>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[.16em] text-[#68718b]">verified project notes</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {signals.map(([value, label, accent], index) => (
            <div key={label} className="signal-card group rounded-xl border border-[#29334b] p-4" data-testid={`card-proof-signal-${index}`}>
              <div className={`font-display text-3xl tracking-[-.06em] ${accent === 'amber' ? 'text-[#f9b36b]' : 'text-[#66f7df]'}`} data-testid={`text-proof-value-${index}`}>
                {value === '90.9%' ? <CountUp value={90.9} decimals={1} suffix="%" /> : value === '07' ? <CountUp value={7} padTo={2} /> : value === '500+' ? <CountUp value={500} suffix="+" /> : value}
              </div>
              <div className="mt-2 text-xs leading-5 text-[#8994ad]">{label}</div>
          </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function EduSenseFeature() {
  const agents = [
    { title: 'perception', text: 'emotion analysis', icon: ScanFace },
    { title: 'measurement', text: 'engagement scoring', icon: Activity },
    { title: 'pedagogy', text: 'recommendations', icon: BookOpen },
    { title: 'generation', text: 'lesson / quiz / cards', icon: Sparkles },
    { title: 'retrieval', text: 'cited curriculum context', icon: Database },
    { title: 'routing', text: 'local model handoff', icon: Network },
    { title: 'reporting', text: 'PDF intelligence', icon: FileText },
  ];
  return (
    <section className="feature-section relative overflow-hidden py-24 md:py-36">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(102,247,223,.12), transparent 26%), radial-gradient(circle at 10% 80%, rgba(249,179,107,.08), transparent 30%)' }} />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-5">
          <div><p className="mb-3 font-mono text-[11px] uppercase tracking-[.24em] text-[#f9b36b]">featured system / 01</p><h2 className="max-w-2xl font-display text-5xl font-semibold leading-[.95] tracking-[-.06em] text-[#f5f0df] md:text-7xl">When a classroom<br /><span className="text-[#66f7df]">starts to listen.</span></h2></div>
          <a href="https://github.com/adel-noufal/Edusense" target="_blank" rel="noreferrer" className="flex items-center gap-2 border-b border-[#66f7df] pb-2 font-mono text-[10px] uppercase tracking-[.16em] text-[#66f7df] transition hover:border-[#f9b36b] hover:text-[#f9b36b]" data-testid="link-edusense-github">inspect on github <ExternalLink className="h-3 w-3" /></a>
        </div>
         <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
           <Reveal><p className="max-w-lg text-xl leading-8 text-[#c6cad0]" data-testid="text-edusense-description">EduSense 2 is a multi-agent AI education platform built around one belief: useful intelligence should understand context before it speaks.</p><p className="mt-6 max-w-lg text-[15px] leading-7 text-[#8490aa]">A custom PyTorch EfficientNet-B0 model reaches <span className="text-[#f9b36b]">90.9% overall accuracy</span> across seven emotion classes. Then the system keeps going — from a signal in the room to grounded, cited, teachable output.</p><div className="mt-10 flex items-center gap-4"><div className="font-display text-6xl tracking-[-.08em] text-[#66f7df]"><CountUp value={90.9} decimals={1} /><span className="text-3xl">%</span></div><div className="max-w-[130px] font-mono text-[10px] uppercase leading-5 tracking-[.12em] text-[#8490aa]">overall accuracy across 7 emotion classes</div></div></Reveal>
           <Reveal delay={.12}><div className="glass-panel relative rounded-2xl p-5 md:p-7"><div className="mb-7 flex items-center justify-between"><div className="flex items-center gap-3"><span className="glass-icon grid h-9 w-9 place-items-center rounded-lg text-[#66f7df]"><Network className="h-5 w-5" /></span><div><div className="font-display text-sm text-[#f5f0df]">agent orchestration</div><div className="font-mono text-[9px] uppercase tracking-[.14em] text-[#6e7891]">live architecture</div></div></div><span className="font-mono text-[10px] text-[#66f7df]">7 / 7 online</span></div><div className="agent-sequence space-y-2">{agents.map((agent, index) => { const Icon = agent.icon; return <motion.div key={agent.title} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .07 }} className="agent-pulse glass-row group flex items-center gap-4 rounded-xl px-4 py-3" data-testid={`card-agent-${agent.title}`}><span className="font-mono text-[10px] text-[#626d87]">0{index + 1}</span><span className="glass-icon grid h-8 w-8 place-items-center rounded-lg border border-[#3c4763] text-[#66f7df] transition group-hover:bg-[#66f7df] group-hover:text-[#101321]"><Icon className="h-4 w-4" /></span><div className="flex-1"><div className="font-mono text-[10px] uppercase tracking-[.15em] text-[#f5f0df]">{agent.title}</div><div className="mt-0.5 text-sm text-[#8e99b2]">{agent.text}</div></div><CircleDot className="h-3 w-3 text-[#66f7df]" /></motion.div>; })}</div><div className="mt-5 border-t border-[#29334b] pt-4 font-mono text-[10px] leading-5 text-[#68718b]">Gemini 2.0 Flash online <span className="px-2 text-[#f9b36b]">→</span> 4 local Ollama models <span className="px-2 text-[#f9b36b]">→</span> deterministic offline templates</div></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function Work() {
  const [active, setActive] = useState('edusense');
  const [detailOpen, setDetailOpen] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const selected = projects.find((project) => project.id === active) ?? projects[0];
  const selectedCaseStudy = caseStudyContent[selected.id];
  const liveDemoUrl = liveDemoUrls[selected.id];
  const visibleProjects = showAllProjects ? projects : projects.slice(0, 4);
  const toggleProjects = () => {
    if (showAllProjects && projects.slice(4).some((project) => project.id === active)) {
      setActive('edusense');
    }
    setShowAllProjects((current) => !current);
  };
  useEffect(() => {
    if (!detailOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDetailOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [detailOpen]);
  return (
    <section id="work" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-36">
      <SectionMarker number="02" label="selected experiments">Built for the moment<br />after the <span className="text-[#f9b36b]">prototype.</span></SectionMarker>
       <Reveal className="grid gap-4 lg:grid-cols-[.78fr_1.22fr]" stagger={false}>
        <Reveal className="space-y-3">
           {visibleProjects.map((project) => { const Icon = project.icon; const isActive = active === project.id; return <button key={project.id} onClick={() => setActive(project.id)} className={`glass-row group w-full rounded-2xl border p-4 text-left transition-all ${isActive ? 'is-active border-[#66f7df]/70' : 'border-[#29334b]'}`} aria-pressed={isActive} data-testid={`button-project-${project.id}`}><div className="flex items-center gap-4"><span className={`font-mono text-[10px] ${isActive ? 'text-[#f9b36b]' : 'text-[#626d87]'}`}>{project.index}</span><span className={`glass-icon grid h-10 w-10 place-items-center rounded-xl border ${isActive ? 'border-[#66f7df]/60 text-[#66f7df]' : 'border-[#33405b] text-[#77839e]'}`}><Icon className="h-5 w-5" /></span><span className={`flex-1 font-display text-lg ${isActive ? 'text-[#f5f0df]' : 'text-[#a0a9bd]'}`}>{project.title}</span><ChevronRight className={`h-4 w-4 transition-transform ${isActive ? 'translate-x-1 text-[#66f7df]' : 'text-[#626d87]'}`} /></div><div className="mt-3 pl-[4.5rem] font-mono text-[9px] uppercase tracking-[.14em] text-[#69748e]">{project.kicker}</div></button>; })}
          <button
            type="button"
            onClick={toggleProjects}
            aria-expanded={showAllProjects}
            className="glass-button flex w-full items-center justify-between rounded-xl px-4 py-3 font-mono text-[10px] uppercase tracking-[.14em] text-[#aeb6c5]"
            data-testid="button-more-projects"
          >
            <span>{showAllProjects ? 'show less' : `more projects / ${projects.length - 4}`}</span>
            <ChevronRight className={`h-4 w-4 text-[#66f7df] transition-transform ${showAllProjects ? 'rotate-90' : ''}`} />
          </button>
        </Reveal>
         <div className="glass-panel relative min-h-[420px] overflow-hidden rounded-2xl p-7 md:p-10">
          <div className={`pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl ${selected.accent === 'teal' ? 'bg-[#66f7df]/10' : selected.accent === 'amber' ? 'bg-[#f9b36b]/10' : 'bg-[#c29bff]/10'}`} />
          <AnimatePresence mode="wait">
            <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .28 }} className="relative flex h-full min-h-[360px] flex-col">
              <div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#f9b36b]">{selected.kicker}</p><h3 className="mt-5 font-display text-5xl font-semibold tracking-[-.06em] text-[#f5f0df] md:text-6xl" data-testid={`text-project-title-${selected.id}`}>{selected.title}</h3></div><span className="font-mono text-5xl text-[#29334b]">{selected.index}</span></div>
               <div className="mt-8 border-l border-[#66f7df]/60 pl-5">
                 <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#66f7df]">project brief</p>
                 <p className="mt-3 max-w-xl text-lg leading-8 text-[#c2c7d0]">{selected.description}</p>
               </div>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#8490aa]">{selected.detail}</p>
                 <div className="mt-auto pt-10"><div className="mb-6 flex flex-wrap gap-2">{selected.tags.map((tag) => <span key={tag} className="glass-chip rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.12em] text-[#8994ad]">{tag}</span>)}</div><div className="flex flex-wrap items-end justify-between gap-5 border-t border-[#33405b] pt-5"><div><div className="font-display text-3xl text-[#66f7df]">{selected.stat}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[.14em] text-[#69748e]">{selected.statLabel}</div></div><div className="flex items-center gap-4"><button type="button" onClick={() => setDetailOpen(true)} className="glass-button rounded-full px-4 py-2.5 font-mono text-[10px] uppercase tracking-[.12em] text-[#f5f0df]" data-testid={`button-open-case-study-${selected.id}`}>open case study <ArrowUpRight className="ml-1 inline-block h-3 w-3" /></button><a href={selected.href} target="_blank" rel="noreferrer" className="glass-link flex items-center gap-2 text-right font-mono text-[10px] uppercase tracking-[.12em] text-[#f5f0df]" data-testid={`link-project-${selected.id}`}><span className="hidden sm:block"><span className="block">{selected.repoType === 'repository' ? 'view repository' : 'browse github'}</span><span className="mt-1 block break-all text-[9px] normal-case tracking-[.04em] text-[#6f7a94]">{selected.repoLabel}</span></span><Github className="h-4 w-4 shrink-0" /></a></div></div></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
      <AnimatePresence>
        {detailOpen && (
          <motion.div
            className="case-study-backdrop fixed inset-0 z-50 grid place-items-center overflow-y-auto p-5 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setDetailOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: .97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: .98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="case-study-dialog glass-panel relative my-8 w-full max-w-3xl rounded-[1.75rem] p-6 md:p-10"
              role="dialog"
              data-lenis-prevent
              aria-modal="true"
              aria-labelledby="case-study-title"
              data-testid={`dialog-case-study-${selected.id}`}
            >
              <button type="button" onClick={() => setDetailOpen(false)} className="glass-button absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-[#aeb6c5]" aria-label="Close case study" data-testid="button-close-case-study"><X className="h-4 w-4" /></button>
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#f9b36b]">{selected.index} / {selected.kicker}</p>
               <div className="mt-5 flex items-end justify-between gap-5">
                 <h3 id="case-study-title" className="max-w-xl font-display text-5xl font-semibold leading-[.95] tracking-[-.06em] text-[#f5f0df] md:text-7xl">{selected.title}</h3>
                 {selected.id === 'edusense' ? (
                   <img src={`${import.meta.env.BASE_URL}projects/edusense-preview.jpg`} alt="EduSense project logo" width="720" height="720" loading="lazy" className="h-16 w-16 shrink-0 rounded-xl border border-white/20 object-cover shadow-[0_12px_34px_rgba(0,0,0,.3)] sm:h-20 sm:w-20" data-testid="image-case-study-edusense" />
                 ) : (
                   <span className="glass-icon grid h-12 w-12 shrink-0 place-items-center rounded-xl text-[#66f7df]"><selected.icon className="h-5 w-5" /></span>
                 )}
               </div>
              <div className="mt-8 grid gap-8 md:grid-cols-[1.1fr_.9fr]">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#66f7df]">problem</p>
                  <p className="mt-3 text-lg leading-8 text-[#c2c7d0]">{selectedCaseStudy.problem}</p>
                  <p className="mt-5 text-sm leading-7 text-[#8994ad]">{selected.detail}</p>
                </div>
                <div className="space-y-4">
                  <ProjectScreenshotSlot projectId={selected.id} title={selected.title} />
                  <div className="rounded-xl border border-[#33405b] bg-[#11182b]/60 p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#69748e]">result / signal</p>
                    <p className="mt-2 font-display text-4xl text-[#66f7df]" data-testid={`text-case-study-stat-${selected.id}`}>{selected.stat}</p>
                    <p className="mt-1 text-sm text-[#8994ad]">{selected.statLabel}</p>
                  </div>
                  <div className="rounded-xl border border-[#33405b] bg-[#11182b]/60 p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#69748e]">instrumentation</p>
                    <div className="mt-3 flex flex-wrap gap-2">{selected.tags.map((tag) => <span key={tag} className="glass-chip rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.1em] text-[#aeb6c5]">{tag}</span>)}</div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-[#66f7df]">architecture</p>
                <ProjectArchitectureDiagram steps={selectedCaseStudy.architecture} />
              </div>
              <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-[#33405b] pt-5">
                <span className="font-mono text-[10px] uppercase tracking-[.14em] text-[#68718b]">detail view / {selected.repoType}</span>
                <div className="flex flex-wrap gap-3">
                  <a href={selected.href} target="_blank" rel="noreferrer" className="glass-button rounded-full px-4 py-2.5 font-mono text-[10px] uppercase tracking-[.12em] text-[#101321] bg-[#66f7df]" data-testid={`link-case-study-repository-${selected.id}`}>GitHub <Github className="ml-1 inline-block h-3.5 w-3.5" /></a>
                  {liveDemoUrl ? (
                    <a href={liveDemoUrl} target="_blank" rel="noreferrer" className="glass-button rounded-full px-4 py-2.5 font-mono text-[10px] uppercase tracking-[.12em] text-[#f5f0df]" data-testid={`link-case-study-demo-${selected.id}`}>live demo <ExternalLink className="ml-1 inline-block h-3.5 w-3.5" /></a>
                  ) : (
                    <button type="button" disabled title="A verified live demo URL has not been provided." className="cursor-not-allowed rounded-full border border-[#33405b] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[.12em] text-[#69748e]" data-testid={`button-case-study-demo-pending-${selected.id}`}>live demo / link needed</button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Stack() {
  return (
    <section id="stack" className="relative overflow-hidden border-y border-[#29334b] bg-[#111625] scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <SectionMarker number="03" label="the instrument panel">A stack with a<br /><span className="text-[#66f7df]">point of view.</span></SectionMarker>
        <div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]">
          <Reveal><p className="max-w-sm text-xl leading-8 text-[#c3c8d0]">I like understanding the full machine. Models are only useful when they can talk to data, APIs, interfaces, and people.</p><div className="mt-9 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.15em] text-[#f9b36b]"><Terminal className="h-4 w-4" /> system inventory</div></Reveal>
            <Reveal delay={.1} className="grid gap-3 sm:grid-cols-2">
              {skills.map((skill, index) => (
                <div key={skill.label} className="glass-row group rounded-xl border border-[#29334b] p-4" data-testid={`card-skill-${index}`}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="font-display text-sm text-[#e4e1d5]">{skill.label}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[.12em] text-[#6f7a94]">{skill.group}</span>
                  </div>
                  <div className="mb-3 h-1 overflow-hidden rounded-full bg-[#252e45]">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }} transition={{ duration: .9, delay: index * .04 }} className="h-full rounded-full bg-[#66f7df]" />
                  </div>
                  <a href={skill.href} target="_blank" rel="noreferrer" className="font-mono text-[9px] uppercase tracking-[.1em] text-[#8591aa] transition-colors hover:text-[#66f7df]">
                    project / {skill.project} <ArrowUpRight className="ml-1 inline h-3 w-3" />
                  </a>
                </div>
              ))}
            </Reveal>
        </div>
        <div className="mt-16 grid gap-4 border-t border-[#29334b] pt-8 text-[#8994ad] sm:grid-cols-3">
          <div className="flex gap-3"><Cpu className="mt-1 h-4 w-4 text-[#66f7df]" /><div><div className="font-mono text-[10px] uppercase tracking-[.15em] text-[#e4e1d5]">learn</div><p className="mt-2 text-sm leading-6">PyTorch, model training, DeepFace, object detection</p></div></div>
          <div className="flex gap-3"><Code2 className="mt-1 h-4 w-4 text-[#f9b36b]" /><div><div className="font-mono text-[10px] uppercase tracking-[.15em] text-[#e4e1d5]">ship</div><p className="mt-2 text-sm leading-6">Django, FastAPI, React, Node, REST APIs</p></div></div>
          <div className="flex gap-3"><Layers3 className="mt-1 h-4 w-4 text-[#c29bff]" /><div><div className="font-mono text-[10px] uppercase tracking-[.15em] text-[#e4e1d5]">ground</div><p className="mt-2 text-sm leading-6">PostgreSQL, MySQL, MongoDB, ChromaDB, Git</p></div></div>
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  const milestones = [
    ['AUG 2026', 'speaker', 'AI Tinkerers', 'Presenting EduSense 2 — a room full of builders, one very live system.'],
    ['JUN 2026', 'participant', 'Tech Skills Forum', 'Showing up where technical curiosity becomes practical craft.'],
    ['2025', 'completed', 'Digitopia / MCIT', 'Completed phase two of the MCIT Software & AI competition, first edition. Done, and on to the next build.'],
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-12 md:grid-cols-[.8fr_1.2fr]">
        <Reveal><p className="mb-3 font-mono text-[11px] uppercase tracking-[.24em] text-[#f9b36b]">04 / trajectory</p><h2 className="font-display text-4xl font-semibold leading-none tracking-[-.05em] text-[#f5f0df] md:text-6xl">Still early.<br /><span className="text-[#66f7df]">Already in motion.</span></h2></Reveal>
        <Reveal delay={.12}><div className="divide-y divide-[#29334b] border-y border-[#29334b]">{milestones.map(([date, type, title, text]) => <div key={title} className="grid gap-4 py-6 sm:grid-cols-[100px_1fr]"><div className="font-mono text-[10px] tracking-[.12em] text-[#f9b36b]">{date}</div><div><div className="flex flex-wrap items-center gap-3"><h3 className="font-display text-xl text-[#f5f0df]">{title}</h3><span className="rounded-full border border-[#33405b] px-2 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-[#77829b]">{type}</span></div><p className="mt-2 max-w-lg text-sm leading-6 text-[#8f9ab4]">{text}</p></div></div>)}</div></Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const email = 'Adel.moh129649@gmail.com';
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(email); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); }
  };
  return (
    <section id="contact" className="outro-section relative overflow-hidden border-t border-[#29334b] scroll-mt-24">
      <div className="absolute -right-20 top-0 h-[430px] w-[430px] rounded-full bg-[#66f7df]/[.06] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <div className="outro-glass-shell grid gap-14 rounded-[2rem] p-6 md:p-10 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <Reveal><p className="mb-4 font-mono text-[11px] uppercase tracking-[.24em] text-[#f9b36b]">06 / establish contact</p><h2 className="max-w-3xl font-display text-[clamp(3.8rem,9vw,8rem)] font-semibold leading-[.86] tracking-[-.075em] text-[#f5f0df]">Have a hard<br /><span className="text-[#66f7df]">problem?</span></h2><p className="mt-8 max-w-md text-lg leading-8 text-[#aeb6c5]">I’m interested in the messy, specific questions that become better when someone builds the first version.</p><a href="#message" className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#f9b36b] px-6 py-3.5 font-mono text-[11px] uppercase tracking-[.14em] text-[#101321] transition hover:bg-[#66f7df]" data-testid="link-contact-email"><Mail className="h-4 w-4" /> start a thread <ArrowUpRight className="h-4 w-4" /></a></Reveal>
            <Reveal delay={.12}><div className="space-y-3"><a href="https://wa.me/201012029758" target="_blank" rel="noreferrer" className="glass-row group flex items-center gap-4 rounded-xl p-4" data-testid="link-contact-whatsapp"><span className="glass-icon grid h-10 w-10 place-items-center rounded-lg text-[#66f7df]"><MessageCircle className="h-5 w-5" /></span><span className="flex-1"><span className="block font-mono text-[10px] uppercase tracking-[.14em] text-[#6f7a94]">message directly</span><span className="mt-1 block text-sm text-[#d7d6ca]">WhatsApp / +20 101 202 9758</span></span><ArrowUpRight className="h-4 w-4 text-[#6f7a94] transition group-hover:text-[#66f7df]" /></a><a href="https://www.linkedin.com/in/adel-mohamed-noufal-3a9440348/" target="_blank" rel="noreferrer" className="glass-row group flex items-center gap-4 rounded-xl p-4" data-testid="link-contact-linkedin"><span className="glass-icon grid h-10 w-10 place-items-center rounded-lg text-[#66f7df]"><Linkedin className="h-5 w-5" /></span><span className="flex-1"><span className="block font-mono text-[10px] uppercase tracking-[.14em] text-[#6f7a94]">connect professionally</span><span className="mt-1 block text-sm text-[#d7d6ca]">LinkedIn / 500+ connections</span></span><ArrowUpRight className="h-4 w-4 text-[#6f7a94] transition group-hover:text-[#66f7df]" /></a><a href="https://github.com/adel-noufal" target="_blank" rel="noreferrer" className="glass-row group flex items-center gap-4 rounded-xl p-4" data-testid="link-contact-github"><span className="glass-icon grid h-10 w-10 place-items-center rounded-lg text-[#f9b36b]"><Github className="h-5 w-5" /></span><span className="flex-1"><span className="block font-mono text-[10px] uppercase tracking-[.14em] text-[#6f7a94]">inspect the work</span><span className="mt-1 block text-sm text-[#d7d6ca]">GitHub / adel-noufal</span></span><ArrowUpRight className="h-4 w-4 text-[#6f7a94] transition group-hover:text-[#66f7df]" /></a><a href={cvHref} download className="glass-row group flex items-center gap-4 rounded-xl p-4" data-testid="link-contact-cv"><span className="glass-icon grid h-10 w-10 place-items-center rounded-lg text-[#f9b36b]"><Download className="h-5 w-5" /></span><span className="flex-1"><span className="block font-mono text-[10px] uppercase tracking-[.14em] text-[#6f7a94]">download profile</span><span className="mt-1 block text-sm text-[#d7d6ca]">Curriculum vitae / PDF</span></span><ArrowUpRight className="h-4 w-4 text-[#6f7a94] transition group-hover:text-[#66f7df]" /></a><button type="button" onClick={copyEmail} className="glass-row group flex w-full items-center gap-4 rounded-xl p-4 text-left" data-testid="button-copy-email"><span className="glass-icon grid h-10 w-10 place-items-center rounded-lg text-[#c29bff]">{copied ? <Check className="h-5 w-5" /> : <Send className="h-5 w-5" />}</span><span className="flex-1"><span className="block font-mono text-[10px] uppercase tracking-[.14em] text-[#6f7a94]">{copied ? 'copied to clipboard' : 'or send a direct signal'}</span><span className="mt-1 block break-all text-sm text-[#d7d6ca]">{email}</span></span><CopyIcon copied={copied} /></button></div></Reveal>
        </div>
        <div className="mt-24 flex flex-col justify-between gap-5 border-t border-[#33405b] pt-5 font-mono text-[10px] uppercase tracking-[.15em] text-[#69748e] sm:flex-row"><span>Adel Mohamed Noufal / AI &amp; Data Science Student</span><span>{availability.long} <span className="mx-2 text-[#33405b]">·</span> made with curiosity</span></div>
      </div>
    </section>
  );
}

function CopyIcon({ copied }: { copied: boolean }) {
  return copied ? <Check className="h-4 w-4 text-[#66f7df]" /> : <ArrowUpRight className="h-4 w-4 text-[#6f7a94] transition group-hover:text-[#66f7df]" />;
}

function Home() {
  useEffect(() => {
    const anchorId = window.location.hash.slice(1);
    if (!anchorId) return;
    const target = document.getElementById(anchorId);
    if (!target) return;
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    target.scrollIntoView({ block: 'start', behavior: 'auto' });
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = previousBehavior;
    });
  }, []);

  const trackPortfolioInteraction = (event: ReactMouseEvent<HTMLElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-testid]');
    const testId = target?.dataset.testid;
    if (!testId) return;

    if (testId.startsWith('button-project-')) {
      trackEvent('project_selected', { project: testId.replace('button-project-', '') });
    } else if (testId.startsWith('button-open-case-study-')) {
      trackEvent('case_study_opened', { project: testId.replace('button-open-case-study-', '') });
    } else if (testId.startsWith('link-case-study-repository-')) {
      trackEvent('case_study_source_opened', { project: testId.replace('link-case-study-repository-', '') });
    } else if (testId.startsWith('link-project-')) {
      trackEvent('project_source_opened', { project: testId.replace('link-project-', '') });
    } else if (testId === 'link-contact-whatsapp') {
      trackEvent('contact_action', { channel: 'whatsapp' });
    } else if (testId === 'link-contact-linkedin') {
      trackEvent('contact_action', { channel: 'linkedin' });
    } else if (testId === 'link-contact-email') {
      trackEvent('contact_action', { channel: 'email' });
    } else if (testId === 'button-copy-email') {
      trackEvent('email_copied');
    } else if (testId.includes('-cv')) {
      trackEvent('cv_download_initiated', { surface: testId.replace('link-', '') });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.main
        onClick={trackPortfolioInteraction}
        className="grain min-h-[100dvh] bg-[#101321] page-enter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.42 }}
      >
        <ScrollProgress />
        <CustomCursor />
        <Header />
        <ContactShortcut />
        <Hero /><TechMarquee /><About /><ProofSignals /><EduSenseFeature /><Work /><MoreWork projects={projects} /><Results /><Stack /><Timeline /><EventGallery /><Certificates /><Testimonials /><Contact /><ContactForm />
      </motion.main>
    </MotionConfig>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Effects /><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;