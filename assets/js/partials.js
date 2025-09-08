import { basePath, langPrefix, withBase, resolveLocalized, stripBaseAndLang } from './path.shared.js';

let __linksDone = false;

function hydrateNavRoutes(root = document) {
  const lang = (langPrefix().slice(1) || 'de');
  root.querySelectorAll('a[data-route]').forEach(a => {
    const key = a.getAttribute('data-route');
    const url = resolveLocalized(key, lang);
    if (url) a.setAttribute('href', url);
  });
}

function isInternalUrl(u) {
  if (!u || u.startsWith('#') || u.startsWith('mailto:') || u.startsWith('tel:') || /^https?:\/\//.test(u)) return false;
  return u.startsWith('/');
}

function normalizeOnce(raw) {
  let p = stripBaseAndLang(raw);
  if (p.endsWith('/')) p += 'index.html';
  const lang = langPrefix();
  return withBase(`${lang}/${p}`.replace(/\/{2,}/g, '/'));
}

export function rewriteInternalLinks(root = document) {
  if (__linksDone) return;
  hydrateNavRoutes(root); // 1) routes zuerst (data-route → sprachbewusste URLs)

  const sel = [
    'a[href^="/"]:not([data-route])',
    'link[rel="alternate"][href^="/"]',
    'link[rel="canonical"][href^="/"]',
    'img[src^="/"]',
    'script[src^="/"]'
  ].join(',');

  root.querySelectorAll(sel).forEach(el => {
    const attr = el.hasAttribute('href') ? 'href' : 'src';
    const raw  = el.getAttribute(attr);
    if (!isInternalUrl(raw)) return;

    // Bereits korrekt? -> Wenn schon Repo- + Sprach-Prefix vorhanden, nicht erneut anfassen
    const alreadyBase = raw.startsWith(basePath() + '/');
    const alreadyLang = /^\/(de|en|it)\b/.test(raw.replace(basePath(), ''));
    if (alreadyBase && alreadyLang) return;

    // Query + Hash erhalten
    const u = new URL(raw, location.origin);
    const normalizedPath = normalizeOnce(u.pathname);
    let finalUrl = normalizedPath + u.search + u.hash;

    // Canonical/Alternate als absolute URLs ausgeben (SEO best practice)
    const isHeadLink = el.tagName === 'LINK' && (el.rel === 'canonical' || el.rel === 'alternate');
    if (isHeadLink) {
      finalUrl = new URL(finalUrl, location.origin).toString();
    }

    el.setAttribute(attr, finalUrl);
    el.setAttribute('data-rewritten', '1');
  });

  __linksDone = true; // 2) Flag setzen
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
