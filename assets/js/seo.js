import { asset } from './path.portfolio.js';
import { normalizeInternalHref } from './path.shared.js';

export function injectItemListJSONLD({ items, lang, baseUrl, pagePath }) {
  try {
    const list = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": items.map((it, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `${baseUrl}${it.caseUrl}`,
        "name": it.title
      }))
    };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(list);
    document.head.appendChild(s);
  } catch {}
}

export function setCanonical(path){
  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = normalizeInternalHref(path, { absoluteForHead:true });
  document.head.appendChild(link);
}

export function setAlternate(path, lang){
  const link = document.createElement('link');
  link.rel = 'alternate';
  link.hreflang = lang;
  link.href = normalizeInternalHref(path, { absoluteForHead:true });
  document.head.appendChild(link);
}

export function setCanonicalAndHreflang({ langMap, currentLang, path }) {
  setCanonical(path);
  Object.entries(langMap).forEach(([code, href]) => setAlternate(href, code));
  const xd = document.createElement('link');
  xd.rel = 'alternate';
  xd.hreflang = 'x-default';
  xd.href = normalizeInternalHref(langMap[currentLang], { absoluteForHead:true });
  document.head.appendChild(xd);
}

export async function fetchSiteMeta(lang){
  const res = await fetch(asset(`assets/data/site.meta.${lang}.json`));
  return await res.json();
}

export function setOpenGraphFallback(meta) {
  const ensure = (name, content) => {
    if (!document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)) {
      const m = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('twitter:')) m.setAttribute('property', name);
      else m.setAttribute('name', name);
      m.setAttribute('content', content);
      document.head.appendChild(m);
    }
  };
  ensure('og:type', 'website');
  ensure('twitter:card', 'summary');
  if (meta?.title) { ensure('og:title', meta.title); ensure('twitter:title', meta.title); }
  if (meta?.description) { ensure('og:description', meta.description); ensure('twitter:description', meta.description); }
}

