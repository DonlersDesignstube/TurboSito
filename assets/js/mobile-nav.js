(() => {
  const KEYCLOSE = 27;
  const root = document.documentElement;
  const btn = document.querySelector('[data-nav-toggle]');
  let menu = document.getElementById('mobile-menu');
  if (!menu) {
    menu = document.createElement('div');
    menu.id='mobile-menu'; menu.className='mobile-menu';
    menu.innerHTML = `
      <div class="overlay" data-nav-close></div>
      <div class="panel card">
        <nav class="mobile-links" aria-label="Mobile Hauptnavigation"></nav>
        <nav class="lang-switch" aria-label="Sprache"></nav>
      </div>`;
    document.body.appendChild(menu);
  }
  const linksSrc = document.querySelector('nav.site-nav');
  const linksDst = menu.querySelector('.mobile-links');
  if (linksSrc && linksDst && !linksDst.childElementCount) {
    // Links kopieren (nur <a>)
    linksDst.innerHTML = [...linksSrc.querySelectorAll('a')].map(a => {
      const href = a.getAttribute('href'); const txt = a.textContent.trim();
      const cur = a.getAttribute('aria-current') ? ' aria-current="page"' : '';
      return `<a href="${href}"${cur}>${txt}</a>`;
    }).join('');
  }
  const langSrc = document.querySelector('nav.lang-switch');
  const langDst = menu.querySelector('.lang-switch');
  if (langSrc && langDst && !langDst.childElementCount) langDst.innerHTML = langSrc.innerHTML;

  const open = () => { menu.classList.add('open'); btn?.setAttribute('aria-expanded','true'); };
  const close = () => { menu.classList.remove('open'); btn?.setAttribute('aria-expanded','false'); };
  btn?.addEventListener('click', () => menu.classList.contains('open') ? close() : open());
  menu.addEventListener('click', (e) => { if (e.target.closest('[data-nav-close]')) close(); });
  document.addEventListener('keydown', (e) => { if (e.keyCode===KEYCLOSE) close(); });
})();
