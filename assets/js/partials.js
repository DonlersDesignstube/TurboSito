import { basePath, langPrefix as sharedLangPrefix, withBase } from './path.shared.js';

function isInternal(url) {
  try { const u = new URL(url, location.origin); return u.origin === location.origin; }
  catch { return /^\/(?!\/)/.test(url); }
}

function localizePath(p) {
  const hasLang = /^\/(de|en|it)\b/.test(p);
  const needsHtml = /\/$/.test(p);
  let path = p;
  if (!hasLang) path = sharedLangPrefix() + (p.startsWith('/') ? p : '/' + p);
  if (needsHtml) path += 'index.html';
  return path;
}

export function rewriteInternalLinks(root = document) {
  const sel = [
    'a[href^="/"]', 'link[rel="alternate"][href^="/"]', 'link[rel="canonical"][href^="/"]',
    'img[src^="/"]', 'script[src^="/"]'
  ].join(',');

  root.querySelectorAll(sel).forEach(el => {
    const attr = el.hasAttribute('href') ? 'href' : 'src';
    const raw = el.getAttribute(attr);
    if (!raw || !isInternal(raw)) return;

    let path = raw;
    path = localizePath(path);
    const fixed = withBase(path);
    el.setAttribute(attr, fixed);
  });
}

(() => {
  const CACHE = new Map();
  let injected = false;
  const once = (fn) => { let ran=false; return (...a)=>{ if(ran) return; ran=true; return fn(...a);} };

  const langRe = /^\/(de|en|it)\b/;
  const norm = (p) => p.replace(/\/index\.html$/,'/').replace(/\/+$/,'/');

  function langPrefix() {
    const m = location.pathname.match(langRe);
    return m ? `/${m[1]}` : '';
  }

  function resolvePartialPath(rel) {
    // Partials liegen unter /partials/ (nicht sprachspezifisch)
    if (/^\.\.?(?:\/).*/.test(rel)) return rel;
    return `${langPrefix()}/partials/${rel}`.replace(/\/{2,}/g,'/');
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
    if (injected) return; // idempotent
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
    rewriteInternalLinks(document);
    if (window.initThemeToggle) window.initThemeToggle();

    const cur = norm(location.pathname);
    document.querySelectorAll('a[data-nav]').forEach(a => {
      const target = norm(a.getAttribute('href') || '/');
      const langed = target.match(langRe) ? target : (langPrefix() + target);
      const isActive = norm(langed) === cur;
      a.classList.toggle('is-active', isActive);
      a.setAttribute('aria-current', isActive ? 'page' : null);
    });

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
