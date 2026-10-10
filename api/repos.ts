// Vercel serverless function: cached GitHub repo list. Optional env var GITHUB_TOKEN raises the rate limit.
export default async function handler(req: any, res: any) {
  const user = (req.query?.user as string) || 'adel-noufal';
  try {
    const r = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`, {
      headers: { Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) },
    });
    if (!r.ok) return res.status(r.status).json({ error: 'github' });
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
    return res.status(200).json(await r.json());
  } catch {
    return res.status(502).json({ error: 'fetch failed' });
  }
}
