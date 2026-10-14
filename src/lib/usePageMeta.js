import { useEffect } from 'react';

const SITE = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '');

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', value);
}

// Per-page title, description, Open Graph, robots and canonical (canonical needs VITE_SITE_URL).
export default function usePageMeta(title, description, { noindex = false } = {}) {
  useEffect(() => {
    const full = `${title} | Ethixweb India`;
    document.title = full;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    let link = document.head.querySelector('link[rel="canonical"]');
    if (SITE && !noindex) {
      if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
      link.href = SITE + window.location.pathname;
      setMeta('property', 'og:url', link.href);
    } else link?.remove();
  }, [title, description, noindex]);
}
