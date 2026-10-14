// Writes public/sitemap.xml and public/robots.txt using VITE_SITE_URL (runs before `npm run build`).
import { writeFileSync } from 'node:fs';

const raw = process.env.VITE_SITE_URL || '';
const site = (raw || 'https://YOUR-DOMAIN.example').replace(/\/$/, '');
if (!raw) console.warn('[seo] VITE_SITE_URL is not set: sitemap.xml and robots.txt contain a placeholder domain.');

const paths = ['/', '/services', '/about', '/contact'];
const urls = paths.map((p) => `  <url><loc>${site}${p}</loc></url>`).join('\n');
writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml\n`);
