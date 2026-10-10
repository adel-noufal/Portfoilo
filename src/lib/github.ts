import { useEffect, useState } from 'react';
import { githubUser, hiddenRepos } from '@/config';

export type Repo = { name: string; description: string | null; html_url: string; language: string | null; stargazers_count: number; pushed_at: string; topics?: string[]; fork: boolean; archived: boolean };
type Curated = { id: string; title: string; href: string };

const KEY = 'gh-repos-v1';
let shared: Promise<Repo[]> | null = null;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

async function load(): Promise<Repo[]> {
  try { const c = JSON.parse(localStorage.getItem(KEY) || 'null'); if (c && Date.now() - c.t < 3600_000) return c.d; } catch {}
  const urls = ['/api/repos?user=' + githubUser, `https://api.github.com/users/${githubUser}/repos?per_page=100&sort=updated`];
  for (const u of urls) {
    try {
      const r = await fetch(u); if (!r.ok) continue;
      const d = await r.json(); if (!Array.isArray(d)) continue;
      try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d })); } catch {}
      return d;
    } catch {}
  }
  try { const c = JSON.parse(localStorage.getItem(KEY) || 'null'); if (c) return c.d; } catch {}
  return [];
}

/** Public, non-fork repos that are not already shown as curated projects. Newest first. */
export function useExtraRepos(curated: Curated[]): Repo[] {
  const [repos, setRepos] = useState<Repo[]>([]);
  useEffect(() => {
    let live = true;
    (shared ??= load()).then((all) => {
      if (!live) return;
      const hidden = hiddenRepos.map(norm);
      const known = (r: Repo) => curated.some((c) => {
        const n = norm(r.name);
        return c.href.toLowerCase().includes('/' + r.name.toLowerCase()) || (n.length >= 5 && (norm(c.title).includes(n) || n.includes(norm(c.title)) || n.includes(norm(c.id))));
      });
      setRepos(all.filter((r) => !r.fork && !r.archived && !hidden.includes(norm(r.name)) && !known(r))
        .sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at)));
    });
    return () => { live = false; };
  }, [curated]);
  return repos;
}
