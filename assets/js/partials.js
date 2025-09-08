import { normalizeInternalHref, langPrefix } from './path.shared.js';

let __linksDone = false;

function hydrateNavRoutes(root=document){
  const lang = (langPrefix().slice(1) || 'de');
  const routes = {
    de: { home:'/', about:'/ueber-mich/', services:'/leistungen/', portfolio:'/portfolio.html', contact:'/kontakt/' },
    en: { home:'/', about:'/about.html', services:'/services.html', portfolio:'/portfolio.html', contact:'/contact.html' },
    it: { home:'/', about:'/chi-sono.html', services:'/servizi.html', portfolio:'/portfolio.html', contact:'/contatti.html' }
  }[lang] || {};
  root.querySelectorAll('a[data-route]').forEach(a=>{
    const key = a.getAttribute('data-route');
    let target = routes[key] || a.getAttribute('href') || '/';
    if (target.endsWith('/')) target += 'index.html';
    a.setAttribute('href', normalizeInternalHref(target));
  });
}

export function rewriteInternalLinks(root=document){
  if (__linksDone) return;

  // 1) Zuerst routes hydratisieren (setzt korrekte Hrefs)
  hydrateNavRoutes(root);

  // 2) Dann *alle* internen Links normalisieren – auch relative!
  const sel = [
    'a[href]:not([href^="http"]):not([href^="mailto:"]):not([href^="tel:"])',
    'link[rel="alternate"][href]',
    'link[rel="canonical"][href]',
    'img[src]:not([src^="http"])',
    'script[src]:not([src^="http"])'
  ].join(',');

  root.querySelectorAll(sel).forEach(el=>{
    const attr = el.hasAttribute('href') ? 'href' : 'src';
    const raw  = el.getAttribute(attr);
    if (!raw || raw.startsWith('#')) return;

    const isHead = el.tagName === 'LINK' && (el.rel === 'canonical' || el.rel === 'alternate');
    const final = normalizeInternalHref(raw, { absoluteForHead: isHead });

    if (final !== raw) el.setAttribute(attr, final);
  });

  __linksDone = true;
}

function markActiveNav() {
  const norm = p => p.replace(/\/index\.html$/, '/').replace(/\/+$/, '/');
  const cur = norm(location.pathname);
  document.querySelectorAll('a[data-nav]').forEach(a => {
    const target = norm(a.getAttribute('href') || '/');
    const isActive = target === cur;
    a.classList.toggle('is-active', isActive);
    a.setAttribute('aria-current', isActive ? 'page' : null);
  });
}

(() => {
  const CACHE = new Map();
  let injected = false;
  const once = (fn) => { let ran = false; return (...a) => { if (ran) return; ran = true; return fn(...a); }; };

  function resolvePartialPath(rel) {
    if (/^\.\.?\//.test(rel)) return rel;
    return `${langPrefix()}/partials/${rel}`.replace(/\/{2,}/g, '/');
  }

  function fetchWithTimeout(url, { timeout = 6000 } = {}) {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), timeout);
    return fetch(url, { signal: ctrl.signal, credentials: 'same-origin' })
      .finally(() => clearTimeout(id));
  }

  async function fetchPartial(url, retries = 1) {
    if (CACHE.has(url)) return CACHE.get(url);
    const p = (async () => {
      try {
        const r = await fetchWithTimeout(url);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return await r.text();
      } catch (e) {
        if (retries > 0) return fetchPartial(url, retries - 1);
        console.warn('[partials] failed:', url, e);
        return `<!-- partial "${url}" failed -->`;
      }
    })();
    CACHE.set(url, p);
    return p;
  }

  async function injectPartials(root = document) {
    if (injected) return;
    const nodes = [...root.querySelectorAll('[data-include]')];
    for (const el of nodes) {
      const file = el.getAttribute('data-include');
      let url = (window.Partials && window.Partials.__resolve)
        ? await window.Partials.__resolve(file)
        : resolvePartialPath(file);
      const html = await fetchPartial(url);
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      el.replaceWith(...wrapper.childNodes);
    }
    injected = true;

    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main';
    const skip = document.querySelector('a[href="#main"]');
    if (skip) skip.removeAttribute('hidden');

    focusHash();
    document.dispatchEvent(new CustomEvent('partials:ready'));
  }

  function focusHash() {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    if (target) target.setAttribute('tabindex', '-1'), target.focus();
  }
  window.addEventListener('hashchange', focusHash, { passive: true });

  window.Partials = {
    injectPartials,
    ready: () => new Promise(r => {
      if (injected) return r();
      document.addEventListener('partials:ready', once(r), { once: true });
    })
  };
})();

// Nach dem Partial-Inject:
document.addEventListener('partials:ready', () => {
  rewriteInternalLinks(document);
  markActiveNav();
}, { once: true });
