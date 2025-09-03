(() => {
  const btn = document.querySelector('[data-nav-toggle]');
  if (!btn) return;

  let menu = document.getElementById('mobile-menu');
  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'mobile-menu';
    menu.className = 'mobile-menu';
    menu.innerHTML = `
      <div class="overlay" data-nav-close></div>
      <div class="panel card">
        <nav class="mobile-links" aria-label="Mobile Hauptnavigation"></nav>
        <div class="divider"></div>
        <nav class="lang-switch mobile" aria-label="Sprache"></nav>
      </div>`;
    document.body.appendChild(menu);
  }

  const trackLinks = () => {
    const src = document.querySelector('nav.site-nav');
    const dst = menu.querySelector('.mobile-links');
    if (src && dst && !dst.childElementCount) {
      dst.innerHTML = [...src.querySelectorAll('a')].map(a => {
        const href = a.getAttribute('href');
        const txt  = a.textContent.trim();
        const cur  = a.getAttribute('aria-current') ? ' aria-current="page"' : '';
        return `<a href="${href}"${cur}>${txt}</a>`;
      }).join('');
    }
  };

  const trackLang = () => {
    const src = document.querySelector('nav.lang-switch');
    const dst = menu.querySelector('nav.lang-switch.mobile');
    if (dst && !dst.childElementCount) {
      if (src) dst.innerHTML = src.innerHTML;
      else {
        const base = location.pathname
          .replace(/\/(de|en|it)\//i,'/$1/')
          .split('/')
          .slice(0,3)
          .join('/');
        dst.innerHTML = ['de','en','it'].map(l =>
          `<a href="${base.replace(/\/(de|en|it)\//i, `/${l}/`)}"${document.documentElement.lang?.startsWith(l)?' aria-current="page"':''}>${l.toUpperCase()}</a>`
        ).join('');
      }
    }
  };

  const open = () => { menu.classList.add('open'); btn.setAttribute('aria-expanded','true'); };
  const close = () => { menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); };

  btn.addEventListener('click', () => menu.classList.contains('open') ? close() : open());
  menu.addEventListener('click', e => { if (e.target.closest('[data-nav-close]')) close(); });

  trackLinks();
  trackLang();
})();
