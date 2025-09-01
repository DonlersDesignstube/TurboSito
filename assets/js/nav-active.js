/* nav-active.js */
(() => {
  const norm = p => (p.replace(/\/index\.html$/,'/').replace(/\/+$/,'/') || '/');
  const here = norm(location.pathname);
  document.querySelectorAll('nav a[href]').forEach(a => {
    try {
      const href = new URL(a.getAttribute('href'), location.origin).pathname;
      if (norm(href) === here) a.setAttribute('aria-current','page');
    } catch (e) {}
  });
})();
