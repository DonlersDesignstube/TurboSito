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

export function setCanonicalAndHreflang({ baseUrl, langMap, currentLang, path }) {
  // Canonical
  const linkC = document.createElement('link');
  linkC.rel = 'canonical';
  linkC.href = `${baseUrl}${path}`;
  document.head.appendChild(linkC);
  // hreflang
  Object.entries(langMap).forEach(([code, href]) => {
    const l = document.createElement('link');
    l.rel = 'alternate';
    l.hreflang = code;
    l.href = `${baseUrl}${href}`;
    document.head.appendChild(l);
  });
  const xd = document.createElement('link');
  xd.rel = 'alternate';
  xd.hreflang = 'x-default';
  xd.href = `${baseUrl}${langMap[currentLang]}`;
  document.head.appendChild(xd);
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

