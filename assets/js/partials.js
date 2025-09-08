(function () {
  const CACHE = new Map();

  function langPrefix() {
    // Pfad beginnt z.B. mit /de/ | /en/ | /it/ -> liefere "de" etc., sonst ""
    const m = location.pathname.match(/^\/(de|en|it)\b/);
    return m ? `/${m[1]}` : "";
  }

  function resolvePartialPath(rel) {
    // Partials liegen global unter /partials/*.html
    const lp = langPrefix(); // für korrekte relative Links in <a href="...">
    return `${lp || ""}/partials/${rel}`.replace(/\/{2,}/g, "/");
  }

  async function fetchPartial(url) {
    if (CACHE.has(url)) return CACHE.get(url);
    const p = fetch(url, { credentials: "same-origin" })
      .then(r => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .catch(() => `<!-- partial "${url}" failed to load -->`);
    CACHE.set(url, p);
    return p;
  }

  async function injectPartials(root = document) {
    const nodes = [...root.querySelectorAll("[data-include]")];
    for (const el of nodes) {
      const file = el.getAttribute("data-include");
      const url = resolvePartialPath(file);
      const html = await fetchPartial(url);
      el.outerHTML = html;
    }
    // Nach Injection: Theme-Toggle + Nav aktivieren
    if (window.initThemeToggle) window.initThemeToggle();
    markActiveNav();
    document.dispatchEvent(new CustomEvent("partials:ready"));
  }

  function markActiveNav() {
    const path = location.pathname.replace(/\/index\.html$/, "/");
    document.querySelectorAll('a[data-nav]').forEach(a => {
      const target = a.getAttribute('href').replace(/\/index\.html$/, "/");
      a.classList.toggle('is-active', target === path);
      a.setAttribute('aria-current', target === path ? 'page' : null);
    });
  }

  // Public
  window.Partials = { injectPartials };
})();
