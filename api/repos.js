// Vercel serverless function: cached GitHub repo list. Optional env var GITHUB_TOKEN raises the rate limit.
export default async function handler(req, res) {
  const user = (req.query && req.query.user) || 'adel-noufal';
  const headers = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = 'Bearer ' + process.env.GITHUB_TOKEN;
  try {
    const r = await fetch('https://api.github.com/users/' + user + '/repos?per_page=100&sort=updated', { headers });
    if (!r.ok) return res.status(r.status).json({ error: 'github' });
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
    return res.status(200).json(await r.json());
  } catch (e) {
    return res.status(502).json({ error: 'fetch failed' });
  }
}
